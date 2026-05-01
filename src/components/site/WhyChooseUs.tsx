import { GraduationCap, Route, Car, FileCheck, ParkingCircle, Clock } from "lucide-react";

const features = [
  { icon: GraduationCap, title: "Certified Instructors", desc: "RTO-certified, experienced trainers who've taught hundreds of confident drivers." },
  { icon: Route, title: "Real-Road Practice", desc: "Train on actual Mumbai roads — not just empty parking lots." },
  { icon: Car, title: "Manual + Automatic", desc: "Modern vehicles for both transmission types, well maintained & insured." },
  { icon: FileCheck, title: "Full RTO Support", desc: "Documentation, slot booking, mock tests — we handle the paperwork." },
  { icon: ParkingCircle, title: "Parking & Hill Start", desc: "Dedicated drills for parallel parking, reverse, and hill start mastery." },
  { icon: Clock, title: "Flexible Batches", desc: "Morning, evening, weekend slots that fit around your schedule." },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 md:py-32 relative bg-card/30">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(hsl(44 56% 54% / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(44 56% 54% / 0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full glass mb-4">
            <span className="text-xs font-orbitron tracking-[0.2em] text-primary">THE EDGE</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            WHY LEARNERS <span className="text-gold-gradient">CHOOSE US</span>
          </h2>
          <p className="text-muted-foreground">Six reasons we're Chembur's most trusted driving school.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group glass rounded-2xl p-8 hover-lift relative overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/15 transition-colors" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-gold/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
