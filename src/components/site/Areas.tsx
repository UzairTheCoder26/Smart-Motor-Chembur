import { AREAS } from "@/lib/site-data";

export const Areas = () => (
  <section className="py-20 md:py-24">
    <div className="container text-center">
      <div className="inline-block px-3 py-1 rounded-full glass mb-4">
        <span className="text-xs font-orbitron tracking-[0.2em] text-primary">COVERAGE</span>
      </div>
      <h2 className="font-display text-4xl md:text-5xl mb-8">
        AREAS WE <span className="text-gold-gradient">SERVE</span>
      </h2>
      <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-6">
        {AREAS.map((a) => (
          <span key={a} className="px-5 py-2 rounded-full border border-primary/30 text-foreground/85 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 cursor-default text-sm font-medium">
            {a}
          </span>
        ))}
      </div>
      <p className="text-muted-foreground text-sm">Not listed? Call us — we'll arrange something.</p>
    </div>
  </section>
);
