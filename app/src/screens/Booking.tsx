import { useEffect, useMemo, useState } from "react";
import { useData, useStatusTheme, useStore } from "../lib/store";
import { addDays, isoDate } from "../lib/format";
import { fetchTakenSlots, SlotTakenError } from "../lib/api";
import { ErrorText, InfoModal, ScreenHeader, Spinner, type Styles } from "../components/shared";
import type { Booking, Facility } from "../lib/types";
import type { NavProps } from "./nav";

const SLOTS = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
const FACILITY_COLORS = ["#1B3A6B", "#1a5c3a", "#6b3a1a", "#3a1a6b", "#1a4a5c"];

/** Slots are 1-hour blocks. */
const slotEnd = (start: string) => `${String(Number(start.slice(0, 2)) + 1).padStart(2, "0")}:00`;

export default function ScreenBooking({ goBack }: NavProps) {
  const { facilities, myBookings } = useData();
  const { bookSlot, liveVersion } = useStore();
  const today = isoDate();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [selDate, setSelDate] = useState(today);
  const [selSlot, setSelSlot] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [taken, setTaken] = useState<Set<string> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useStatusTheme("light");

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const ds = addDays(today, i);
    const dt = new Date(ds + "T00:00:00");
    return { ds, day: dt.toLocaleString("en-IN", { weekday: "short" }), dd: dt.getDate() };
  }), [today]);

  const loadTaken = (f: Facility, background = false) => {
    if (!background) setTaken(null);
    fetchTakenSlots(f.id, days[0].ds, days[6].ds).then(setTaken, (e) => {
      if (background) return; // keep the current grid; the next update retries
      setError((e as Error).message);
      setTaken(new Set());
    });
  };

  useEffect(() => {
    if (facility) loadTaken(facility);
  }, [facility]); // eslint-disable-line react-hooks/exhaustive-deps -- reload only when the facility changes

  // A neighbour's booking arrives via live updates: refresh the grid quietly
  useEffect(() => {
    if (facility && liveVersion > 0) loadTaken(facility, true);
  }, [liveVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  // If the slot you were about to book was just taken, clear the selection
  useEffect(() => {
    if (selSlot && taken?.has(`${selDate} ${selSlot}`) && !confirmed) {
      setSelSlot(null);
      setError("That slot was just booked by someone else.");
    }
  }, [taken]); // eslint-disable-line react-hooks/exhaustive-deps

  const facilityIcon = (id: string) => facilities.find((f) => f.id === id)?.icon ?? "🏢";

  const now = new Date();
  const nowHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const isPast = (slot: string) => selDate === today && slot <= nowHHMM;
  const isBooked = (slot: string) => taken?.has(`${selDate} ${slot}`) ?? false;

  const confirm = async () => {
    if (!facility || !selSlot) return;
    setSubmitting(true);
    setError(null);
    try {
      const b = await bookSlot(facility, selDate, selSlot, slotEnd(selSlot));
      setConfirmed(b);
    } catch (e) {
      setError((e as Error).message);
      if (e instanceof SlotTakenError) {
        setSelSlot(null);
        loadTaken(facility);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div style={bx.root}>
        <div style={bx.successScreen}>
          <div style={{ ...bx.successRing, animation: "scaleIn 0.35s cubic-bezier(0.34,1.4,0.64,1) both" }}>
            <div style={bx.successCheck}>✓</div>
          </div>
          <div style={bx.successTitle}>Booking Confirmed!</div>
          <div style={bx.successCard}>
            <div style={bx.successFac}>{confirmed.facility}</div>
            <div style={bx.successDate}>{confirmed.date}</div>
            <div style={bx.successSlot}>{confirmed.startTime} – {confirmed.endTime}</div>
            <div style={bx.bookingId}>Booking ID: {confirmed.id}</div>
          </div>
          <button className="tap" style={bx.doneBtn}
            onClick={() => { setConfirmed(null); setFacility(null); setSelSlot(null); }}>
            Back to Facilities
          </button>
        </div>
      </div>
    );
  }

  if (facility) {
    return (
      <div style={bx.root}>
        <ScreenHeader title={facility.name} subtitle={facility.charges}
          onBack={() => { setFacility(null); setSelSlot(null); setError(null); }} />
        <div style={bx.scroll}>
          {/* Date selector */}
          <div style={bx.dateSection}>
            <div style={bx.sectionLabel}>Select Date</div>
            <div style={bx.dateRow}>
              {days.map(({ ds, day, dd }) => (
                <div key={ds} role="button" aria-pressed={selDate === ds}
                  style={{ ...bx.datePill, ...(selDate === ds ? bx.datePillActive : {}) }}
                  onClick={() => { setSelDate(ds); setSelSlot(null); setError(null); }}>
                  <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.65 }}>{day}</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{dd}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div style={bx.rulesCard}>
            {facility.rules.map((r, i) => (
              <div key={i} style={{ ...bx.ruleRow, ...(i === facility.rules.length - 1 ? { marginBottom: 0 } : {}) }}>
                <div style={bx.ruleDot} />
                <div style={bx.ruleText}>{r}</div>
              </div>
            ))}
          </div>

          {/* Slot grid */}
          <div style={bx.sectionLabel}>Available Slots</div>
          {taken === null ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 24 }}><Spinner /></div>
          ) : (
            <div style={bx.slotGrid}>
              {SLOTS.map((slot) => {
                const booked = isBooked(slot);
                const past = isPast(slot);
                const active = selSlot === slot;
                return (
                  <button key={slot} disabled={booked || past}
                    style={{ ...bx.slot, ...(booked || past ? bx.slotBooked : active ? bx.slotActive : bx.slotFree) }}
                    onClick={() => setSelSlot(active ? null : slot)}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{slot}</div>
                    {booked && <div style={{ fontSize: 9, marginTop: 1, opacity: 0.7 }}>Taken</div>}
                    {past && !booked && <div style={{ fontSize: 9, marginTop: 1, opacity: 0.7 }}>Past</div>}
                  </button>
                );
              })}
            </div>
          )}

          {error && <div style={{ margin: "12px 16px 0" }}><ErrorText>{error}</ErrorText></div>}

          {selSlot && (
            <div style={{ ...bx.confirmBar, animation: "fadeUp 0.2s both" }}>
              <div>
                <div style={bx.confirmLabel}>Booking Summary</div>
                <div style={bx.confirmTime}>{selDate} · {selSlot} – {slotEnd(selSlot)}</div>
              </div>
              <button className="tap" style={{ ...bx.confirmBtn, opacity: submitting ? 0.7 : 1 }}
                onClick={confirm} disabled={submitting}>
                {submitting ? "…" : "Confirm"}
              </button>
            </div>
          )}
          <div style={{ height: 120 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={bx.root}>
      <ScreenHeader title="Slot Booking" onBack={goBack} onInfo={() => setShowInfo(true)} />
      <div style={bx.scroll}>
        <div style={bx.sectionLabel}>Facilities</div>
        {facilities.map((f, i) => (
          <div key={f.id} className="tap" style={bx.facilityCard}
            onClick={() => { setFacility(f); setSelDate(today); setError(null); }}>
            <div style={{ ...bx.facilityThumb, background: FACILITY_COLORS[i % FACILITY_COLORS.length] }}>
              <span style={{ fontSize: 28 }}>{f.icon}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={bx.facilityName}>{f.name}</div>
              <div style={bx.facilityMeta}>Max {f.maxDuration} min · {f.charges}</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="var(--text-3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}

        {myBookings.length > 0 && <>
          <div style={bx.sectionLabel}>My Bookings</div>
          {myBookings.map((b) => (
            <div key={b.id} style={bx.myBookingCard}>
              <div style={bx.myBookingIcon}>{facilityIcon(b.facilityId)}</div>
              <div style={{ flex: 1 }}>
                <div style={bx.myBookingName}>{b.facility}</div>
                <div style={bx.myBookingTime}>{b.date} · {b.startTime}–{b.endTime}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--success)", background: "var(--success-bg)", borderRadius: 99, padding: "3px 9px" }}>
                Confirmed
              </span>
            </div>
          ))}
        </>}
        <div style={{ height: 24 }} />
      </div>
      {showInfo && <InfoModal title="Slot Booking" onClose={() => setShowInfo(false)} lines={[
        "Book community facilities up to 7 days in advance.",
        "Slots shown in 1-hour blocks; max duration varies by facility.",
        "Max 2 active bookings per flat at any time.",
        "Cancel at least 2 hours before to avoid penalties.",
        "Charges apply for Lawn Area and Banquet Hall.",
      ]} />}
    </div>
  );
}

const bx: Styles = {
  root: { height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" },
  scroll: { flex: 1, overflowY: "auto" },
  sectionLabel: { fontSize: 11, fontWeight: 800, color: "var(--text-3)", letterSpacing: 0.5, padding: "16px 16px 8px", textTransform: "uppercase" },
  facilityCard: {
    display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", margin: "0 16px 10px",
    borderRadius: "var(--r-lg)", overflow: "hidden", cursor: "pointer", boxShadow: "var(--sh-sm)", padding: "0 14px 0 0",
  },
  facilityThumb: { width: 72, height: 72, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  facilityName: { fontSize: 14, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.2 },
  facilityMeta: { fontSize: 11, color: "var(--text-3)", marginTop: 3 },
  myBookingCard: {
    display: "flex", alignItems: "center", gap: 12, background: "var(--surface)", margin: "0 16px 8px",
    borderRadius: "var(--r-md)", padding: "12px 14px", boxShadow: "var(--sh-xs)",
  },
  myBookingIcon: { fontSize: 22, flexShrink: 0 },
  myBookingName: { fontSize: 13, fontWeight: 700, color: "var(--text-1)" },
  myBookingTime: { fontSize: 11, color: "var(--text-3)", marginTop: 2 },
  dateSection: { padding: "0 0 4px" },
  dateRow: { display: "flex", gap: 8, padding: "0 16px 4px", overflowX: "auto" },
  datePill: {
    flexShrink: 0, width: 48, height: 60, borderRadius: "var(--r-md)", background: "var(--surface)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer",
    color: "var(--text-1)", boxShadow: "var(--sh-xs)", transition: "all 0.15s",
  },
  datePillActive: { background: "var(--navy)", color: "#fff" },
  rulesCard: { margin: "12px 16px", background: "var(--surface)", borderRadius: "var(--r-md)", padding: "14px", boxShadow: "var(--sh-xs)" },
  ruleRow: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 },
  ruleDot: { width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: 5 },
  ruleText: { fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 },
  slotGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, padding: "0 16px" },
  slot: { borderRadius: "var(--r-md)", padding: "11px 4px", textAlign: "center", cursor: "pointer", transition: "all 0.15s", border: "none" },
  slotFree: { background: "var(--surface)", color: "var(--text-1)", boxShadow: "var(--sh-xs)" },
  slotBooked: { background: "var(--surface-2)", color: "var(--text-3)", cursor: "not-allowed" },
  slotActive: { background: "var(--gold)", color: "#fff", boxShadow: "0 4px 12px rgba(201,168,76,0.4)" },
  confirmBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--navy)",
    margin: "16px 16px 0", borderRadius: "var(--r-lg)", padding: "16px 18px", boxShadow: "var(--sh-md)",
  },
  confirmLabel: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: 0.5, marginBottom: 4 },
  confirmTime: { fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: -0.2 },
  confirmBtn: {
    background: "var(--gold)", color: "#fff", border: "none", borderRadius: "var(--r-md)", padding: "12px 20px",
    fontSize: 13, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 16px rgba(201,168,76,0.4)",
  },
  successScreen: {
    height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: 28, background: "var(--bg)", gap: 20,
  },
  successRing: {
    width: 90, height: 90, borderRadius: "50%", background: "var(--success-bg)",
    display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 8px rgba(16,185,129,0.1)",
  },
  successCheck: { fontSize: 40, color: "var(--success)" },
  successTitle: { fontSize: 24, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.4 },
  successCard: {
    background: "var(--surface)", borderRadius: "var(--r-xl)", padding: "20px 24px", width: "100%",
    textAlign: "center", boxShadow: "var(--sh-sm)",
  },
  successFac: { fontSize: 16, fontWeight: 800, color: "var(--navy)", marginBottom: 6 },
  successDate: { fontSize: 13, color: "var(--text-2)", marginBottom: 2 },
  successSlot: { fontSize: 22, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.4 },
  bookingId: {
    fontSize: 11, fontWeight: 700, color: "var(--gold)", background: "var(--gold-soft)", borderRadius: 99,
    padding: "5px 14px", marginTop: 12, display: "inline-block",
  },
  doneBtn: {
    background: "var(--navy)", color: "#fff", border: "none", borderRadius: "var(--r-md)", padding: "16px 40px",
    fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "var(--sh-md)",
  },
};
