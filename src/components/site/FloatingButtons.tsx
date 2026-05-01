import { useEffect, useState } from "react";
import { MessageCircle, Phone, ArrowUp } from "lucide-react";
import { PHONE, WHATSAPP_URL } from "@/lib/site-data";

export const FloatingButtons = () => {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp - desktop & mobile */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl animate-pulse-gold hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full bg-gradient-gold text-primary-foreground flex items-center justify-center shadow-gold hover:scale-110 transition-transform animate-fade-in"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Mobile bottom sticky bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-primary/30 grid grid-cols-3 p-2 gap-2">
        <a href={`tel:${PHONE}`} className="flex flex-col items-center gap-0.5 py-2 text-foreground hover:text-primary">
          <Phone className="w-5 h-5" /><span className="text-xs">Call</span>
        </a>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-0.5 py-2 text-[#25D366]">
          <MessageCircle className="w-5 h-5" /><span className="text-xs">WhatsApp</span>
        </a>
        <a href="#contact" className="flex flex-col items-center gap-0.5 py-2 rounded-lg bg-gradient-gold text-primary-foreground font-semibold">
          <span className="text-xs">📝 Enquire</span>
        </a>
      </div>
    </>
  );
};
