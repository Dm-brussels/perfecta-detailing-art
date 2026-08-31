import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { TrustBand } from "@/components/TrustBand";
import { Ambassador } from "@/components/Ambassador";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Visit } from "@/components/Visit";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { StickyBar } from "@/components/StickyBar";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Work />
        <TrustBand />
        <Services />
        <Stats />
        <Process />
        <WhyUs />
        <Testimonials />
        <FAQ />
        <Visit />
        <FinalCTA />
        <Ambassador />
      </main>
      <Footer />
      <StickyBar />
    </>
  );
}
