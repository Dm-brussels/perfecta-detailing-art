import type { Metadata } from "next";
import Script from "next/script";
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
  metadataBase: new URL("https://perfectadetailing.be"),
  title: {
    default: "Perfecta Detailing Art · Centre esthétique automobile",
    template: "%s · Perfecta Detailing Art",
  },
  description:
    "Centre esthétique automobile spécialisé en pose de PPF, traitement céramique et detailing premium. Berlines, SUV et voitures d'exception, à Braine-l'Alleud.",
  applicationName: "Perfecta Detailing Art",
  keywords: [
    "PPF",
    "Paint Protection Film",
    "detailing",
    "céramique",
    "esthétique automobile",
    "Braine-l'Alleud",
    "Brabant wallon",
    "BMW",
    "Audi",
    "Porsche",
    "SUV",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Perfecta Detailing Art · Centre esthétique automobile",
    description:
      "Pose de PPF, céramique et detailing premium. Du véhicule du quotidien à la voiture d'exception.",
    siteName: "Perfecta Detailing Art",
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfecta Detailing Art",
    description:
      "Pose de PPF, céramique et detailing premium, à Braine-l'Alleud.",
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${manrope.variable}`}>
      <body className="bg-white text-noir antialiased">
        {/* Google Tag Manager — chargé uniquement si l'ID est configuré */}
        {GTM_ID && (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}

        {/* GA4 direct — alternative à GTM si l'on ne passe pas par le conteneur */}
        {!GTM_ID && GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}

        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
