import { useSettings } from "@/hooks/use-site-content";

export const Logo = ({ size = 40 }: { size?: number }) => {
  const settings = useSettings();
  const url = settings.logo?.url;

  if (url) {
    return (
      <div className="rounded-full overflow-hidden bg-gradient-gold flex items-center justify-center shadow-gold" style={{ width: size, height: size }}>
        <img src={url} alt="Smart Motor Driving School" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="rounded-full bg-gradient-gold flex items-center justify-center shadow-gold" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" className="text-primary-foreground" style={{ width: size * 0.6, height: size * 0.6 }} fill="currentColor">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 016.93 6H15.5a3.5 3.5 0 00-7 0H5.07A7 7 0 0112 5zm0 5a2 2 0 110 4 2 2 0 010-4zm-6.93 5H8.5a3.5 3.5 0 007 0h3.43A7 7 0 015.07 15z"/>
      </svg>
    </div>
  );
};
