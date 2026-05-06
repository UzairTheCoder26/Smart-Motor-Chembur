INSERT INTO public.services (section, title, description, icon, badge, tags, order_index)
SELECT
  'rto',
  'RTO Services Training With License',
  'Complete support for learners who want both training and license assistance under one service.',
  'GraduationCap',
  NULL,
  '{}'::text[],
  7
WHERE NOT EXISTS (
  SELECT 1 FROM public.services
  WHERE section = 'rto' AND title = 'RTO Services Training With License'
);

INSERT INTO public.services (section, title, description, icon, badge, tags, order_index)
SELECT
  'rto',
  'License Only (2W, Auto Rickshaw, Car, Bus/Heavy Vehicle)',
  'License application and processing for two-wheeler, auto rickshaw, car, and bus/heavy vehicle categories.',
  'FileCheck',
  NULL,
  '{}'::text[],
  8
WHERE NOT EXISTS (
  SELECT 1 FROM public.services
  WHERE section = 'rto' AND title = 'License Only (2W, Auto Rickshaw, Car, Bus/Heavy Vehicle)'
);
