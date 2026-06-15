import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
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
import { MobileStickyCta } from "@/components/MobileStickyCta";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Ambassador />
        <Stats />
        <Services />
        <Process />
        <Showcase />
        <Gallery />
        <WhyUs />
        <Testimonials />
        <FAQ />
        <Visit />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
