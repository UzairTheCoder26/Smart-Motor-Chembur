import { useServices, useSettings } from "@/hooks/use-site-content";
import { GraduationCap, Route, Car, FileCheck, ParkingCircle, Clock, Shield, FileText, ArrowRightLeft, UserCog, RefreshCw, Briefcase } from "lucide-react";

const ICONS: Record<string, any> = { GraduationCap, Route, Car, FileCheck, ParkingCircle, Clock, Shield, FileText, ArrowRightLeft, UserCog, RefreshCw, Briefcase };

export const WhyChooseUs = () => {
  const features = useServices("why");
  const settings = useSettings();
  const t = settings.section_titles || {};

  return (
    <section className="py-24 md:py-32 relative bg-card/30">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(hsl(44 56% 54% / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(44 56% 54% / 0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full glass mb-4">
            <span className="text-xs font-orbitron tracking-[0.2em] text-primary">{t.why_eyebrow || "THE EDGE"}</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            {t.why_title || "WHY LEARNERS"} <span className="text-gold-gradient">{t.why_highlight || "CHOOSE US"}</span>
          </h2>
          <p className="text-muted-foreground">{t.why_sub || "Six reasons we're Chembur's most trusted driving school."}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon || "GraduationCap"] || GraduationCap;
            return (
              <div key={f.id} className="group glass rounded-2xl p-8 hover-lift relative overflow-hidden" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/15 transition-colors" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-gold/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl mb-2 text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
