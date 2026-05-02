import { useMemo, useState } from "react";
import { useGalleryImages } from "@/hooks/use-site-content";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export const Gallery = () => {
  const images = useGalleryImages();
  const [filter, setFilter] = useState("all");
  const [shown, setShown] = useState(6);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // derive categories dynamically
  const cats = useMemo(() => {
    const set = new Set<string>(["all"]);
    images.forEach((img) => (img.categories || []).forEach((c) => c && set.add(c)));
    return Array.from(set);
  }, [images]);

  const filtered = filter === "all" ? images : images.filter((i) => (i.categories || []).includes(filter));
  const visible = filtered.slice(0, shown);

  if (images.length === 0) {
    return (
      <section id="gallery" className="py-24">
        <div className="container text-center text-muted-foreground">
          <h2 className="font-display text-4xl mb-4">Gallery coming soon</h2>
          <p>Photos will appear here as soon as the team uploads them.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-24 md:py-32">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 rounded-full glass mb-4">
            <span className="text-xs font-orbitron tracking-[0.2em] text-primary">GALLERY</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            OUR SCHOOL <span className="text-gold-gradient">IN ACTION</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full" />
        </div>

        {cats.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => { setFilter(c); setShown(6); }}
                className={`px-5 py-2 rounded-full text-xs font-orbitron tracking-widest uppercase transition-all ${
                  filter === c ? "bg-gradient-gold text-primary-foreground shadow-gold" : "glass text-foreground/70 hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {visible.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLightbox(i)}
              className="block w-full break-inside-avoid relative group rounded-xl overflow-hidden gold-border-glow animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img src={img.url} alt={img.caption || "Gallery"} loading="lazy" className="w-full h-auto transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                <div className="text-left">
                  <div className="text-xs font-orbitron tracking-widest text-primary mb-1">{(img.categories || []).join(" · ").toUpperCase()}</div>
                  <div className="font-display text-lg text-foreground">{img.caption}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length > shown && (
          <div className="text-center mt-12">
            <button onClick={() => setShown((s) => s + 6)} className="px-8 py-3 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-105 transition-transform">
              Load More
            </button>
          </div>
        )}
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-foreground p-2" onClick={() => setLightbox(null)} aria-label="Close"><X className="w-8 h-8" /></button>
          <button className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground p-3 glass rounded-full" onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l! - 1 + filtered.length) % filtered.length); }} aria-label="Previous"><ChevronLeft className="w-6 h-6" /></button>
          <img src={filtered[lightbox].url} alt={filtered[lightbox].caption || ""} className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg gold-border-glow" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground p-3 glass rounded-full" onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l! + 1) % filtered.length); }} aria-label="Next"><ChevronRight className="w-6 h-6" /></button>
          {filtered[lightbox].caption && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full glass-strong text-foreground text-sm">{filtered[lightbox].caption}</div>
          )}
        </div>
      )}
    </section>
  );
};
