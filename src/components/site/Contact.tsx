import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { ADDRESS, PHONE, PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/site-data";
import { useServices, useSettings } from "@/hooks/use-site-content";
import { liveStudentCount, mergeAboutStats } from "@/lib/about-stats";
import { toast } from "sonner";
import { MapPin, Phone, MessageCircle, Clock, CheckCircle2, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  area: z.string().trim().max(100).optional().or(z.literal("")),
  course: z.string().min(1, "Select a course"),
  batch: z.string().min(1, "Select a batch"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  whatsapp_consent: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export const Contact = () => {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const COURSES = useServices("courses");
  const siteSettings = useSettings();
  const studentsN = liveStudentCount(mergeAboutStats(siteSettings.about_stats));
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { whatsapp_consent: true },
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from("enquiries").insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      area: data.area || null,
      course: data.course,
      batch: data.batch,
      message: data.message || null,
      whatsapp_consent: data.whatsapp_consent || false,
    });
    if (error) {
      console.error("Enquiry submit error:", error);
      toast.error("Could not submit: " + error.message);
      return;
    }

    toast.success("Enquiry submitted!");
    setSubmitted(data.name);
  };

  if (submitted) {
    return (
      <section id="contact" className="py-24 md:py-32">
        <div className="container max-w-2xl">
          <div className="glass-strong rounded-3xl p-12 text-center gold-border-glow animate-scale-in">
            <CheckCircle2 className="w-20 h-20 text-success mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl mb-4">
              🎉 Thank you, <span className="text-gold-gradient">{submitted}!</span>
            </h2>
            <p className="text-foreground/80 text-lg mb-8">We'll contact you shortly — within 2 hours.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold">
              <MessageCircle className="w-5 h-5" /> WhatsApp Us Now
            </a>
          </div>
        </div>
      </section>
    );
  }

  const inputCls = "w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50";

  return (
    <section id="contact" className="py-24 md:py-32 bg-card/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 rounded-full glass mb-4">
            <span className="text-xs font-orbitron tracking-[0.2em] text-primary">GET IN TOUCH</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl mb-3">
            START YOUR <span className="text-gold-gradient">DRIVING JOURNEY</span>
          </h2>
          <p className="text-muted-foreground">Fill in your details and we'll get back to you within 2 hours.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 glass-strong rounded-2xl p-6 md:p-10 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-primary mb-2">Full Name *</label>
                <input {...register("name")} className={inputCls} placeholder="Your name" />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-primary mb-2">Phone *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+91</span>
                  <input {...register("phone")} className={inputCls + " pl-12"} placeholder="9320521888" maxLength={10} />
                </div>
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-primary mb-2">Email</label>
                <input {...register("email")} className={inputCls} placeholder="you@email.com" />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-primary mb-2">Area / Locality</label>
                <input {...register("area")} className={inputCls} placeholder="e.g. Chembur, Ghatkopar" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-primary mb-2">Course Interested In *</label>
                <select {...register("course")} className={inputCls} defaultValue="">
                  <option value="" disabled>Select a course</option>
                  {COURSES.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
                </select>
                {errors.course && <p className="text-destructive text-xs mt-1">{errors.course.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-primary mb-2">Preferred Batch *</label>
                <select {...register("batch")} className={inputCls} defaultValue="">
                  <option value="" disabled>Select batch</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Weekend">Weekend</option>
                </select>
                {errors.batch && <p className="text-destructive text-xs mt-1">{errors.batch.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-primary mb-2">Message</label>
              <textarea {...register("message")} rows={3} className={inputCls} placeholder="Any questions or special requests?" />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" {...register("whatsapp_consent")} className="mt-1 accent-primary w-4 h-4" />
              <span className="text-sm text-foreground/80">I agree to be contacted via WhatsApp / Call by Smart Motor Driving School.</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 rounded-full bg-gradient-gold text-primary-foreground font-bold text-lg shadow-gold hover:shadow-glow transition-all duration-300 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <>SUBMIT ENQUIRY →</>}
            </button>
          </form>

          {/* Contact info */}
          <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <div className="text-xs font-orbitron tracking-[0.2em] text-primary mb-2">VISIT US</div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/85 leading-relaxed">{ADDRESS}</p>
              </div>
            </div>

            <a href={`tel:${PHONE}`} className="flex items-center gap-3 hover:text-primary transition-colors group">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Call</div>
                <div className="font-semibold text-foreground">{PHONE_DISPLAY}</div>
              </div>
            </a>

            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Chat</div>
                <div className="font-semibold text-foreground">WhatsApp</div>
              </div>
            </a>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm">
                <div className="text-xs text-muted-foreground mb-1">Hours</div>
                <div className="text-foreground/85">Mon–Fri: 9 AM – 10 PM</div>
                <div className="text-foreground/85">Sun: 11 AM – 7 PM</div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground italic">
                &quot;Join {studentsN.toLocaleString()}+ confident drivers from Chembur.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
