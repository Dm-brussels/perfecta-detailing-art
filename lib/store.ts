import "server-only";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Stockage persistant minimaliste des leads et des interactions.
 *
 * Vercel Blob en production (un fichier par enregistrement, aucune base à
 * administrer), système de fichiers local en développement.
 *
 * Les leads contiennent des données personnelles : le store est privé (lecture
 * authentifiée par le token) et le contenu est en plus chiffré au repos en
 * AES-256-GCM. Les événements ne contiennent que leur type et leur date,
 * portés par le nom du fichier — aucun contenu à télécharger pour construire
 * les statistiques.
 */

export type Lead = {
  id: string;
  createdAt: string;
  service: string;
  serviceLabel: string;
  vehicle: string;
  timing: string;
  timingLabel: string;
  message: string;
  name: string;
  phone: string;
  email: string;
  lang: string;
};

export type EventKind = "whatsapp_open" | "whatsapp_click" | "phone_click";

export type TrackedEvent = {
  kind: EventKind;
  createdAt: string;
};

const LEAD_PREFIX = "leads/";
const EVENT_PREFIX = "events/";
const LOCAL_DIR = path.join(process.cwd(), ".data");

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/* ───────────────────────── Chiffrement ───────────────────────── */

function key() {
  const secret = process.env.LEADS_SECRET ?? process.env.LEADS_PASSWORD ?? "";
  // Une clé de 32 octets dérivée du secret : stable entre deux déploiements.
  return crypto.createHash("sha256").update(`pda-leads::${secret}`).digest();
}

function encrypt(plain: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return `${iv.toString("base64url")}.${cipher
    .getAuthTag()
    .toString("base64url")}.${enc.toString("base64url")}`;
}

function decrypt(payload: string): string | null {
  try {
    const [ivB64, tagB64, dataB64] = payload.split(".");
    if (!ivB64 || !tagB64 || !dataB64) return null;
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key(),
      Buffer.from(ivB64, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(dataB64, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}

/* ───────────────────────── Écriture ───────────────────────── */

/** Horodatage utilisable dans un nom de fichier (les `:` sont proscrits). */
function stamp(iso: string) {
  return iso.replace(/[:.]/g, "-");
}

async function writeLocal(pathname: string, body: string) {
  const file = path.join(LOCAL_DIR, pathname);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body, "utf8");
}

export async function saveLead(
  lead: Omit<Lead, "id" | "createdAt">,
): Promise<void> {
  const record: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const pathname = `${LEAD_PREFIX}${stamp(record.createdAt)}__${record.id}.txt`;
  const body = encrypt(JSON.stringify(record));

  if (!hasBlob()) {
    await writeLocal(pathname, body);
    return;
  }
  const { put } = await import("@vercel/blob");
  await put(pathname, body, {
    access: "private",
    addRandomSuffix: true,
    contentType: "text/plain",
  });
}

export async function recordEvent(kind: EventKind): Promise<void> {
  const createdAt = new Date().toISOString();
  const pathname = `${EVENT_PREFIX}${stamp(createdAt)}__${kind}.txt`;

  if (!hasBlob()) {
    await writeLocal(pathname, kind);
    return;
  }
  const { put } = await import("@vercel/blob");
  await put(pathname, kind, {
    access: "private",
    addRandomSuffix: true,
    contentType: "text/plain",
  });
}

/* ───────────────────────── Lecture ───────────────────────── */

type BlobEntry = { pathname: string; local?: string };

async function listAll(prefix: string): Promise<BlobEntry[]> {
  if (!hasBlob()) {
    const dir = path.join(LOCAL_DIR, prefix);
    try {
      const names = await fs.readdir(dir);
      return names.map((n) => ({
        pathname: `${prefix}${n}`,
        local: path.join(dir, n),
      }));
    } catch {
      return [];
    }
  }

  const { list } = await import("@vercel/blob");
  const entries: BlobEntry[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, limit: 1000, cursor });
    entries.push(...page.blobs.map((b) => ({ pathname: b.pathname })));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return entries;
}

async function readEntry(entry: BlobEntry): Promise<string | null> {
  try {
    if (entry.local) return await fs.readFile(entry.local, "utf8");
    const { get } = await import("@vercel/blob");
    const res = await get(entry.pathname, { access: "private" });
    if (!res || res.statusCode !== 200) return null;
    return await new Response(res.stream).text();
  } catch {
    return null;
  }
}

export async function listLeads(): Promise<Lead[]> {
  const entries = await listAll(LEAD_PREFIX);
  const contents = await Promise.all(entries.map(readEntry));

  const leads: Lead[] = [];
  for (const raw of contents) {
    if (!raw) continue;
    const json = decrypt(raw.trim());
    if (!json) continue;
    try {
      leads.push(JSON.parse(json) as Lead);
    } catch {
      /* enregistrement illisible : ignoré */
    }
  }
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Les événements sont reconstruits depuis le nom du fichier :
 * `events/2026-08-27T10-12-33-000Z__whatsapp_click-<suffixe>.txt`
 */
export async function listEvents(): Promise<TrackedEvent[]> {
  const entries = await listAll(EVENT_PREFIX);

  const events: TrackedEvent[] = [];
  for (const { pathname } of entries) {
    const name = pathname.slice(EVENT_PREFIX.length);
    const [rawStamp, rest] = name.split("__");
    if (!rawStamp || !rest) continue;

    const kind = (["whatsapp_open", "whatsapp_click", "phone_click"] as const).find(
      (k) => rest.startsWith(k),
    );
    if (!kind) continue;

    // 2026-08-27T10-12-33-000Z → 2026-08-27T10:12:33.000Z
    const iso = rawStamp.replace(
      /T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/,
      "T$1:$2:$3.$4Z",
    );
    events.push({ kind, createdAt: iso });
  }
  return events.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ───────────────────────── Statistiques ───────────────────────── */

export type Stats = {
  leads: { total: number; recent: number; last?: string };
  events: Record<EventKind, { total: number; recent: number; last?: string }>;
};

const RECENT_DAYS = 30;

/** Agrège les compteurs du dashboard. Hors composant : `Date.now()` n'est
 *  jamais appelé pendant le rendu. */
export function summarize(leads: Lead[], events: TrackedEvent[]): Stats {
  const floor = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
  const isRecent = (iso: string) => new Date(iso).getTime() >= floor;

  const byKind = (kind: EventKind) => {
    const matching = events.filter((e) => e.kind === kind);
    return {
      total: matching.length,
      recent: matching.filter((e) => isRecent(e.createdAt)).length,
      last: matching[0]?.createdAt,
    };
  };

  return {
    leads: {
      total: leads.length,
      recent: leads.filter((l) => isRecent(l.createdAt)).length,
      last: leads[0]?.createdAt,
    },
    events: {
      whatsapp_open: byKind("whatsapp_open"),
      whatsapp_click: byKind("whatsapp_click"),
      phone_click: byKind("phone_click"),
    },
  };
}
