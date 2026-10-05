// In-memory stand-in for the Supabase REST + auth endpoints the app calls, for
// UI tests where the real project isn't reachable. Seeded from project/data.js
// and mirroring the per-user visibility rules of the RLS policies.
import { readFileSync } from "node:fs";
import vm from "node:vm";

const src = readFileSync(new URL("../../project/data.js", import.meta.url), "utf8");
const ctx = { window: {} };
vm.runInNewContext(src, ctx);
const D = ctx.window.APP_DATA;

export const USER_ID = "eeeeeeee-0000-4000-8000-000000000e2e";
const ts = (s) => s.replace(" ", "T") + ":00+05:30";

function seed() {
  const facId = Object.fromEntries(D.facilities.map((f) => [f.name, f.id]));
  return {
    profiles: [{ id: USER_ID, name: null, flat: null, tower: null, phone: "919999900001", email: null, role: "resident" }],
    core_members: D.coreMembers.map((m, i) => ({ ...m, sort: i })),
    maintenance_items: D.maintenanceItems.map((m, i) => ({
      id: m.id, category: m.category, subcategory: m.subcategory, name: m.name, status: m.status,
      last_inspected: m.lastInspected, next_check: m.nextCheck, assigned_to: m.assignedTo,
      warranty_expiry: m.warrantyExpiry, notes: m.notes, sort: i,
    })),
    maintenance_history: D.maintenanceItems.flatMap((m) => m.history.map((h, k) => ({ id: `${m.id}-${k}`, item_id: m.id, ...h }))),
    issues: D.issues.map((i) => ({
      id: i.id, category: i.category, subcategory: i.subcategory, priority: i.priority, status: i.status,
      raised_by: null, raised_by_name: i.raisedBy, flat: i.flat, assigned_to: i.assignedTo, area: i.area,
      description: i.description, sla: i.sla, created_at: ts(i.created), updated_at: ts(i.updated),
    })),
    issue_comments: D.issues.flatMap((i) => i.comments.map((c, k) => ({
      id: `${i.id}-${k}`, issue_id: i.id, author_id: null, author_name: c.by, body: c.text, created_at: ts(c.time),
    }))),
    events: D.events.map((e) => ({
      id: e.id, name: e.name, date: e.date, time_label: e.time, location: e.location, organizer: e.organizer,
      description: e.description, registered_base: e.registered, capacity: e.capacity, status: e.status, category: e.category,
    })),
    event_registrations: [],
    proposals: D.proposals.map((p) => ({
      id: p.id, name: p.name, proposed_by: p.proposedBy, flat: p.flat, description: p.description, budget: p.budget,
      proposed_date: p.proposedDate, status: p.status, approved_by: p.approvedBy, votes_yes: p.votes.yes, votes_no: p.votes.no,
    })),
    gallery_albums: [
      ["Ugadi 2026", 24, "Apr 2026", "🌸", 45], ["New Year 2026", 38, "Jan 2026", "🎆", 200],
      ["Diwali 2025", 52, "Oct 2025", "🪔", 270], ["Ganesh Chaturthi 2025", 41, "Sep 2025", "🐘", 120],
      ["Sports Day 2025", 29, "May 2025", "🏅", 30], ["Onam 2025", 33, "Sep 2025", "🌺", 160],
    ].map(([name, photo_count, date_label, emoji, hue], sort) => ({ name, photo_count, date_label, emoji, hue, sort })),
    facilities: D.facilities.map((f, i) => ({
      id: f.id, name: f.name, icon: f.icon, slots: f.slots, max_duration: f.maxDuration, buffer: f.buffer,
      charges: f.charges, rules: f.rules, sort: i,
    })),
    bookings: D.bookings.map((b) => ({
      id: "TT-BK-" + b.id.toUpperCase(), facility_id: facId[b.facility], date: b.date,
      start_time: b.startTime + ":00", end_time: b.endTime + ":00", user_id: null, booked_by: b.bookedBy,
      flat: b.flat, status: b.status, purpose: b.purpose ?? null,
    })),
    community_policies: D.policies.map((p, i) => ({ ...p, sort: i })),
    polls: D.polls.map((p) => ({
      id: p.id, title: p.title, description: p.description, start_date: p.startDate, end_date: p.endDate,
      eligible_voters: p.eligibleVoters, options: p.options, base_votes: p.votes, total_eligible: p.totalEligible, status: p.status,
    })),
    poll_votes: [],
    notifications: D.notifications.filter((n) => !["n1", "n3"].includes(n.id)).map((n) => ({
      id: n.id, user_id: null, type: n.type, title: n.title, message: n.message, created_at: ts(n.time),
    })),
    notification_reads: [],
  };
}

function b64url(o) {
  return Buffer.from(JSON.stringify(o)).toString("base64url");
}

export function fakeSession() {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const user = { id: USER_ID, aud: "authenticated", role: "authenticated", phone: "919999900001", email: "", app_metadata: {}, user_metadata: {} };
  return {
    access_token: `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url({ sub: USER_ID, role: "authenticated", exp })}.sig`,
    token_type: "bearer", expires_in: 3600, expires_at: exp, refresh_token: "mock-refresh", user,
  };
}

/**
 * Routes every request to `supabaseUrl` through the in-memory backend, including
 * a minimal Realtime (Phoenix, vsn 2.0.0) websocket. Returns the db plus
 * `neighbour.*` helpers that write as another resident and broadcast the change,
 * the way the database triggers do.
 */
export async function installMock(context, supabaseUrl) {
  const db = seed();
  const sockets = new Set();
  const broadcast = (table) => {
    for (const ws of sockets) {
      ws.send(JSON.stringify([null, null, "realtime:community", "broadcast", {
        type: "broadcast", event: "change", payload: { table },
      }]));
    }
  };

  await context.routeWebSocket(/\/realtime\/v1\/websocket/, (ws) => {
    sockets.add(ws);
    ws.onMessage((raw) => {
      const [joinRef, ref, topic, event] = JSON.parse(String(raw));
      if (event === "phx_join" || event === "heartbeat" || event === "access_token") {
        ws.send(JSON.stringify([joinRef, ref, topic, "phx_reply", { status: "ok", response: { postgres_changes: [] } }]));
      }
    });
    ws.onClose(() => sockets.delete(ws));
  });
  let issueSeq = 11;
  let bookingSeq = 2848;
  const now = () => new Date().toISOString();

  const json = (route, status, body, headers = {}) =>
    route.fulfill({ status, contentType: "application/json", headers: { "access-control-allow-origin": "*", ...headers }, body: body === undefined ? "" : JSON.stringify(body) });

  const visible = (table) => {
    const rows = db[table];
    switch (table) {
      case "profiles": return rows.filter((r) => r.id === USER_ID);
      case "bookings": case "poll_votes": case "event_registrations": case "notification_reads":
        return rows.filter((r) => r.user_id === USER_ID);
      case "notifications": return rows.filter((r) => r.user_id === null || r.user_id === USER_ID);
      default: return rows;
    }
  };

  const applyFilters = (rows, params) => {
    for (const [k, v] of params) {
      if (["select", "order", "limit", "on_conflict", "columns"].includes(k)) continue;
      const [op, ...rest] = v.split(".");
      const val = rest.join(".");
      if (op === "eq") rows = rows.filter((r) => String(r[k]) === val);
      if (op === "neq") rows = rows.filter((r) => String(r[k]) !== val);
    }
    const order = params.find(([k]) => k === "order")?.[1];
    if (order) {
      const keys = order.split(",").map((o) => o.split("."));
      rows = [...rows].sort((a, b) => {
        for (const [col, dir] of keys) {
          const c = String(a[col] ?? "").localeCompare(String(b[col] ?? ""), undefined, { numeric: true });
          if (c) return dir === "desc" ? -c : c;
        }
        return 0;
      });
    }
    return rows;
  };

  const embed = (table, rows, select) => rows.map((r) => {
    const out = { ...r };
    if (table === "issues" && select.includes("issue_comments")) out.issue_comments = db.issue_comments.filter((c) => c.issue_id === r.id);
    if (table === "maintenance_items" && select.includes("maintenance_history")) out.maintenance_history = db.maintenance_history.filter((h) => h.item_id === r.id);
    return out;
  });

  const rpc = {
    event_counts: () => db.events.map((e) => ({
      event_id: e.id, registered: e.registered_base + db.event_registrations.filter((r) => r.event_id === e.id).length,
    })),
    poll_results: () => db.polls.map((p) => ({
      poll_id: p.id, votes: p.base_votes.map((b, i) => b + db.poll_votes.filter((v) => v.poll_id === p.id && v.option_idx === i).length),
    })),
    taken_slots: ({ p_facility_id, p_from, p_to }) => db.bookings
      .filter((b) => b.facility_id === p_facility_id && b.date >= p_from && b.date <= p_to && b.status !== "cancelled")
      .map((b) => ({ date: b.date, start_time: b.start_time })),
  };

  const insert = (table, row) => {
    row = { ...row };
    if (table === "issues") {
      if (row.raised_by !== USER_ID || (row.status && row.status !== "Open")) throw { status: 403, message: "new row violates row-level security policy" };
      Object.assign(row, { id: `TT-${String(issueSeq++).padStart(3, "0")}`, status: "Open", assigned_to: "Unassigned", created_at: now(), updated_at: now() });
    }
    if (table === "issue_comments") {
      Object.assign(row, { id: crypto.randomUUID(), created_at: now() });
      const issue = db.issues.find((i) => i.id === row.issue_id);
      if (issue) issue.updated_at = now();
    }
    if (table === "bookings") {
      const clash = db.bookings.some((b) => b.facility_id === row.facility_id && b.date === row.date && b.start_time.slice(0, 5) === row.start_time.slice(0, 5) && b.status !== "cancelled");
      if (clash) throw { status: 409, code: "23505", message: "duplicate key value violates unique constraint \"bookings_slot_unique\"" };
      Object.assign(row, { id: `TT-BK-${bookingSeq++}`, status: "confirmed", start_time: row.start_time + ":00", end_time: row.end_time + ":00" });
      const fac = db.facilities.find((f) => f.id === row.facility_id);
      db.notifications.push({
        id: crypto.randomUUID(), user_id: USER_ID, type: "booking", title: "Booking Confirmed",
        message: `${fac.name} booked for ${row.date}, ${row.start_time.slice(0, 5)}–${row.end_time.slice(0, 5)}. Booking ID: ${row.id}.`,
        created_at: now(),
      });
    }
    if (table === "poll_votes") {
      const poll = db.polls.find((p) => p.id === row.poll_id);
      if (!poll || poll.status !== "active") throw { status: 403, message: "new row violates row-level security policy" };
      if (db.poll_votes.some((v) => v.poll_id === row.poll_id && v.user_id === USER_ID)) throw { status: 409, code: "23505", message: "duplicate key" };
    }
    if (table === "notification_reads" && db.notification_reads.some((r) => r.notification_id === row.notification_id)) return null;
    db[table].push(row);
    return row;
  };

  await context.route(`${supabaseUrl}/**`, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();
    if (method === "OPTIONS") return json(route, 200, {}, { "access-control-allow-headers": "*", "access-control-allow-methods": "*" });

    // ── Auth ──
    if (url.pathname.startsWith("/auth/v1/")) {
      const p = url.pathname.slice(9);
      if (p === "otp") return json(route, 400, { code: 400, error_code: "phone_provider_disabled", msg: "Unsupported phone provider" });
      if (p === "logout") return json(route, 204);
      if (p === "user") return json(route, 200, fakeSession().user);
      if (p.startsWith("token")) return json(route, 200, fakeSession());
      return json(route, 404, { msg: "not mocked: " + p });
    }

    // ── RPC ──
    if (url.pathname.startsWith("/rest/v1/rpc/")) {
      const fn = url.pathname.slice(13);
      return json(route, 200, rpc[fn](req.postDataJSON() ?? {}));
    }

    // ── Tables ──
    const table = url.pathname.slice(9);
    const params = [...url.searchParams];
    const select = url.searchParams.get("select") ?? "*";
    const single = (req.headers()["accept"] ?? "").includes("vnd.pgrst.object");
    const respond = (rows) => json(route, 200, single ? rows[0] : rows);

    try {
      if (method === "GET") return respond(embed(table, applyFilters(visible(table), params), select));
      if (method === "POST") {
        const body = req.postDataJSON();
        const rows = (Array.isArray(body) ? body : [body]).map((r) => insert(table, r)).filter(Boolean);
        return respond(embed(table, rows, select));
      }
      if (method === "PATCH") {
        const patch = req.postDataJSON();
        const rows = applyFilters(visible(table), params);
        rows.forEach((r) => Object.assign(r, patch));
        return respond(rows);
      }
      if (method === "DELETE") {
        const rows = applyFilters(visible(table), params);
        db[table] = db[table].filter((r) => !rows.includes(r));
        return json(route, 204);
      }
    } catch (e) {
      return json(route, e.status ?? 400, { code: e.code ?? "42501", message: e.message });
    }
    return json(route, 405, { message: "not mocked" });
  });

  const NEIGHBOUR = "aaaaaaaa-0000-4000-8000-00000000aaaa";
  const neighbour = {
    connected: () => sockets.size,
    book(facilityId, date, start) {
      db.bookings.push({
        id: `TT-BK-${bookingSeq++}`, facility_id: facilityId, date, start_time: `${start}:00`,
        end_time: `${String(Number(start.slice(0, 2)) + 1).padStart(2, "0")}:00:00`,
        user_id: NEIGHBOUR, booked_by: "Neighbour", flat: "B-101", status: "confirmed", purpose: null,
      });
      broadcast("bookings");
    },
    raiseIssue(description) {
      const id = `TT-${String(issueSeq++).padStart(3, "0")}`;
      db.issues.push({
        id, category: "Security", subcategory: "Security", priority: "High", status: "Open",
        raised_by: NEIGHBOUR, raised_by_name: "Neighbour", flat: "B-101", assigned_to: "Unassigned",
        area: "Tower B", description, sla: null, created_at: now(), updated_at: now(),
      });
      broadcast("issues");
      return id;
    },
    vote(pollId, optionIdx) {
      db.poll_votes.push({ poll_id: pollId, user_id: NEIGHBOUR, option_idx: optionIdx });
      broadcast("poll_votes");
    },
  };
  return { db, neighbour };
}
