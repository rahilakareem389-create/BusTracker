import AboutSection from "../components/home/AboutSection";
import CTA from "../components/home/CTA";
import Features from "../components/home/Features";
import Hero from "../components/home/Hero";
import Stats from "../components/home/stats";
import Testimonials from "../components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
    <Features />
      <AboutSection />
   <Stats />
      <Testimonials />
            <CTA/>
          
    </>
  );
}
