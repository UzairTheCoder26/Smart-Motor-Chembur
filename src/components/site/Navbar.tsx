import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { NAV_LINKS, PHONE, PHONE_DISPLAY } from "@/lib/site-data";
import { Logo } from "@/components/site/Logo";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3 group">
          <Logo size={40} />
          <div className="leading-tight">
            <div className="font-display text-lg text-foreground">SMART MOTOR</div>
            <div className="text-[10px] tracking-[0.3em] text-primary font-orbitron">DRIVING SCHOOL</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setActive(l.href)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                active === l.href ? "text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              {l.label}
              <span
                className={`absolute bottom-1 left-4 right-4 h-px bg-gradient-gold transition-transform duration-300 ${
                  active === l.href ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href={`tel:${PHONE}`} className="flex items-center gap-2 text-sm text-foreground/90 hover:text-primary transition-colors">
            <Phone className="w-4 h-4 text-primary" />
            <span className="font-medium">{PHONE_DISPLAY}</span>
          </a>
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-full bg-gradient-gold text-primary-foreground font-semibold text-sm shadow-gold hover:shadow-glow transition-all duration-300 hover:scale-105 animate-pulse-gold"
          >
            Enroll Now
          </a>
        </div>

        <button onClick={() => setOpen(true)} className="lg:hidden text-foreground p-2" aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-xl animate-fade-in lg:hidden">
          <div className="flex justify-end p-6">
            <button onClick={() => setOpen(false)} className="text-foreground p-2" aria-label="Close menu">
              <X className="w-7 h-7" />
            </button>
          </div>
          <nav className="flex flex-col items-center gap-6 mt-12">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => { setActive(l.href); setOpen(false); }}
                className="font-display text-3xl text-foreground hover:text-primary transition-colors animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${PHONE}`}
              className="mt-6 px-8 py-3 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold"
            >
              Call {PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
