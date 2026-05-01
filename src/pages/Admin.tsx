import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Download, Trash2, Upload, Image as ImageIcon, Mail, Loader2 } from "lucide-react";

type Enquiry = {
  id: string; name: string; phone: string; email: string | null;
  area: string | null; course: string; batch: string;
  message: string | null; status: string; created_at: string;
};
type GImage = { id: string; url: string; caption: string | null; category: string | null };

const Admin = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"leads" | "gallery">("leads");
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [images, setImages] = useState<GImage[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { document.documentElement.classList.add("admin-theme"); return () => document.documentElement.classList.remove("admin-theme"); }, []);

  const load = useCallback(async () => {
    const session = await supabase.auth.getSession();
    if (!session.data.session) { navigate("/admin/login"); return; }
    const [{ data: en }, { data: im }] = await Promise.all([
      supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_images").select("*").order("order_index"),
    ]);
    setEnquiries((en as Enquiry[]) || []);
    setImages((im as GImage[]) || []);
    setLoading(false);
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const logout = async () => { await supabase.auth.signOut(); navigate("/admin/login"); };

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

  const upload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("gallery").upload(path, file);
      if (error) { toast.error(error.message); continue; }
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      await supabase.from("gallery_images").insert({ url: pub.publicUrl, caption: file.name.split(".")[0], category: "all" });
    }
    setUploading(false);
    toast.success("Uploaded!");
    load();
  };

  const delImg = async (id: string) => {
    if (!confirm("Delete image?")) return;
    await supabase.from("gallery_images").delete().eq("id", id);
    setImages((is) => is.filter((i) => i.id !== id));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

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

      <div className="container py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm text-muted-foreground">Total Enquiries</div>
            <div className="text-3xl font-bold mt-1">{enquiries.length}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm text-muted-foreground">New (Today)</div>
            <div className="text-3xl font-bold mt-1">{enquiries.filter((e) => new Date(e.created_at).toDateString() === new Date().toDateString()).length}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm text-muted-foreground">Gallery Images</div>
            <div className="text-3xl font-bold mt-1">{images.length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-border">
          <button onClick={() => setTab("leads")} className={`px-4 py-2 font-medium border-b-2 ${tab === "leads" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
            <Mail className="w-4 h-4 inline mr-1" /> Leads ({enquiries.length})
          </button>
          <button onClick={() => setTab("gallery")} className={`px-4 py-2 font-medium border-b-2 ${tab === "gallery" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
            <ImageIcon className="w-4 h-4 inline mr-1" /> Gallery ({images.length})
          </button>
        </div>

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
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="closed">Closed</option>
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

        {tab === "gallery" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Gallery Manager</h2>
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload Images
                <input type="file" multiple accept="image/*" onChange={(e) => upload(e.target.files)} className="hidden" />
              </label>
            </div>
            {images.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No images yet. Upload some — the public site will use Unsplash placeholders until you do.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border">
                    <img src={img.url} alt={img.caption || ""} className="w-full h-40 object-cover" />
                    <button onClick={() => delImg(img.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-2 text-xs truncate bg-card">{img.caption || "Untitled"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
