import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Img = { id: string; url: string; caption: string | null; category: string | null };

// Fallback unsplash images if DB empty
const FALLBACK: Img[] = [
  { id: "f1", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800", caption: "Premium Training Fleet", category: "cars" },
  { id: "f2", url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800", caption: "Real Mumbai Traffic", category: "classes" },
  { id: "f3", url: "https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=800", caption: "Modern Manual Cars", category: "cars" },
  { id: "f4", url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800", caption: "Confident Students", category: "students" },
  { id: "f5", url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800", caption: "Hands-On Instruction", category: "classes" },
  { id: "f6", url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800", caption: "Precision Driving", category: "cars" },
  { id: "f7", url: "https://images.unsplash.com/photo-1597007030739-6d2e7172ee6f?w=800", caption: "RTO Test Prep", category: "rto" },
  { id: "f8", url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800", caption: "Highway Confidence", category: "cars" },
  { id: "f9", url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800", caption: "Behind the Wheel", category: "students" },
];

const CATS = ["all", "classes", "students", "cars", "rto", "events"];

export const Gallery = () => {
  const [images, setImages] = useState<Img[]>([]);
  const [filter, setFilter] = useState("all");
  const [shown, setShown] = useState(6);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("gallery_images").select("id,url,caption,category").order("is_featured", { ascending: false }).order("order_index").then(({ data }) => {
      if (data && data.length > 0) setImages(data as Img[]);
      else setImages(FALLBACK);
    });
  }, []);

  const filtered = filter === "all" ? images : images.filter((i) => i.category === filter);
  const visible = filtered.slice(0, shown);

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

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => { setFilter(c); setShown(6); }}
              className={`px-5 py-2 rounded-full text-xs font-orbitron tracking-widest uppercase transition-all ${
                filter === c
                  ? "bg-gradient-gold text-primary-foreground shadow-gold"
                  : "glass text-foreground/70 hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

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
                  <div className="text-xs font-orbitron tracking-widest text-primary mb-1">{img.category?.toUpperCase()}</div>
                  <div className="font-display text-lg text-foreground">{img.caption}</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 mix-blend-overlay transition-colors duration-500" />
            </button>
          ))}
        </div>

        {filtered.length > shown && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShown((s) => s + 6)}
              className="px-8 py-3 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-105 transition-transform"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-foreground p-2" onClick={() => setLightbox(null)} aria-label="Close">
            <X className="w-8 h-8" />
          </button>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground p-3 glass rounded-full"
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l! - 1 + filtered.length) % filtered.length); }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img src={filtered[lightbox].url} alt={filtered[lightbox].caption || ""} className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg gold-border-glow" onClick={(e) => e.stopPropagation()} />
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground p-3 glass rounded-full"
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l! + 1) % filtered.length); }}
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          {filtered[lightbox].caption && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full glass-strong text-foreground text-sm">
              {filtered[lightbox].caption}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
