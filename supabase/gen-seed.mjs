// Generates supabase/migrations/*_seed.sql from the design prototype's data.js.
// Usage: node supabase/gen-seed.mjs
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const src = readFileSync(new URL("../project/data.js", import.meta.url), "utf8");
const ctx = { window: {} };
vm.runInNewContext(src, ctx);
const D = ctx.window.APP_DATA;

const q = (v) => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  return `'${String(v).replace(/'/g, "''")}'`;
};
const arr = (a, type = "text") => `array[${a.map(q).join(",")}]::${type}[]`;
const insert = (table, cols, rows) =>
  rows.length
    ? `insert into public.${table} (${cols.join(", ")}) values\n  ${rows
        .map((r) => `(${r.join(", ")})`)
        .join(",\n  ")};\n`
    : "";
const ts = (s) => q(s.replace(" ", "T") + ":00+05:30");

let sql = "-- Seed data generated from project/data.js by supabase/gen-seed.mjs\n\n";

sql += insert(
  "core_members",
  ["id", "name", "role", "team", "tower", "flat", "phone", "email", "responsibilities", "avatar", "sort"],
  D.coreMembers.map((m, i) => [q(m.id), q(m.name), q(m.role), q(m.team), q(m.tower), q(m.flat), q(m.phone), q(m.email), arr(m.responsibilities), q(m.avatar), i])
);

sql += insert(
  "maintenance_items",
  ["id", "category", "subcategory", "name", "status", "last_inspected", "next_check", "assigned_to", "warranty_expiry", "notes", "sort"],
  D.maintenanceItems.map((m, i) => [q(m.id), q(m.category), q(m.subcategory), q(m.name), q(m.status), q(m.lastInspected), q(m.nextCheck), q(m.assignedTo), q(m.warrantyExpiry), q(m.notes), i])
);
sql += insert(
  "maintenance_history",
  ["item_id", "date", "status", "note", "inspector"],
  D.maintenanceItems.flatMap((m) => m.history.map((h) => [q(m.id), q(h.date), q(h.status), q(h.note), q(h.inspector)]))
);

sql += insert(
  "issues",
  ["id", "category", "subcategory", "priority", "status", "raised_by", "raised_by_name", "flat", "assigned_to", "area", "description", "sla", "created_at", "updated_at"],
  D.issues.map((i) => [q(i.id), q(i.category), q(i.subcategory), q(i.priority), q(i.status), "null", q(i.raisedBy), q(i.flat), q(i.assignedTo), q(i.area), q(i.description), q(i.sla), ts(i.created), ts(i.updated)])
);
sql += insert(
  "issue_comments",
  ["issue_id", "author_id", "author_name", "body", "created_at"],
  D.issues.flatMap((i) => i.comments.map((c) => [q(i.id), "null", q(c.by), q(c.text), ts(c.time)]))
);

sql += insert(
  "events",
  ["id", "name", "date", "time_label", "location", "organizer", "description", "registered_base", "capacity", "status", "category"],
  D.events.map((e) => [q(e.id), q(e.name), q(e.date), q(e.time), q(e.location), q(e.organizer), q(e.description), e.registered, e.capacity, q(e.status), q(e.category)])
);
sql += insert(
  "proposals",
  ["id", "name", "proposed_by", "flat", "description", "budget", "proposed_date", "status", "approved_by", "votes_yes", "votes_no"],
  D.proposals.map((p) => [q(p.id), q(p.name), q(p.proposedBy), q(p.flat), q(p.description), q(p.budget), q(p.proposedDate), q(p.status), q(p.approvedBy), p.votes.yes, p.votes.no])
);
// Gallery albums are hard-coded in screen-cultural.jsx
const albums = [
  ["Ugadi 2026", 24, "Apr 2026", "🌸", 45],
  ["New Year 2026", 38, "Jan 2026", "🎆", 200],
  ["Diwali 2025", 52, "Oct 2025", "🪔", 270],
  ["Ganesh Chaturthi 2025", 41, "Sep 2025", "🐘", 120],
  ["Sports Day 2025", 29, "May 2025", "🏅", 30],
  ["Onam 2025", 33, "Sep 2025", "🌺", 160],
];
sql += insert(
  "gallery_albums",
  ["name", "photo_count", "date_label", "emoji", "hue", "sort"],
  albums.map(([n, c, d, e, h], i) => [q(n), c, q(d), q(e), h, i])
);

sql += insert(
  "facilities",
  ["id", "name", "icon", "slots", "max_duration", "buffer", "charges", "rules", "sort"],
  D.facilities.map((f, i) => [q(f.id), q(f.name), q(f.icon), f.slots, f.maxDuration, f.buffer, q(f.charges), arr(f.rules), i])
);
const facId = Object.fromEntries(D.facilities.map((f) => [f.name, f.id]));
sql += insert(
  "bookings",
  ["id", "facility_id", "date", "start_time", "end_time", "user_id", "booked_by", "flat", "status", "purpose"],
  D.bookings.map((b) => [q("TT-BK-" + b.id.toUpperCase()), q(facId[b.facility]), q(b.date), q(b.startTime), q(b.endTime), "null", q(b.bookedBy), q(b.flat), q(b.status), q(b.purpose)])
);

sql += insert(
  "community_policies",
  ["id", "category", "icon", "rules", "sort"],
  D.policies.map((p, i) => [q(p.id), q(p.category), q(p.icon), arr(p.rules), i])
);

sql += insert(
  "polls",
  ["id", "title", "description", "start_date", "end_date", "eligible_voters", "options", "base_votes", "total_eligible", "status"],
  D.polls.map((p) => [q(p.id), q(p.title), q(p.description), q(p.startDate), q(p.endDate), q(p.eligibleVoters), arr(p.options), arr(p.votes, "int"), p.totalEligible, q(p.status)])
);

// Only community-wide notifications are seeded as broadcasts. Personal ones
// (ticket updates, booking confirmations) are created by triggers per user.
const PERSONAL = new Set(["n1", "n3"]);
sql += insert(
  "notifications",
  ["id", "user_id", "type", "title", "message", "created_at"],
  D.notifications.filter((n) => !PERSONAL.has(n.id)).map((n) => [q(n.id), "null", q(n.type), q(n.title), q(n.message), ts(n.time)])
);

const out = new URL("./migrations/20261005000002_seed_data.sql", import.meta.url);
writeFileSync(out, sql);
console.log("wrote", out.pathname, sql.length, "bytes");
