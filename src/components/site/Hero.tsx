import { useEffect, useState } from "react";
import { Phone, MessageCircle, ChevronDown, Shield, Trophy, Star, Car } from "lucide-react";
import { PHONE, WHATSAPP_URL } from "@/lib/site-data";
import { useGalleryImages, useSettings } from "@/hooks/use-site-content";
import { liveStudentCount, mergeAboutStats } from "@/lib/about-stats";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const FALLBACK = [hero1, hero2];

export const Hero = () => {
  const siteSettings = useSettings();
  const aboutStats = mergeAboutStats(siteSettings.about_stats);
  const studentN = liveStudentCount(aboutStats);
  const ratingLabel = `${(aboutStats.google_rating_tenths / 10).toFixed(1)} Rated`;

  const images = useGalleryImages();
  const heroImgs = images.filter((i) => i.is_hero).map((i) => i.url);
  const slides = heroImgs.length > 0 ? heroImgs : FALLBACK;

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(0);
    if (slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <div
            key={src + i}
            className="absolute inset-0 transition-opacity duration-[1500ms]"
            style={{ opacity: idx === i ? 1 : 0 }}
          >
            <img src={src} alt="Smart Motor Driving School" className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          </div>
        ))}
        {/* Dark gradient: strong on the left, fading to transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 via-40% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
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
            <a href={`tel:${PHONE}`} className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:shadow-glow transition-all duration-300 hover:scale-105">
              <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Call Now
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300">
              <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" /> WhatsApp Us
            </a>
          </div>

          <div className="flex flex-wrap gap-3 animate-fade-up delay-500">
            {[
              { icon: Shield, label: "RTO Certified" },
              { icon: Trophy, label: `${studentN.toLocaleString()}+ Students` },
              { icon: Star, label: ratingLabel },
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
