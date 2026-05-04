import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Download, Trash2, Upload, Image as ImageIcon, Mail, Loader2, Plus, Save, Star, Settings as SettingsIcon, LayoutGrid, MessageSquare, Edit2, X } from "lucide-react";

type Enquiry = { id: string; name: string; phone: string; email: string | null; area: string | null; course: string; batch: string; message: string | null; status: string; created_at: string; };
type GImage = { id: string; url: string; caption: string | null; categories: string[]; is_hero: boolean; is_featured: boolean; order_index: number };
type Service = { id: string; section: string; title: string; description: string | null; icon: string | null; badge: string | null; tags: string[]; order_index: number; is_active: boolean };
type Testimonial = { id: string; name: string; rating: number; text: string; date_label: string | null; order_index: number; is_active: boolean };

const ALL_TAGS = ["all", "classes", "students", "cars", "rto", "events"];

const Admin = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"leads" | "gallery" | "services" | "testimonials" | "content">("leads");
  const [loading, setLoading] = useState(true);

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [images, setImages] = useState<GImage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => { document.documentElement.classList.add("admin-theme"); return () => document.documentElement.classList.remove("admin-theme"); }, []);

  const load = useCallback(async () => {
    const session = await supabase.auth.getSession();
    if (!session.data.session) { navigate("/admin/login"); return; }
    const user = session.data.session.user;
    const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", { _role: "admin", _user_id: user.id });
    if (roleErr) {
      toast.error(`Role check failed: ${roleErr.message}`);
      await supabase.auth.signOut();
      navigate("/admin/login");
      return;
    }
    if (!isAdmin) {
      toast.error("You do not have admin access.");
      await supabase.auth.signOut();
      navigate("/admin/login");
      return;
    }
    const [
      { data: en, error: enErr },
      { data: im, error: imErr },
      { data: sv, error: svErr },
      { data: ts, error: tsErr },
      { data: st, error: stErr },
    ] = await Promise.all([
      supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_images").select("*").order("order_index"),
      supabase.from("services").select("*").order("section").order("order_index"),
      supabase.from("testimonials").select("*").order("order_index"),
      supabase.from("site_settings").select("key,value"),
    ]);
    const firstError = enErr || imErr || svErr || tsErr || stErr;
    if (firstError) {
      toast.error(`Admin data load failed: ${firstError.message}`);
    }
    setEnquiries((en as Enquiry[]) || []);
    setImages((im as any) || []);
    setServices((sv as Service[]) || []);
    setTestimonials((ts as Testimonial[]) || []);
    const m: Record<string, any> = {};
    (st || []).forEach((r: any) => m[r.key] = r.value);
    setSettings(m);
    setLoading(false);
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const channel = supabase
      .channel(`admin-enquiries-${Date.now()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "enquiries" }, () => {
        load();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const logout = async () => { await supabase.auth.signOut(); navigate("/admin/login"); };

  // ===== Leads =====
  const exportCsv = () => {
    const header = ["Name", "Phone", "Email", "Area", "Course", "Batch", "Status", "Date", "Message"];
    const rows = enquiries.map((e) => [e.name, e.phone, e.email || "", e.area || "", e.course, e.batch, e.status, new Date(e.created_at).toLocaleString(), (e.message || "").replace(/\n/g, " ")]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `enquiries-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };
  const updateStatus = async (id: string, status: string) => {
    await supabase.from("enquiries").update({ status }).eq("id", id);
    setEnquiries((es) => es.map((e) => e.id === id ? { ...e, status } : e));
  };
  const delEnq = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    await supabase.from("enquiries").delete().eq("id", id);
    setEnquiries((es) => es.filter((e) => e.id !== id));
    toast.success("Deleted");
  };

  // ===== Gallery =====
  const [uploadCats, setUploadCats] = useState<string[]>(["classes"]);
  const [uploadHero, setUploadHero] = useState(false);

  const upload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    const newRows: GImage[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
      const { error } = await supabase.storage.from("gallery").upload(path, file);
      if (error) { toast.error("Upload failed: " + error.message); continue; }
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      const { data: ins, error: insErr } = await supabase.from("gallery_images").insert({
        url: pub.publicUrl,
        caption: file.name.split(".")[0],
        category: uploadCats[0] || "all",
        categories: uploadCats.length ? uploadCats : ["all"],
        is_hero: uploadHero,
      }).select().single();
      if (insErr) { toast.error("DB error: " + insErr.message); continue; }
      if (ins) newRows.push(ins as any);
    }
    setUploading(false);
    if (newRows.length) {
      setImages((prev) => [...prev, ...newRows]);
      toast.success(`Uploaded ${newRows.length} image(s)`);
    }
  };

  const updateImage = async (id: string, patch: Partial<GImage>) => {
    const { error } = await supabase.from("gallery_images").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setImages((is) => is.map((i) => i.id === id ? { ...i, ...patch } : i));
  };

  const delImg = async (id: string) => {
    if (!confirm("Delete image?")) return;
    await supabase.from("gallery_images").delete().eq("id", id);
    setImages((is) => is.filter((i) => i.id !== id));
  };

  const toggleCat = (id: string, cat: string) => {
    const img = images.find((i) => i.id === id);
    if (!img) return;
    const cats = img.categories.includes(cat) ? img.categories.filter((c) => c !== cat) : [...img.categories, cat];
    updateImage(id, { categories: cats.length ? cats : ["all"] });
  };

  // ===== Services =====
  const addService = async (section: string) => {
    const { data, error } = await supabase.from("services").insert({ section, title: "New Item", description: "", icon: section === "courses" ? "🚗" : "FileText", tags: [], order_index: services.length + 1 }).select().single();
    if (error) return toast.error(error.message);
    setServices((s) => [...s, data as any]);
  };
  const updateService = async (id: string, patch: Partial<Service>) => {
    const { error } = await supabase.from("services").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    setServices((s) => s.map((x) => x.id === id ? { ...x, ...patch } : x));
  };
  const delService = async (id: string) => {
    if (!confirm("Delete this card?")) return;
    await supabase.from("services").delete().eq("id", id);
    setServices((s) => s.filter((x) => x.id !== id));
  };

  // ===== Testimonials =====
  const addTestimonial = async () => {
    const { data, error } = await supabase.from("testimonials").insert({ name: "Customer", rating: 5, text: "Great experience!", date_label: "Just now", order_index: testimonials.length + 1 }).select().single();
    if (error) return toast.error(error.message);
    setTestimonials((t) => [...t, data as any]);
  };
  const updateTestimonial = async (id: string, patch: Partial<Testimonial>) => {
    const { error } = await supabase.from("testimonials").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    setTestimonials((t) => t.map((x) => x.id === id ? { ...x, ...patch } : x));
  };
  const delTestimonial = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    setTestimonials((t) => t.filter((x) => x.id !== id));
  };

  // ===== Content / Settings =====
  const saveSetting = async (key: string, value: any) => {
    const { error } = await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) { toast.error(error.message); return; }
    setSettings((s) => ({ ...s, [key]: value }));
    toast.success("Saved");
  };

  const uploadAsset = async (file: File, key: "logo" | "about_image"): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload error: " + error.message); return null; }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    return data.publicUrl;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const tabs = [
    { id: "leads", label: `Leads (${enquiries.length})`, icon: Mail },
    { id: "gallery", label: `Gallery (${images.length})`, icon: ImageIcon },
    { id: "services", label: `Cards & Services (${services.length})`, icon: LayoutGrid },
    { id: "testimonials", label: `Testimonials (${testimonials.length})`, icon: MessageSquare },
    { id: "content", label: "Site Content", icon: SettingsIcon },
  ] as const;

  return (
    <div className="min-h-screen bg-background admin-theme">
      <header className="border-b border-border bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold text-sm">SM</div>
            <div>
              <div className="font-bold">Admin Dashboard</div>
              <div className="text-xs text-muted-foreground">Smart Motor Driving School</div>
            </div>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <div className="container py-6">
        <div className="flex gap-1 mb-5 border-b border-border overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 font-medium border-b-2 whitespace-nowrap text-sm ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="w-4 h-4 inline mr-1.5" /> {t.label}
            </button>
          ))}
        </div>

        {/* ====== LEADS ====== */}
        {tab === "leads" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-border">
              <h2 className="font-semibold">Enquiry Leads</h2>
              <button onClick={exportCsv} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs uppercase tracking-wider">
                  <tr><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">Course</th><th className="p-3">Batch</th><th className="p-3">Area</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3"></th></tr>
                </thead>
                <tbody>
                  {enquiries.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No enquiries yet.</td></tr>}
                  {enquiries.map((e) => (
                    <tr key={e.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-3 font-medium">{e.name}</td>
                      <td className="p-3"><a href={`tel:${e.phone}`} className="text-primary">{e.phone}</a></td>
                      <td className="p-3">{e.course}</td>
                      <td className="p-3">{e.batch}</td>
                      <td className="p-3">{e.area || "—"}</td>
                      <td className="p-3 text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</td>
                      <td className="p-3">
                        <select value={e.status} onChange={(ev) => updateStatus(e.id, ev.target.value)} className="px-2 py-1 rounded border border-border bg-background text-xs">
                          <option value="new">New</option><option value="contacted">Contacted</option><option value="enrolled">Enrolled</option><option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-3"><button onClick={() => delEnq(e.id)} className="text-destructive p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====== GALLERY ====== */}
        {tab === "gallery" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-wrap items-end gap-4 mb-5 pb-5 border-b border-border">
              <div className="flex-1 min-w-[260px]">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Tags for new uploads</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ALL_TAGS.map((t) => (
                    <button key={t} type="button" onClick={() => setUploadCats((c) => c.includes(t) ? c.filter((x) => x !== t) : [...c, t])}
                      className={`px-3 py-1 text-xs rounded-full border ${uploadCats.includes(t) ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={uploadHero} onChange={(e) => setUploadHero(e.target.checked)} className="accent-primary" />
                Use as Hero background
              </label>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer whitespace-nowrap">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload Images
                <input type="file" multiple accept="image/*" onChange={(e) => upload(e.target.files)} className="hidden" />
              </label>
            </div>

            {images.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No images yet. Upload some to populate the gallery & hero.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="border border-border rounded-lg overflow-hidden bg-background">
                    <div className="relative">
                      <img src={img.url} alt={img.caption || ""} className="w-full h-44 object-cover" />
                      <button onClick={() => delImg(img.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-white flex items-center justify-center hover:scale-110 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {img.is_hero && <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded">HERO</div>}
                    </div>
                    <div className="p-3 space-y-2">
                      <input value={img.caption || ""} onChange={(e) => setImages((is) => is.map((i) => i.id === img.id ? { ...i, caption: e.target.value } : i))} onBlur={(e) => updateImage(img.id, { caption: e.target.value })} className="w-full text-sm px-2 py-1 border border-border rounded bg-background" placeholder="Caption" />
                      <div className="flex flex-wrap gap-1">
                        {ALL_TAGS.map((t) => (
                          <button key={t} onClick={() => toggleCat(img.id, t)} className={`px-2 py-0.5 text-[10px] rounded-full border ${img.categories?.includes(t) ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" checked={img.is_hero} onChange={(e) => updateImage(img.id, { is_hero: e.target.checked })} className="accent-primary" />
                        Show in Hero background
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== SERVICES (cards) ====== */}
        {tab === "services" && (
          <div className="space-y-6">
            {(["courses", "why", "rto"] as const).map((section) => {
              const items = services.filter((s) => s.section === section);
              const labels = { courses: "Driving Courses (cards)", why: "Why Choose Us (features)", rto: "RTO Services (cards)" };
              return (
                <div key={section} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">{labels[section]}</h3>
                    <button onClick={() => addService(section)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {items.map((s) => (
                      <div key={s.id} className="border border-border rounded-lg p-4 space-y-2 bg-background">
                        <div className="flex items-start gap-2">
                          <input value={s.icon || ""} onChange={(e) => setServices((arr) => arr.map((x) => x.id === s.id ? { ...x, icon: e.target.value } : x))} onBlur={(e) => updateService(s.id, { icon: e.target.value })} className="w-20 px-2 py-1 text-sm border border-border rounded bg-background" placeholder={section === "courses" ? "🚗" : "Icon name"} />
                          <input value={s.title} onChange={(e) => setServices((arr) => arr.map((x) => x.id === s.id ? { ...x, title: e.target.value } : x))} onBlur={(e) => updateService(s.id, { title: e.target.value })} className="flex-1 px-2 py-1 text-sm font-semibold border border-border rounded bg-background" placeholder="Title" />
                          <button onClick={() => delService(s.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <textarea value={s.description || ""} onChange={(e) => setServices((arr) => arr.map((x) => x.id === s.id ? { ...x, description: e.target.value } : x))} onBlur={(e) => updateService(s.id, { description: e.target.value })} className="w-full px-2 py-1 text-sm border border-border rounded bg-background" rows={2} placeholder="Description" />
                        {section === "courses" && (
                          <>
                            <input value={s.badge || ""} onChange={(e) => setServices((arr) => arr.map((x) => x.id === s.id ? { ...x, badge: e.target.value } : x))} onBlur={(e) => updateService(s.id, { badge: e.target.value || null })} className="w-full px-2 py-1 text-xs border border-border rounded bg-background" placeholder="Badge (e.g. PRIVATE) — leave empty for none" />
                            <input value={(s.tags || []).join(", ")} onChange={(e) => { const arr = e.target.value.split(",").map((x) => x.trim()).filter(Boolean); setServices((srv) => srv.map((x) => x.id === s.id ? { ...x, tags: arr } : x)); }} onBlur={(e) => updateService(s.id, { tags: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} className="w-full px-2 py-1 text-xs border border-border rounded bg-background" placeholder="Tags (comma separated)" />
                          </>
                        )}
                        <div className="flex items-center gap-3 text-xs">
                          <label className="flex items-center gap-1"><input type="checkbox" checked={s.is_active} onChange={(e) => updateService(s.id, { is_active: e.target.checked })} /> Active</label>
                          <label className="flex items-center gap-1">Order:
                            <input type="number" value={s.order_index} onChange={(e) => updateService(s.id, { order_index: Number(e.target.value) })} className="w-16 px-1 py-0.5 border border-border rounded bg-background" />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ====== TESTIMONIALS ====== */}
        {tab === "testimonials" && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Customer Testimonials</h3>
              <button onClick={addTestimonial} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm"><Plus className="w-4 h-4" /> Add</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="border border-border rounded-lg p-4 space-y-2 bg-background">
                  <div className="flex gap-2">
                    <input value={t.name} onChange={(e) => setTestimonials((arr) => arr.map((x) => x.id === t.id ? { ...x, name: e.target.value } : x))} onBlur={(e) => updateTestimonial(t.id, { name: e.target.value })} className="flex-1 px-2 py-1 text-sm font-semibold border border-border rounded bg-background" placeholder="Name" />
                    <select value={t.rating} onChange={(e) => updateTestimonial(t.id, { rating: Number(e.target.value) })} className="px-2 py-1 text-sm border border-border rounded bg-background">
                      {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n}★</option>)}
                    </select>
                    <button onClick={() => delTestimonial(t.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <textarea value={t.text} onChange={(e) => setTestimonials((arr) => arr.map((x) => x.id === t.id ? { ...x, text: e.target.value } : x))} onBlur={(e) => updateTestimonial(t.id, { text: e.target.value })} className="w-full px-2 py-1 text-sm border border-border rounded bg-background" rows={3} placeholder="Review text" />
                  <input value={t.date_label || ""} onChange={(e) => setTestimonials((arr) => arr.map((x) => x.id === t.id ? { ...x, date_label: e.target.value } : x))} onBlur={(e) => updateTestimonial(t.id, { date_label: e.target.value })} className="w-full px-2 py-1 text-xs border border-border rounded bg-background" placeholder="Date label (e.g. 2 weeks ago)" />
                  <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={t.is_active} onChange={(e) => updateTestimonial(t.id, { is_active: e.target.checked })} /> Active</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====== SITE CONTENT ====== */}
        {tab === "content" && (
          <ContentEditor settings={settings} onSave={saveSetting} uploadAsset={uploadAsset} />
        )}
      </div>
    </div>
  );
};

const ContentEditor = ({ settings, onSave, uploadAsset }: { settings: any; onSave: (k: string, v: any) => Promise<void>; uploadAsset: (f: File, k: "logo" | "about_image") => Promise<string | null> }) => {
  const [about, setAbout] = useState<any>(settings.about || {});
  const [titles, setTitles] = useState<any>(settings.section_titles || {});
  const [logo, setLogo] = useState<any>(settings.logo || {});

  useEffect(() => { setAbout(settings.about || {}); setTitles(settings.section_titles || {}); setLogo(settings.logo || {}); }, [settings]);

  const handleAbout = async (file: File) => {
    const url = await uploadAsset(file, "about_image");
    if (url) { const next = { ...about, image_url: url }; setAbout(next); await onSave("about", next); }
  };
  const handleLogo = async (file: File) => {
    const url = await uploadAsset(file, "logo");
    if (url) { const next = { url }; setLogo(next); await onSave("logo", next); }
  };

  const inp = "w-full px-3 py-2 text-sm border border-border rounded bg-background";

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-3">Site Logo</h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-muted overflow-hidden flex items-center justify-center">
            {logo.url ? <img src={logo.url} alt="logo" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-muted-foreground" />}
          </div>
          <div>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm cursor-pointer">
              <Upload className="w-4 h-4" /> Upload Logo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogo(e.target.files[0])} />
            </label>
            {logo.url && <button onClick={() => { setLogo({ url: "" }); onSave("logo", { url: "" }); }} className="ml-2 text-xs text-destructive">Remove</button>}
            <p className="text-xs text-muted-foreground mt-2">If no logo is set, the default branded mark is shown.</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-3">About Section</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs uppercase text-muted-foreground">About Image</label>
            <div className="mt-2">
              {about.image_url && <img src={about.image_url} alt="" className="w-full h-48 object-cover rounded-lg mb-2" />}
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm cursor-pointer">
                <Upload className="w-4 h-4" /> Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleAbout(e.target.files[0])} />
              </label>
            </div>
          </div>
          <div className="space-y-3">
            <div><label className="text-xs uppercase text-muted-foreground">Eyebrow Badge</label><input className={inp} value={about.badge || ""} onChange={(e) => setAbout({ ...about, badge: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-2">
              <div><label className="text-xs">Title 1</label><input className={inp} value={about.title_part1 || ""} onChange={(e) => setAbout({ ...about, title_part1: e.target.value })} /></div>
              <div><label className="text-xs">Highlight</label><input className={inp} value={about.title_highlight || ""} onChange={(e) => setAbout({ ...about, title_highlight: e.target.value })} /></div>
              <div><label className="text-xs">Title 2</label><input className={inp} value={about.title_part2 || ""} onChange={(e) => setAbout({ ...about, title_part2: e.target.value })} /></div>
            </div>
            <div><label className="text-xs uppercase text-muted-foreground">Description</label><textarea className={inp} rows={5} value={about.description || ""} onChange={(e) => setAbout({ ...about, description: e.target.value })} /></div>
            <div><label className="text-xs uppercase text-muted-foreground">Established Year</label><input className={inp} value={about.since || ""} onChange={(e) => setAbout({ ...about, since: e.target.value })} /></div>
            <button onClick={() => onSave("about", about)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"><Save className="w-4 h-4" /> Save About</button>
          </div>
        </div>
      </div>

      {/* Section Titles */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-3">Section Headlines</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { sec: "courses", lbl: "Courses" },
            { sec: "why", lbl: "Why Choose Us" },
            { sec: "rto", lbl: "RTO Services" },
          ].map(({ sec, lbl }) => (
            <div key={sec} className="space-y-2 border border-border rounded-lg p-3">
              <div className="font-semibold text-sm">{lbl}</div>
              <input className={inp} placeholder="Eyebrow" value={titles[`${sec}_eyebrow`] || ""} onChange={(e) => setTitles({ ...titles, [`${sec}_eyebrow`]: e.target.value })} />
              <input className={inp} placeholder="Title (left)" value={titles[`${sec}_title`] || ""} onChange={(e) => setTitles({ ...titles, [`${sec}_title`]: e.target.value })} />
              <input className={inp} placeholder="Highlight (gold)" value={titles[`${sec}_highlight`] || ""} onChange={(e) => setTitles({ ...titles, [`${sec}_highlight`]: e.target.value })} />
              <textarea className={inp} rows={2} placeholder="Subtitle" value={titles[`${sec}_sub`] || ""} onChange={(e) => setTitles({ ...titles, [`${sec}_sub`]: e.target.value })} />
            </div>
          ))}
        </div>
        <button onClick={() => onSave("section_titles", titles)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"><Save className="w-4 h-4" /> Save Headlines</button>
      </div>
    </div>
  );
};

export default Admin;
