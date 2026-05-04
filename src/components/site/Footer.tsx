import { ADDRESS, PHONE, PHONE_DISPLAY, WHATSAPP_URL, NAV_LINKS } from "@/lib/site-data";
import { Phone, MapPin, Clock, MessageCircle, Instagram, Facebook } from "lucide-react";
import { useServices } from "@/hooks/use-site-content";
import { Logo } from "@/components/site/Logo";

export const Footer = () => {
  const courses = useServices("courses");
  return (
  <footer className="bg-[#050505] border-t border-primary/20 pt-16 pb-8">
    <div className="container">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Logo size={40} />
            <div>
              <div className="font-display text-lg">SMART MOTOR</div>
              <div className="text-[10px] tracking-[0.3em] text-primary font-orbitron">DRIVING SCHOOL</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Safety-first training with local Chembur expertise.</p>
          <div className="flex gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="WhatsApp">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-orbitron text-xs tracking-[0.2em] text-primary mb-4">QUICK LINKS</h4>
          <ul className="space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}><a href={l.href} className="text-sm text-foreground/70 hover:text-primary transition-colors">{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-orbitron text-xs tracking-[0.2em] text-primary mb-4">COURSES</h4>
          <ul className="space-y-2">
            {courses.map((c) => (
              <li key={c.id}><a href="#courses" className="text-sm text-foreground/70 hover:text-primary transition-colors">{c.title}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-orbitron text-xs tracking-[0.2em] text-primary mb-4">CONTACT</h4>
          <div className="space-y-3 text-sm text-foreground/70">
            <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>{ADDRESS}</span></div>
            <a href={`tel:${PHONE}`} className="flex items-center gap-2 hover:text-primary"><Phone className="w-4 h-4 text-primary" />{PHONE_DISPLAY}</a>
            <div className="flex items-start gap-2"><Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>Mon–Fri 9AM–10PM<br/>Sun 11AM–7PM</span></div>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-[#25D366] text-white font-semibold text-xs">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
        <div>© 2026 Smart Motor Driving School. All Rights Reserved.</div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/login"
            className="px-2.5 py-1 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors text-[11px] font-semibold"
          >
            Admin Panel
          </a>
          <a
            href="https://instagram.com/northvave"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            Website by <span className="text-primary">NorthVave</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
  );
};
