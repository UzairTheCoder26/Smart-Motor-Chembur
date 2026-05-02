import { ADDRESS, PHONE, PHONE_DISPLAY } from "@/lib/site-data";
import { MapPin, Phone, Clock, Star, ExternalLink, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTestimonials } from "@/hooks/use-site-content";

export const GoogleBusiness = () => {
  const [copied, setCopied] = useState(false);
  const REVIEWS = useTestimonials();
  const copyAddr = () => {
    navigator.clipboard.writeText(ADDRESS);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 rounded-full glass mb-4">
            <span className="text-xs font-orbitron tracking-[0.2em] text-primary">FIND US</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            FIND US ON <span className="text-gold-gradient">GOOGLE</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Map */}
          <div className="relative rounded-2xl overflow-hidden gold-border-glow h-[460px]">
            <iframe
              title="Smart Motor Driving School Location"
              src="https://www.google.com/maps?q=Tilak+Nagar+Chembur+Mumbai&output=embed"
              className="w-full h-full grayscale-[30%] contrast-110"
              loading="lazy"
            />
          </div>

          {/* Business panel */}
          <div className="glass-strong rounded-2xl p-8 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-2xl text-foreground">Smart Motor Driving School</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                  <span className="text-primary font-semibold">4.9</span>
                  <span className="text-muted-foreground text-sm">(120+ reviews)</span>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-success/20 text-success text-xs font-semibold">Open Now</div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 text-sm text-foreground/80">{ADDRESS}</div>
                <button onClick={copyAddr} className="text-primary p-1 hover:bg-primary/10 rounded" aria-label="Copy address">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <a href={`tel:${PHONE}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-foreground/90">{PHONE_DISPLAY}</span>
              </a>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-foreground/80">
                  <div>Mon–Fri: 9:00 AM – 10:00 PM</div>
                  <div>Sun: 11:00 AM – 7:00 PM</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Smart+Motor+Driving+School+Tilak+Nagar+Chembur"
                target="_blank" rel="noreferrer"
                className="flex-1 px-4 py-3 rounded-full bg-gradient-gold text-primary-foreground font-semibold text-sm text-center inline-flex items-center justify-center gap-2 shadow-gold hover:scale-105 transition-transform"
              >
                View on Maps <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://search.google.com/local/writereview?placeid=ChIJsmartmotor"
                target="_blank" rel="noreferrer"
                className="flex-1 px-4 py-3 rounded-full border border-primary/40 text-primary font-semibold text-sm text-center hover:bg-primary/10 transition-colors"
              >
                Write a Review
              </a>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div key={r.id || i} className="glass rounded-2xl p-6 hover-lift">
              <div className="flex gap-1 mb-3">
                {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
              </div>
              <p className="text-foreground/85 text-sm leading-relaxed mb-4">"{r.text}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div className="font-medium text-sm text-foreground">{r.name}</div>
                </div>
                <span className="text-xs text-muted-foreground">{r.date_label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
