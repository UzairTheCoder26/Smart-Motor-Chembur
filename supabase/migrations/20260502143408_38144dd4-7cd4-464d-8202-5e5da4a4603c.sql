
-- Multi-tag categories on gallery, plus hero flag
ALTER TABLE public.gallery_images ADD COLUMN IF NOT EXISTS categories text[] NOT NULL DEFAULT ARRAY['all']::text[];
ALTER TABLE public.gallery_images ADD COLUMN IF NOT EXISTS is_hero boolean NOT NULL DEFAULT false;

-- Backfill categories from existing single category
UPDATE public.gallery_images SET categories = ARRAY[COALESCE(category,'all')] WHERE (categories IS NULL OR array_length(categories,1) IS NULL);

-- Site settings: simple key/value JSON store for editable text & uploads
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage site_settings" ON public.site_settings FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Services / cards (used for Courses + WhyChooseUs + RTO sections)
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL, -- 'courses' | 'why' | 'rto'
  title text NOT NULL,
  description text,
  icon text, -- emoji or lucide name
  badge text, -- e.g. PRIVATE / FEMALE
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  order_index int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins manage services" ON public.services FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  text text NOT NULL,
  date_label text,
  order_index int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Storage bucket for site assets (logo, about image, hero images optional)
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets','site-assets', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public read site-assets" ON storage.objects FOR SELECT USING (bucket_id='site-assets');
CREATE POLICY "Admins upload site-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id='site-assets' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete site-assets" ON storage.objects FOR DELETE USING (bucket_id='site-assets' AND public.has_role(auth.uid(),'admin'));

-- Seed default services (courses): replace Road Test with Female Driving
INSERT INTO public.services (section,title,description,icon,badge,tags,order_index) VALUES
('courses','Manual Car Driving','Master the classic manual transmission with confidence and full road awareness.','🚗',NULL,ARRAY['Clutch Control','Gear Shifting','Hill Start','City Traffic'],1),
('courses','Automatic Car Driving','Premium one-on-one personalised sessions in modern automatic vehicles.','⚡','PRIVATE',ARRAY['Eco-Driving','Lane Discipline','Parking','Low-Stress'],2),
('courses','Two-Wheeler Training','Build balance, control and safe-rider habits from day one.','🏍️',NULL,ARRAY['Balance','Braking','Safe Turns','Speed Control'],3),
('courses','Female Driving (Female Trainers)','Comfortable, judgement-free training led by certified female instructors — ideal for women learners who prefer a female trainer.','👩','FEMALE',ARRAY['Female Trainer','Patient Coaching','Safe Environment','Confidence Building'],4),
('courses','License Assistance (RTO)','Documentation, slot booking & end-to-end license guidance.','📋',NULL,ARRAY['Documentation','Slot Booking','Form Help','Guidance'],5),
('courses','Flexible Batches','Morning, evening, weekend slots. Pickup & drop available.','🕐',NULL,ARRAY['Morning','Evening','Weekend','Pickup & Drop'],6),
('rto','HSRP Number Plates','Official high-security registration plates fitted.','FileText',NULL,'{}',1),
('rto','Vehicle Insurance','Quick policy issuance and renewals.','Shield',NULL,'{}',2),
('rto','Ownership Transfer','Hassle-free RC transfer assistance.','ArrowRightLeft',NULL,'{}',3),
('rto','Name / Address Change','Update your license details easily.','UserCog',NULL,'{}',4),
('rto','License Renewal & Duplicate','Get renewals and duplicates fast.','RefreshCw',NULL,'{}',5),
('rto','Complete RTO Work','End-to-end RTO compliance support.','Briefcase',NULL,'{}',6),
('why','Certified Instructors','RTO-certified, experienced trainers who''ve taught hundreds of confident drivers.','GraduationCap',NULL,'{}',1),
('why','Real-Road Practice','Train on actual Mumbai roads — not just empty parking lots.','Route',NULL,'{}',2),
('why','Manual + Automatic','Modern vehicles for both transmission types, well maintained & insured.','Car',NULL,'{}',3),
('why','Full RTO Support','Documentation, slot booking, mock tests — we handle the paperwork.','FileCheck',NULL,'{}',4),
('why','Parking & Hill Start','Dedicated drills for parallel parking, reverse, and hill start mastery.','ParkingCircle',NULL,'{}',5),
('why','Flexible Batches','Morning, evening, weekend slots that fit around your schedule.','Clock',NULL,'{}',6);

-- Seed testimonials
INSERT INTO public.testimonials (name,rating,text,date_label,order_index) VALUES
('Priya Sharma',5,'Best driving school in Chembur! The instructor was so patient with me. Cleared my RTO test in the first attempt!','2 weeks ago',1),
('Rahul Mehta',5,'Took the automatic course — extremely professional, real traffic practice, and very flexible timings. Highly recommend.','1 month ago',2),
('Anjali Desai',5,'I was a nervous beginner and Smart Motor changed that completely. I drive confidently in Mumbai traffic now. Thank you!','1 month ago',3);

-- Seed default site_settings
INSERT INTO public.site_settings (key,value) VALUES
('about', '{"badge":"ABOUT US","title_part1":"Your Journey to","title_highlight":"Confident Driving","title_part2":"Starts Here","description":"At Smart Motor Driving School, we don''t just teach driving — we build confidence. With over a decade of experience training drivers across Chembur, Tilak Nagar and the eastern suburbs of Mumbai, our certified instructors specialise in patient, real-traffic instruction tailored to every learner.","since":"2015","image_url":""}'::jsonb),
('logo', '{"url":""}'::jsonb),
('section_titles', '{"courses_eyebrow":"CURRICULUM","courses_title":"OUR","courses_highlight":"DRIVING COURSES","courses_sub":"Structured programs for every learner — from total beginners to refresher drivers.","why_eyebrow":"THE EDGE","why_title":"WHY LEARNERS","why_highlight":"CHOOSE US","why_sub":"Six reasons we''re Chembur''s most trusted driving school.","rto_eyebrow":"RTO SERVICES","rto_title":"RTO & VEHICLE","rto_highlight":"SERVICES","rto_sub":"We handle all RTO-related work to make your life easier."}'::jsonb)
ON CONFLICT (key) DO NOTHING;
