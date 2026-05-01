import { RTO_SERVICES, WHATSAPP_URL } from "@/lib/site-data";
import { FileText, Shield, ArrowRightLeft, UserCog, RefreshCw, Briefcase, MessageCircle, ArrowRight } from "lucide-react";

const icons = [FileText, Shield, ArrowRightLeft, UserCog, RefreshCw, Briefcase];

export const RtoServices = () => {
  return (
    <section id="rto" className="py-24 md:py-32 bg-[hsl(0_0%_7%)]">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full glass mb-4">
            <span className="text-xs font-orbitron tracking-[0.2em] text-primary">RTO SERVICES</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            RTO & VEHICLE <span className="text-gold-gradient">SERVICES</span>
          </h2>
          <p className="text-muted-foreground">We handle all RTO-related work to make your life easier.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {RTO_SERVICES.map((s, i) => {
            const Icon = icons[i];
            return (
              <div key={s.title} className="group p-6 rounded-xl bg-card/40 border border-border hover:border-primary/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{s.desc}</p>
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Get Help <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-strong rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 gold-border-glow">
          <div>
            <h3 className="font-display text-2xl md:text-3xl mb-1">Need RTO help? <span className="text-gold-gradient">We get it done fast.</span></h3>
            <p className="text-muted-foreground text-sm">Call or WhatsApp us — typical turnaround in 2-3 business days.</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold shadow-lg hover:scale-105 transition-transform">
            <MessageCircle className="w-5 h-5" /> WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
};
