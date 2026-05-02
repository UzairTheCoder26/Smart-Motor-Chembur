import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Service = {
  id: string;
  section: string;
  title: string;
  description: string | null;
  icon: string | null;
  badge: string | null;
  tags: string[];
  order_index: number;
  is_active: boolean;
};
export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date_label: string | null;
  order_index: number;
  is_active: boolean;
};
export type GImage = {
  id: string;
  url: string;
  caption: string | null;
  categories: string[];
  is_hero: boolean;
  is_featured: boolean;
  order_index: number;
};
export type Settings = Record<string, any>;

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({});
  useEffect(() => {
    supabase.from("site_settings").select("key,value").then(({ data }) => {
      const m: Settings = {};
      (data || []).forEach((r: any) => { m[r.key] = r.value; });
      setSettings(m);
    });
    const channel = supabase.channel("settings-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => {
        supabase.from("site_settings").select("key,value").then(({ data }) => {
          const m: Settings = {};
          (data || []).forEach((r: any) => { m[r.key] = r.value; });
          setSettings(m);
        });
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
  return settings;
};

export const useServices = (section: string) => {
  const [items, setItems] = useState<Service[]>([]);
  useEffect(() => {
    const fetch = () => supabase.from("services").select("*").eq("section", section).eq("is_active", true).order("order_index").then(({ data }) => {
      setItems((data as Service[]) || []);
    });
    fetch();
    const channel = supabase.channel(`services-${section}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "services" }, fetch).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [section]);
  return items;
};

export const useTestimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  useEffect(() => {
    const fetch = () => supabase.from("testimonials").select("*").eq("is_active", true).order("order_index").then(({ data }) => setItems((data as Testimonial[]) || []));
    fetch();
    const ch = supabase.channel("testimonials-rt").on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, fetch).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);
  return items;
};

export const useGalleryImages = () => {
  const [items, setItems] = useState<GImage[]>([]);
  useEffect(() => {
    const fetch = () => supabase.from("gallery_images").select("*").order("is_featured", { ascending: false }).order("order_index").then(({ data }) => setItems((data as any) || []));
    fetch();
    const ch = supabase.channel("gallery-rt").on("postgres_changes", { event: "*", schema: "public", table: "gallery_images" }, fetch).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);
  return items;
};
