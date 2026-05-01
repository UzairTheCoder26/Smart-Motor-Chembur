import { COURSES } from "@/lib/site-data";

export const Courses = () => {
  return (
    <section id="courses" className="py-24 md:py-32">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full glass mb-4">
            <span className="text-xs font-orbitron tracking-[0.2em] text-primary">CURRICULUM</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            OUR <span className="text-gold-gradient">DRIVING COURSES</span>
          </h2>
          <p className="text-muted-foreground">Structured programs for every learner — from total beginners to refresher drivers.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((c) => (
            <div key={c.name} className="group relative glass rounded-2xl p-8 hover-lift overflow-hidden">
              {c.private && <div className="ribbon">PRIVATE</div>}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="font-display text-2xl mb-3 text-foreground">{c.name}</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{c.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {c.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2.5 py-1 rounded-full border border-primary/30 text-primary/90 bg-primary/5 font-medium uppercase tracking-wider">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Enquire Now →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
