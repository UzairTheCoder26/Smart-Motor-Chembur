import { useInView, useCountUp } from "@/hooks/use-in-view";
import { useSettings } from "@/hooks/use-site-content";
import aboutImg from "@/assets/about.jpg";
import { ArrowRight } from "lucide-react";

const stats = [
  { val: 500, suffix: "+", label: "Students Trained" },
  { val: 10, suffix: "+", label: "Years Experience" },
  { val: 98, suffix: "%", label: "RTO Pass Rate" },
  { val: 49, suffix: "★", label: "Google Rating", divisor: 10 },
];

const Stat = ({ s, inView }: { s: typeof stats[number]; inView: boolean }) => {
  const v = useCountUp(s.val, inView);
  const display = s.divisor ? (v / s.divisor).toFixed(1) : v;
  return (
    <div className="text-center">
      <div className="font-display text-4xl md:text-5xl text-gold-gradient mb-1">
        {display}{s.suffix}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground tracking-wider uppercase">{s.label}</div>
    </div>
  );
};

export const About = () => {
  const { ref, inView } = useInView<HTMLDivElement>();
  const settings = useSettings();
  const a = settings.about || {};
  const imgUrl = a.image_url || aboutImg;

  return (
    <section id="about" ref={ref} className="py-24 md:py-32 relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative animate-fade-up">
            <div className="relative rounded-2xl overflow-hidden gold-border-glow">
              <img src={imgUrl} alt="Smart Motor instructor" className="w-full h-[500px] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-4 md:right-8 px-6 py-4 rounded-2xl bg-gradient-gold text-primary-foreground shadow-gold animate-float">
              <div className="font-orbitron text-xs tracking-[0.2em]">EST. SINCE</div>
              <div className="font-display text-3xl">{a.since || "2015"}</div>
            </div>
          </div>

          <div className="animate-fade-up delay-200">
            <div className="inline-block px-3 py-1 rounded-full glass mb-4">
              <span className="text-xs font-orbitron tracking-[0.2em] text-primary">{a.badge || "ABOUT US"}</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              {a.title_part1 || "Your Journey to"}{" "}
              <span className="text-gold-gradient">{a.title_highlight || "Confident Driving"}</span>{" "}
              {a.title_part2 || "Starts Here"}
            </h2>
            <p className="text-foreground/70 text-lg leading-relaxed mb-8 whitespace-pre-line">
              {a.description || "At Smart Motor Driving School, we don't just teach driving — we build confidence."}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border">
              {stats.map((s) => <Stat key={s.label} s={s} inView={inView} />)}
            </div>

            <a href="#courses" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium">
              Explore Our Courses <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
