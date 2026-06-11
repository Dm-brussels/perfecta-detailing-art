import type { Metadata } from "next";
import { Montserrat, Manrope } from "next/font/google";
import { AppProviders } from "@/components/AppProviders";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://perfectadetailingart.com"),
  title: {
    default: "Perfecta Detailing Art · Centre esthétique automobile",
    template: "%s · Perfecta Detailing Art",
  },
  description:
    "Centre esthétique automobile spécialisé en pose de PPF, traitement céramique et detailing premium. Un travail méticuleux pour véhicules d'exception.",
  applicationName: "Perfecta Detailing Art",
  keywords: [
    "PPF",
    "Paint Protection Film",
    "detailing",
    "céramique",
    "esthétique automobile",
    "supercar",
    "Porsche",
    "Aston Martin",
    "Mercedes AMG",
    "McLaren",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Perfecta Detailing Art · Centre esthétique automobile",
    description:
      "Pose de PPF, céramique et detailing premium. Un soin obsessionnel du détail, pour véhicules d'exception.",
    siteName: "Perfecta Detailing Art",
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfecta Detailing Art",
    description:
      "Pose de PPF, céramique et detailing premium pour véhicules d'exception.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${manrope.variable}`}>
      <body className="bg-white text-noir antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
