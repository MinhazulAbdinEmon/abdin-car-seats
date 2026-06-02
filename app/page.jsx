import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import ScrollVideoHero from "@/components/ScrollVideoHero";
import Craftsmanship from "@/components/Craftsmanship";
import BeforeAfter from "@/components/BeforeAfter";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AmbientLights from "@/components/AmbientLights";
import PathsBackground from "@/components/PathsBackground";

export default function Home() {
  return (
    <>
      <Intro />
      <Nav />
      <main className="relative">
        <AmbientLights />
        {/* global animated "floating paths" backdrop behind every section */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <PathsBackground />
        </div>
        <ScrollVideoHero />
        <Craftsmanship />
        <BeforeAfter />
        <Services />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
