import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Authentification de l'espace privé /leads.
 *
 * Le mot de passe vit dans `LEADS_PASSWORD` (jamais dans le bundle client) et
 * la session est un cookie httpOnly signé : impossible à forger sans le secret,
 * et rien n'est vérifié côté navigateur.
 */

const COOKIE = "pda_leads";
const MAX_AGE = 60 * 60 * 12; // 12 heures

function password() {
  return process.env.LEADS_PASSWORD ?? "5831";
}

function secret() {
  return process.env.LEADS_SECRET ?? `pda::${password()}`;
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string) {
  return safeEqual(input.trim(), password());
}

export async function createSession() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  const store = await cookies();
  store.set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/leads",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete({ name: COOKIE, path: "/leads" });
}

export async function isAuthenticated() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;

  const [exp, sig] = raw.split(".");
  if (!exp || !sig) return false;
  if (!safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
}

/* ───────── Limitation des tentatives ─────────
   Le code est court : on ralentit le bruteforce par IP. La mémoire est propre à
   chaque instance serverless, ce qui suffit à casser une attaque automatisée. */

const attempts = new Map<string, { count: number; until: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX_ATTEMPTS = 6;

export function tooManyAttempts(ip: string) {
  const entry = attempts.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.until) {
    attempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function registerFailure(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.until) {
    attempts.set(ip, { count: 1, until: now + WINDOW });
    return;
  }
  entry.count += 1;
}

export function clearFailures(ip: string) {
  attempts.delete(ip);
}
