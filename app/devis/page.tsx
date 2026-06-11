import type { Metadata } from "next";
import { QuoteFlow } from "@/components/QuoteFlow";

export const metadata: Metadata = {
  title: "Demander un devis",
  description:
    "Demandez votre devis personnalisé en quelques étapes. Réponse sous 24h ouvrées.",
};

type SearchParams = Promise<{ service?: string }>;

export default async function DevisPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { service } = await searchParams;
  return <QuoteFlow presetServiceId={service} />;
}
