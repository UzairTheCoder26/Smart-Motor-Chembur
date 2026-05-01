import { useEffect, useState } from "react";
import { Phone, MessageCircle, ChevronDown, Shield, Trophy, Star, Car } from "lucide-react";
import { PHONE, WHATSAPP_URL } from "@/lib/site-data";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const slides = [hero1, hero2, hero1];

export const Hero = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1500ms]"
            style={{ opacity: idx === i ? 1 : 0 }}
          >
            <img src={src} alt="Premium driving experience" className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      <div className="container relative z-10 pt-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-orbitron tracking-[0.2em] text-foreground/90">EST. CHEMBUR · MUMBAI</span>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] mb-6">
            <span className="block text-foreground animate-fade-up">DRIVE WITH</span>
            <span className="block text-gold-gradient animate-fade-up delay-200">CONFIDENCE.</span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 max-w-xl mb-10 animate-fade-up delay-300">
            Mumbai's most trusted driving school — premium training in <span className="text-primary font-medium">Chembur & Tilak Nagar</span>.
          </p>

          <div className="flex flex-wrap gap-4 mb-12 animate-fade-up delay-400">
            <a
              href={`tel:${PHONE}`}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Call Now
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              WhatsApp Us
            </a>
          </div>

          <div className="flex flex-wrap gap-3 animate-fade-up delay-500">
            {[
              { icon: Shield, label: "RTO Certified" },
              { icon: Trophy, label: "500+ Students" },
              { icon: Star, label: "4.9 Rated" },
              { icon: Car, label: "Real Traffic" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 px-4 py-2 rounded-full glass">
                <b.icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground/90">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary animate-bounce-slow z-10" aria-label="Scroll down">
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
};
