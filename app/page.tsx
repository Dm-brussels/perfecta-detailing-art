import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBand } from "@/components/TrustBand";
import { Ambassador } from "@/components/Ambassador";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Showcase } from "@/components/Showcase";
import { Gallery } from "@/components/Gallery";
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
        <TrustBand />
        <Services />
        <Stats />
        <Process />
        <Showcase />
        <Gallery />
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
