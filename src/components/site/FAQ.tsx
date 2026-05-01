import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "@/lib/site-data";

export const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full glass mb-4">
            <span className="text-xs font-orbitron tracking-[0.2em] text-primary">FAQ</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl mb-3">
            FREQUENTLY ASKED <span className="text-gold-gradient">QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`glass rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? "gold-border-glow" : ""}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-primary/5 transition-colors"
                >
                  <span className="font-semibold text-foreground pr-4">{f.q}</span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
