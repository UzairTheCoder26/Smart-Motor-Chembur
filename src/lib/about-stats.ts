/** Featured About section stats — stored in site_settings.about_stats */

export type AboutStats = {
  students_base: number;
  students_daily: number;
  /** Local calendar date YYYY-MM-MM when `students_base` was the correct count */
  students_anchor: string;
  years: number;
  years_suffix: string;
  rto: number;
  rto_suffix: string;
  /** Store 10× display (e.g. 49 → 4.9★) */
  google_rating_tenths: number;
  google_suffix: string;
  label_students: string;
  label_years: string;
  label_rto: string;
  label_google: string;
};

export const defaultAboutStats = (): AboutStats => {
  const today = localDateString();
  return {
    students_base: 1100,
    students_daily: 45,
    students_anchor: today,
    years: 8,
    years_suffix: "+",
    rto: 98,
    rto_suffix: "%",
    google_rating_tenths: 49,
    google_suffix: "★",
    label_students: "Students Trained",
    label_years: "Years Experience",
    label_rto: "RTO Pass Rate",
    label_google: "Google Rating",
  };
};

export function localDateString(d = new Date()): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseLocalYMD(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Whole calendar days from anchor (local) to today (local), inclusive of anchor as day 0 */
export function calendarDaysSinceAnchor(anchorYmd: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(anchorYmd)) return 0;
  const a = parseLocalYMD(anchorYmd);
  const t = new Date();
  const b = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return Math.max(0, Math.floor((b.getTime() - a.getTime()) / 86_400_000));
}

export function mergeAboutStats(raw: unknown): AboutStats {
  const d = defaultAboutStats();
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    students_base: num(o.students_base, d.students_base),
    students_daily: num(o.students_daily, d.students_daily),
    students_anchor: typeof o.students_anchor === "string" && o.students_anchor ? o.students_anchor : d.students_anchor,
    years: num(o.years, d.years),
    years_suffix: str(o.years_suffix, d.years_suffix),
    rto: num(o.rto, d.rto),
    rto_suffix: str(o.rto_suffix, d.rto_suffix),
    google_rating_tenths: num(o.google_rating_tenths, d.google_rating_tenths),
    google_suffix: str(o.google_suffix, d.google_suffix),
    label_students: str(o.label_students, d.label_students),
    label_years: str(o.label_years, d.label_years),
    label_rto: str(o.label_rto, d.label_rto),
    label_google: str(o.label_google, d.label_google),
  };
}

function num(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function str(v: unknown, fallback: string): string {
  return typeof v === "string" ? v : fallback;
}

export function liveStudentCount(s: AboutStats): number {
  return s.students_base + calendarDaysSinceAnchor(s.students_anchor) * s.students_daily;
}

export type StatRow = {
  val: number;
  suffix: string;
  label: string;
  divisor?: number;
};

export function aboutStatRows(s: AboutStats, studentDisplay: number): StatRow[] {
  return [
    { val: studentDisplay, suffix: "+", label: s.label_students },
    { val: s.years, suffix: s.years_suffix, label: s.label_years },
    { val: s.rto, suffix: s.rto_suffix, label: s.label_rto },
    { val: s.google_rating_tenths, suffix: s.google_suffix, label: s.label_google, divisor: 10 },
  ];
}
