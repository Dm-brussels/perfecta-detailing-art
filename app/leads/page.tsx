import type { Metadata } from "next";
import { LogOut, MessageCircle, Phone, Inbox, MousePointerClick } from "lucide-react";
import { isAuthenticated } from "./auth";
import { logout } from "./actions";
import { LoginForm } from "./LoginForm";
import { listEvents, listLeads, summarize, type Lead } from "@/lib/store";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false, nocache: true },
};

/** Aucune mise en cache : la page reflète toujours l'état réel du stockage. */
export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("fr-BE", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Brussels",
});

function fmt(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFmt.format(d);
}

export default async function LeadsPage() {
  if (!(await isAuthenticated())) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-noir-glow px-6 py-16 grain">
        <LoginForm />
      </main>
    );
  }

  const [leads, events] = await Promise.all([listLeads(), listEvents()]);
  const stats = summarize(leads, events);

  const cards = [
    {
      icon: Inbox,
      label: "Demandes de devis",
      ...stats.leads,
      empty: "Aucune demande",
    },
    {
      icon: MessageCircle,
      label: "Clics WhatsApp",
      ...stats.events.whatsapp_click,
      empty: "Aucun clic",
    },
    {
      icon: MousePointerClick,
      label: "Ouvertures du flow",
      ...stats.events.whatsapp_open,
      empty: "Aucune ouverture",
    },
    {
      icon: Phone,
      label: "Clics téléphone",
      ...stats.events.phone_click,
      empty: "Aucun clic",
    },
  ];

  return (
    <main className="min-h-svh bg-noir-glow px-5 py-10 text-white grain sm:px-8 sm:py-14">
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow text-white/50">Espace privé · PDA</span>
            <span aria-hidden className="my-4 block h-px w-12 bg-azur" />
            <h1 className="font-display text-3xl font-light sm:text-4xl">
              Leads &amp; interactions
            </h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-2.5 border border-white/20 px-5 py-3 text-[0.68rem] uppercase tracking-[0.2em] text-white/75 transition-colors hover:border-white hover:text-white cursor-pointer focus-azur"
            >
              <LogOut strokeWidth={1.4} className="h-4 w-4" />
              Se déconnecter
            </button>
          </form>
        </div>

        {/* Statistiques */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="card-dark p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[0.62rem] uppercase tracking-[0.22em] text-white/50">
                  {c.label}
                </span>
                <c.icon strokeWidth={1.3} className="h-4 w-4 text-azur-light" />
              </div>
              <p className="mt-4 font-display text-4xl font-light">{c.total}</p>
              <p className="mt-2 text-xs text-white/45">
                {c.recent} sur 30 jours
              </p>
              <p className="mt-1 text-xs text-white/35">
                {c.last ? `Dernier : ${fmt(c.last)}` : c.empty}
              </p>
            </div>
          ))}
        </div>

        {/* Tableau des demandes */}
        <div className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl font-light">
              Demandes de devis
            </h2>
            <span className="text-xs text-white/40">
              {leads.length} enregistrée{leads.length > 1 ? "s" : ""}
            </span>
          </div>

          {leads.length === 0 ? (
            <p className="mt-6 card-dark p-8 text-sm text-white/50">
              Aucune demande enregistrée pour le moment. Les nouveaux devis
              soumis depuis le site apparaîtront ici.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto card-dark">
              <table className="w-full min-w-[64rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/12 text-[0.6rem] uppercase tracking-[0.18em] text-white/45">
                    <Th>Date</Th>
                    <Th>Prestation</Th>
                    <Th>Véhicule</Th>
                    <Th>Délai</Th>
                    <Th>Nom</Th>
                    <Th>Téléphone</Th>
                    <Th>Email</Th>
                    <Th>Précisions</Th>
                    <Th>Langue</Th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead: Lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-white/8 align-top transition-colors last:border-b-0 hover:bg-white/[0.04]"
                    >
                      <Td className="whitespace-nowrap text-white/60">
                        {fmt(lead.createdAt)}
                      </Td>
                      <Td className="whitespace-nowrap text-white">
                        {lead.serviceLabel}
                      </Td>
                      <Td>{lead.vehicle}</Td>
                      <Td className="text-white/70">{lead.timingLabel}</Td>
                      <Td className="whitespace-nowrap text-white">{lead.name}</Td>
                      <Td className="whitespace-nowrap">
                        <a
                          href={`tel:${lead.phone.replace(/[\s.\-()]/g, "")}`}
                          className="text-azur-light hover:underline"
                        >
                          {lead.phone}
                        </a>
                      </Td>
                      <Td className="whitespace-nowrap">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-azur-light hover:underline"
                        >
                          {lead.email}
                        </a>
                      </Td>
                      <Td className="max-w-sm whitespace-pre-wrap text-white/60">
                        {lead.message || "—"}
                      </Td>
                      <Td className="uppercase text-white/45">{lead.lang}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-4 font-medium">{children}</th>;
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-4 text-white/80 ${className}`}>{children}</td>;
}
