const pad = (n: number) => String(n).padStart(2, "0");

/** Local calendar date as YYYY-MM-DD. */
export function isoDate(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Timestamp as "YYYY-MM-DD HH:mm" in local time — the format the design shows. */
export function dateTime(ts: string): string {
  const d = new Date(ts);
  return `${isoDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "HH:mm:ss" → "HH:mm" */
export function hhmm(t: string): string {
  return t.slice(0, 5);
}

/** Whole days from today until a YYYY-MM-DD date (negative if past). */
export function daysUntil(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return isoDate(new Date(y, m - 1, d + days));
}

export function initials(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function greeting(d: Date = new Date()): string {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function clock(d: Date = new Date()): string {
  return `${d.getHours() % 12 || 12}:${pad(d.getMinutes())}`;
}
