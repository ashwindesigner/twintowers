import { supabase } from "./supabase";
import { addDays, dateTime, hhmm, isoDate } from "./format";
import type {
  AppNotification, Booking, CommunityData, Issue, IssueComment, Priority, Profile, Tower,
} from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

/** Unwraps a Supabase response, throwing its error. Callers cast to the row shape they selected. */
function must<T = any>(res: { data: unknown; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

// ── Profile ────────────────────────────────────────────────
export async function fetchProfile(userId: string): Promise<Profile> {
  return must(await supabase.from("profiles").select("*").eq("id", userId).single()) as Profile;
}

export async function updateProfile(
  userId: string,
  patch: { name: string; flat: string; tower: Tower }
): Promise<Profile> {
  return must(
    await supabase.from("profiles").update(patch).eq("id", userId).select("*").single()
  ) as Profile;
}

// ── Mappers ────────────────────────────────────────────────
const mapComment = (c: Row): IssueComment => ({
  by: c.author_name,
  time: dateTime(c.created_at),
  text: c.body,
});

const mapIssue = (i: Row): Issue => ({
  id: i.id,
  category: i.category,
  subcategory: i.subcategory,
  priority: i.priority,
  status: i.status,
  raisedById: i.raised_by,
  raisedBy: i.raised_by_name,
  flat: i.flat,
  assignedTo: i.assigned_to,
  area: i.area,
  created: dateTime(i.created_at),
  updated: dateTime(i.updated_at),
  description: i.description,
  sla: i.sla,
  comments: ((i.issue_comments ?? []) as Row[])
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map(mapComment),
});

const mapBooking = (b: Row, facilityNames: Map<string, string>): Booking => ({
  id: b.id,
  facilityId: b.facility_id,
  facility: facilityNames.get(b.facility_id) ?? b.facility_id,
  date: b.date,
  startTime: hhmm(b.start_time),
  endTime: hhmm(b.end_time),
  status: b.status,
});

// ── Load everything a resident sees ────────────────────────
// The community dataset is small (tens of rows per table), so the app loads
// it once after sign-in and keeps it in memory.
export async function fetchCommunity(): Promise<CommunityData> {
  const [
    members, maint, issues, events, eventCounts, myRegs, proposals, albums,
    facilities, bookings, policies, polls, pollResults, myVotes, notifs, reads,
  ] = await Promise.all([
    supabase.from("core_members").select("*").order("sort"),
    supabase.from("maintenance_items").select("*, maintenance_history(*)").order("sort"),
    supabase.from("issues").select("*, issue_comments(*)").order("created_at", { ascending: false }),
    supabase.from("events").select("*").order("date"),
    supabase.rpc("event_counts"),
    supabase.from("event_registrations").select("event_id"),
    supabase.from("proposals").select("*").order("id"),
    supabase.from("gallery_albums").select("*").order("sort"),
    supabase.from("facilities").select("*").order("sort"),
    supabase.from("bookings").select("*").neq("status", "cancelled").order("date").order("start_time"),
    supabase.from("community_policies").select("*").order("sort"),
    supabase.from("polls").select("*").order("start_date", { ascending: false }),
    supabase.rpc("poll_results"),
    supabase.from("poll_votes").select("poll_id, option_idx"),
    supabase.from("notifications").select("*").order("created_at", { ascending: false }),
    supabase.from("notification_reads").select("notification_id"),
  ]);

  const counts = new Map((must(eventCounts) as Row[]).map((r) => [r.event_id, r.registered]));
  const registered = new Set((must(myRegs) as Row[]).map((r) => r.event_id));
  const results = new Map((must(pollResults) as Row[]).map((r) => [r.poll_id, r.votes as number[]]));
  const votes = new Map((must(myVotes) as Row[]).map((r) => [r.poll_id, r.option_idx as number]));
  const readIds = new Set((must(reads) as Row[]).map((r) => r.notification_id));
  const facilityRows = must(facilities) as Row[];
  const facilityNames = new Map(facilityRows.map((f) => [f.id, f.name]));
  const today = isoDate();

  const notifications: AppNotification[] = (must(notifs) as Row[]).map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    time: dateTime(n.created_at),
    read: readIds.has(n.id),
  }));

  return {
    coreMembers: (must(members) as Row[]).map((m) => ({
      id: m.id, name: m.name, role: m.role, team: m.team, tower: m.tower, flat: m.flat,
      phone: m.phone, email: m.email, responsibilities: m.responsibilities, avatar: m.avatar,
    })),
    maintenanceItems: (must(maint) as Row[]).map((m) => ({
      id: m.id,
      category: m.category,
      subcategory: m.subcategory,
      name: m.name,
      status: m.status,
      lastInspected: m.last_inspected,
      nextCheck: m.next_check,
      assignedTo: m.assigned_to,
      warrantyExpiry: m.warranty_expiry,
      notes: m.notes,
      history: ((m.maintenance_history ?? []) as Row[])
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((h) => ({ date: h.date, status: h.status, note: h.note, inspector: h.inspector })),
    })),
    issues: (must(issues) as Row[]).map(mapIssue),
    events: (must(events) as Row[]).map((e) => ({
      id: e.id,
      name: e.name,
      date: e.date,
      time: e.time_label,
      location: e.location,
      organizer: e.organizer,
      description: e.description,
      registered: counts.get(e.id) ?? e.registered_base,
      capacity: e.capacity,
      status: e.status,
      category: e.category,
      registeredByMe: registered.has(e.id),
    })),
    proposals: (must(proposals) as Row[]).map((p) => ({
      id: p.id,
      name: p.name,
      proposedBy: p.proposed_by,
      flat: p.flat,
      description: p.description,
      budget: p.budget,
      proposedDate: p.proposed_date,
      status: p.status,
      approvedBy: p.approved_by,
      votes: { yes: p.votes_yes, no: p.votes_no },
    })),
    albums: (must(albums) as Row[]).map((a) => ({
      name: a.name, photoCount: a.photo_count, dateLabel: a.date_label, emoji: a.emoji, hue: a.hue,
    })),
    facilities: facilityRows.map((f) => ({
      id: f.id, name: f.name, icon: f.icon, slots: f.slots, maxDuration: f.max_duration,
      buffer: f.buffer, charges: f.charges, rules: f.rules,
    })),
    myBookings: (must(bookings) as Row[])
      .filter((b) => b.date >= today)
      .map((b) => mapBooking(b, facilityNames)),
    policies: (must(policies) as Row[]).map((p) => ({
      id: p.id, category: p.category, icon: p.icon, rules: p.rules,
    })),
    polls: (must(polls) as Row[]).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      startDate: p.start_date,
      endDate: p.end_date,
      eligibleVoters: p.eligible_voters,
      options: p.options,
      votes: results.get(p.id) ?? p.base_votes,
      totalEligible: p.total_eligible,
      status: p.status,
      userVoted: votes.get(p.id) ?? null,
    })),
    // Unread first so the "New" / "Earlier" grouping reads top-down
    notifications: [...notifications.filter((n) => !n.read), ...notifications.filter((n) => n.read)],
  };
}

// ── Issues ─────────────────────────────────────────────────
const SLA_DAYS: Record<Priority, number> = { High: 1, Medium: 3, Low: 5 };

export async function createIssue(
  profile: Profile,
  form: { category: string; area: string; priority: Priority; description: string }
): Promise<Issue> {
  const row = must(
    await supabase
      .from("issues")
      .insert({
        category: form.category,
        subcategory: form.category,
        priority: form.priority,
        area: form.area,
        description: form.description.trim(),
        raised_by: profile.id,
        raised_by_name: profile.name ?? "Resident",
        flat: profile.flat ?? "",
        sla: addDays(isoDate(), SLA_DAYS[form.priority]),
      })
      .select("*, issue_comments(*)")
      .single()
  );
  return mapIssue(row as Row);
}

export async function addComment(profile: Profile, issueId: string, text: string): Promise<IssueComment> {
  const row = must(
    await supabase
      .from("issue_comments")
      .insert({ issue_id: issueId, author_id: profile.id, author_name: profile.name ?? "Resident", body: text.trim() })
      .select("*")
      .single()
  );
  return mapComment(row as Row);
}

// ── Events ─────────────────────────────────────────────────
export async function setEventRegistration(userId: string, eventId: string, register: boolean) {
  if (register) {
    must(await supabase.from("event_registrations").insert({ event_id: eventId, user_id: userId }));
  } else {
    must(await supabase.from("event_registrations").delete().eq("event_id", eventId).eq("user_id", userId));
  }
}

// ── Bookings ───────────────────────────────────────────────
/** Keys of taken slots in the range, formatted "YYYY-MM-DD HH:mm". */
export async function fetchTakenSlots(facilityId: string, from: string, to: string): Promise<Set<string>> {
  const rows = must(
    await supabase.rpc("taken_slots", { p_facility_id: facilityId, p_from: from, p_to: to })
  ) as Row[];
  return new Set(rows.map((r) => `${r.date} ${hhmm(r.start_time)}`));
}

export class SlotTakenError extends Error {}

export async function bookSlot(
  profile: Profile,
  facility: { id: string; name: string },
  date: string,
  start: string,
  end: string
): Promise<Booking> {
  const res = await supabase
    .from("bookings")
    .insert({
      facility_id: facility.id,
      date,
      start_time: start,
      end_time: end,
      user_id: profile.id,
      booked_by: profile.name ?? "Resident",
      flat: profile.flat ?? "",
    })
    .select("*")
    .single();
  if (res.error?.code === "23505") throw new SlotTakenError("That slot was just booked by someone else.");
  return mapBooking(must(res) as Row, new Map([[facility.id, facility.name]]));
}

// ── Polls ──────────────────────────────────────────────────
export async function castVote(userId: string, pollId: string, optionIdx: number) {
  must(await supabase.from("poll_votes").insert({ poll_id: pollId, user_id: userId, option_idx: optionIdx }));
}

// ── Notifications ──────────────────────────────────────────
export async function markNotificationsRead(userId: string, ids: string[]) {
  if (ids.length === 0) return;
  must(
    await supabase
      .from("notification_reads")
      .upsert(ids.map((id) => ({ notification_id: id, user_id: userId })), { ignoreDuplicates: true })
  );
}
