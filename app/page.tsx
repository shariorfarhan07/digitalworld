import NavTray from "@/components/ui/NavTray";
import Hero from "@/components/scenes/Hero";
import Manifesto from "@/components/scenes/Manifesto";
import Transformation from "@/components/scenes/Transformation";
import Pillars from "@/components/scenes/Pillars";
import Methodology from "@/components/scenes/Methodology";
import Process from "@/components/scenes/Process";
import Founder from "@/components/scenes/Founder";
import Mission from "@/components/scenes/Mission";
import Authority from "@/components/scenes/Authority";
import Testimonials from "@/components/scenes/Testimonials";
import Offer from "@/components/scenes/Offer";
import Footer from "@/components/scenes/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <NavTray />
      <Hero />
      <Manifesto />
      <Transformation />
      <Pillars />
      <Methodology />
      <Process />
      <Founder />
      <Mission />
      <Authority />
      <Testimonials />
      <Offer />
      <Footer />
    </main>
  );
}
