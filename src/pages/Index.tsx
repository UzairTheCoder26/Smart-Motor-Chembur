import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { Courses } from "@/components/site/Courses";
import { RtoServices } from "@/components/site/RtoServices";
import { Gallery } from "@/components/site/Gallery";
import { GoogleBusiness } from "@/components/site/GoogleBusiness";
import { Contact } from "@/components/site/Contact";
import { Areas } from "@/components/site/Areas";
import { FAQ } from "@/components/site/FAQ";
import { Footer } from "@/components/site/Footer";
import { FloatingButtons } from "@/components/site/FloatingButtons";

const Index = () => {
  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <WhyChooseUs />
        <Courses />
        <RtoServices />
        <GoogleBusiness />
        <Contact />
        <Areas />
        <FAQ />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
