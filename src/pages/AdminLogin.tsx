import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const ensureFirstAdminRole = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: roleData, error } = await supabase
      .from("user_roles")
      .insert({ user_id: userData.user.id, role: "admin" as const })
      .select("id")
      .single();

    // Ignore expected "already exists / not allowed" cases; this is best-effort bootstrap.
    if (error && !error.message.toLowerCase().includes("duplicate key")) {
      return;
    }
    if (roleData) {
      toast.success("First admin role granted.");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("admin-theme");
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        ensureFirstAdminRole().finally(() => navigate("/admin"));
      }
    });
    return () => document.documentElement.classList.remove("admin-theme");
  }, [navigate, ensureFirstAdminRole]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else {
        await ensureFirstAdminRole();
        toast.success("Welcome back!");
        navigate("/admin");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (error) toast.error(error.message);
      else if (data.user) {
        // If signup returns a session, bootstrap admin immediately.
        if (data.session) {
          await ensureFirstAdminRole();
          toast.success("Account created! You can now log in.");
        } else {
          toast.success("Account created. Verify email, then sign in to finish admin setup.");
        }
        setMode("login");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background admin-theme">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-gold mb-3 flex items-center justify-center text-primary-foreground font-bold">SM</div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Smart Motor Driving School</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary" />
          </div>
          <button disabled={loading} type="submit" className="w-full py-2.5 rounded-lg bg-gradient-gold text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Sign In" : "Create Admin Account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-sm text-primary mt-4 w-full text-center">
          {mode === "login" ? "First-time setup? Create admin account" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
