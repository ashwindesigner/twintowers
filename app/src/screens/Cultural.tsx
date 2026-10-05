import { useState } from "react";
import { useData, useStatusTheme, useStore } from "../lib/store";
import { initials } from "../lib/format";
import { ErrorText, InfoModal, ScreenHeader, useToast, type Styles } from "../components/shared";
import type { CommunityEvent } from "../lib/types";
import type { NavProps } from "./nav";

const eventEmoji = (c: string) =>
  c === "Festival" ? "🎊" : c === "Sports" ? "🏅" : c === "National" ? "🇮🇳" : "📅";

const monthShort = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleString("en-IN", { month: "short" }).toUpperCase();
const dayNum = (iso: string) => Number(iso.slice(8, 10));

export default function ScreenCultural({ goBack }: NavProps) {
  const { events, proposals, albums } = useData();
  const toast = useToast();
  const [tab, setTab] = useState<"events" | "proposals" | "gallery">("events");
  const [showInfo, setShowInfo] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = events.find((e) => e.id === selectedId);
  useStatusTheme(selected ? "dark" : "light", selected ? "#1B2D5B" : undefined); // detail view has a navy hero
  if (selected) return <EventDetail ev={selected} onBack={() => setSelectedId(null)} />;

  const tabItems = [["events", "Events"], ["proposals", "Proposals"], ["gallery", "Gallery"]] as const;

  return (
    <div style={cx.root}>
      <ScreenHeader title="Cultural" onBack={goBack} onInfo={() => setShowInfo(true)} />
      <div style={cx.tabBar} role="tablist">
        {tabItems.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id}
            style={{ ...cx.tab, ...(tab === id ? cx.tabActive : {}) }}
            onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {tab === "events" && (
          <div style={cx.scroll}>
            {events.map((ev) => (
              <div key={ev.id} className="tap" style={cx.eventCard} onClick={() => setSelectedId(ev.id)}>
                <div style={cx.evDateBox}>
                  <div style={cx.evMonth}>{monthShort(ev.date)}</div>
                  <div style={cx.evDay}>{dayNum(ev.date)}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={cx.evName}>{ev.name}</div>
                  <div style={cx.evMeta}>⏰ {ev.time} · 📍 {ev.location.split(" ").slice(0, 2).join(" ")}</div>
                  <div style={cx.evFooter}>
                    <span style={cx.evOrg}>{ev.organizer.split(" ")[0]}</span>
                    <span style={{
                      ...cx.evStatus,
                      color: ev.status === "upcoming" ? "var(--success)" : "var(--warning)",
                      background: ev.status === "upcoming" ? "var(--success-bg)" : "var(--warning-bg)",
                    }}>{ev.status}</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ height: 16 }} />
          </div>
        )}
        {tab === "proposals" && (
          <div style={cx.scroll}>
            <div style={cx.propHeader}>
              <button className="tap" style={cx.propNewBtn} onClick={() => toast("Event proposals are coming soon")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Propose an Event
              </button>
            </div>
            {proposals.map((p) => {
              const sMap = {
                approved: ["var(--success)", "var(--success-bg)"],
                under_review: ["var(--warning)", "var(--warning-bg)"],
                pending: ["var(--info)", "var(--info-bg)"],
              } as const;
              const sLabel = { approved: "Approved", under_review: "Under Review", pending: "Pending" };
              const [fg, bg] = sMap[p.status] ?? ["var(--text-3)", "var(--surface-2)"];
              return (
                <div key={p.id} style={cx.propCard}>
                  <div style={cx.propTop}>
                    <div style={cx.propName}>{p.name}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: fg, background: bg, borderRadius: 99, padding: "3px 9px", flexShrink: 0 }}>
                      {sLabel[p.status]}
                    </span>
                  </div>
                  <div style={cx.propDesc}>{p.description}</div>
                  <div style={cx.propMeta}>
                    {p.budget != null && <span>💰 ₹{p.budget.toLocaleString("en-IN")}</span>}
                    {p.proposedDate && <span>📅 {p.proposedDate}</span>}
                    <span>By {p.proposedBy.split(" ")[0]}</span>
                  </div>
                  <div style={cx.propVotes}>
                    <span style={{ color: "var(--success)", fontWeight: 700, fontSize: 13 }}>👍 {p.votes.yes}</span>
                    <span style={{ color: "var(--danger)", fontWeight: 700, fontSize: 13 }}>👎 {p.votes.no}</span>
                  </div>
                </div>
              );
            })}
            <div style={{ height: 16 }} />
          </div>
        )}
        {tab === "gallery" && (
          <div style={cx.scroll}>
            <div style={cx.galleryGrid}>
              {albums.map((a) => (
                <div key={a.name} className="tap" style={cx.albumCard}>
                  <div style={{
                    ...cx.albumThumb,
                    background: `linear-gradient(135deg, oklch(0.5 0.15 ${a.hue}) 0%, oklch(0.38 0.12 ${a.hue + 50}) 100%)`,
                  }}>
                    <span style={{ fontSize: 32 }}>{a.emoji}</span>
                  </div>
                  <div style={cx.albumInfo}>
                    <div style={cx.albumName}>{a.name}</div>
                    <div style={cx.albumMeta}>{a.photoCount} photos · {a.dateLabel}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height: 16 }} />
          </div>
        )}
      </div>
      {showInfo && <InfoModal title="Cultural Activities" onClose={() => setShowInfo(false)} lines={[
        "Community events, festivals, and celebration gallery.",
        "Managed by Anitha Reddy — Cultural Committee Head.",
        "Events published once confirmed; gallery updated post-event.",
        "Register interest for events or propose new ones.",
      ]} />}
    </div>
  );
}

function EventDetail({ ev, onBack }: { ev: CommunityEvent; onBack: () => void }) {
  const { toggleEventRegistration } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pct = Math.min(100, Math.round((ev.registered / ev.capacity) * 100));
  const full = ev.registered >= ev.capacity && !ev.registeredByMe;

  const toggle = async () => {
    setBusy(true);
    setError(null);
    try {
      await toggleEventRegistration(ev.id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={cx.root}>
      <div style={cx.scroll}>
        <div style={cx.eventHero}>
          <div style={cx.heroBg} />
          <div style={cx.heroBack}>
            <ScreenHeader title="" onBack={onBack} transparent />
          </div>
          <div style={cx.heroEmoji}>{eventEmoji(ev.category)}</div>
          <span style={cx.heroCat}>{ev.category}</span>
          <div style={cx.heroTitle}>{ev.name}</div>
          <div style={cx.heroDate}>{ev.date} · {ev.time}</div>
          <div style={cx.heroLoc}>📍 {ev.location}</div>
        </div>
        <div style={cx.detailBody}>
          <div style={cx.detailDesc}>{ev.description}</div>
          <div style={cx.regSection}>
            <div style={cx.regRow}>
              <span style={cx.regLabel}>{ev.registered} registered</span>
              <span style={cx.regCap}>of {ev.capacity}</span>
            </div>
            <div style={cx.regBarBg}>
              <div style={{ ...cx.regBarFill, width: `${pct}%` }} />
            </div>
          </div>
          <div style={cx.orgRow}>
            <div style={cx.orgAvatar}>{initials(ev.organizer)}</div>
            <div>
              <div style={cx.orgName}>{ev.organizer}</div>
              <div style={cx.orgRole}>Cultural Committee</div>
            </div>
          </div>
          <button className="tap"
            style={{ ...cx.regBtn, ...(ev.registeredByMe ? cx.regBtnDone : {}), opacity: full || busy ? 0.6 : 1 }}
            onClick={toggle} disabled={busy || full}
            aria-pressed={ev.registeredByMe}>
            {ev.registeredByMe ? "✅  Registered · Tap to withdraw" : full ? "Event full" : "Register Interest"}
          </button>
          {error && <ErrorText>{error}</ErrorText>}
        </div>
      </div>
    </div>
  );
}

const cx: Styles = {
  root: { height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" },
  tabBar: { display: "flex", background: "var(--surface)", borderBottom: "1px solid var(--border)", flexShrink: 0 },
  tab: {
    flex: 1, padding: "13px 4px", fontSize: 12, fontWeight: 700, border: "none", background: "none", cursor: "pointer",
    color: "var(--text-3)", borderBottom: "2px solid transparent", transition: "all 0.15s",
  },
  tabActive: { color: "var(--navy)", borderBottom: "2px solid var(--navy)" },
  scroll: { flex: 1, overflowY: "auto" },
  eventCard: {
    display: "flex", gap: 14, background: "var(--surface)", margin: "8px 16px 0", borderRadius: "var(--r-lg)",
    padding: "14px", cursor: "pointer", boxShadow: "var(--sh-xs)", alignItems: "flex-start",
  },
  evDateBox: { background: "var(--navy)", borderRadius: 12, padding: "8px 10px", textAlign: "center", minWidth: 46, flexShrink: 0 },
  evMonth: { fontSize: 9, fontWeight: 800, color: "var(--gold)", letterSpacing: 1 },
  evDay: { fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.1 },
  evName: { fontSize: 14, fontWeight: 800, color: "var(--text-1)", marginBottom: 5, letterSpacing: -0.2 },
  evMeta: { fontSize: 11, color: "var(--text-3)", marginBottom: 6 },
  evFooter: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  evOrg: { fontSize: 11, color: "var(--text-2)", fontWeight: 600 },
  evStatus: { fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "2px 9px" },
  eventHero: {
    background: "var(--navy)", padding: "0 24px 28px", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 8, position: "relative", flexShrink: 0, overflow: "hidden",
  },
  heroBack: { alignSelf: "stretch", margin: "0 -24px", position: "relative", zIndex: 1 },
  heroBg: {
    position: "absolute", width: 250, height: 250, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 65%)",
    top: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none",
  },
  heroEmoji: { fontSize: 60, position: "relative" },
  heroCat: {
    fontSize: 10, fontWeight: 800, color: "var(--gold)", letterSpacing: 2,
    background: "rgba(201,168,76,0.15)", borderRadius: 99, padding: "3px 12px", position: "relative",
  },
  heroTitle: { fontSize: 22, fontWeight: 800, color: "#fff", textAlign: "center", letterSpacing: -0.4, position: "relative" },
  heroDate: { fontSize: 13, color: "rgba(255,255,255,0.6)", position: "relative" },
  heroLoc: { fontSize: 13, color: "rgba(255,255,255,0.5)", position: "relative" },
  detailBody: { padding: "20px 16px" },
  detailDesc: {
    fontSize: 14, color: "var(--text-2)", lineHeight: 1.65, background: "var(--surface)",
    borderRadius: "var(--r-md)", padding: 16, marginBottom: 16, boxShadow: "var(--sh-xs)",
  },
  regSection: { marginBottom: 16 },
  regRow: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  regLabel: { fontSize: 13, fontWeight: 700, color: "var(--text-1)" },
  regCap: { fontSize: 12, color: "var(--text-3)" },
  regBarBg: { height: 6, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" },
  regBarFill: { height: "100%", background: "var(--gold)", borderRadius: 99, transition: "width 0.5s" },
  orgRow: {
    display: "flex", gap: 12, alignItems: "center", background: "var(--surface)",
    borderRadius: "var(--r-md)", padding: 14, marginBottom: 16, boxShadow: "var(--sh-xs)",
  },
  orgAvatar: {
    width: 40, height: 40, borderRadius: 12, background: "var(--navy)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0,
  },
  orgName: { fontSize: 13, fontWeight: 800, color: "var(--text-1)" },
  orgRole: { fontSize: 11, color: "var(--text-3)", marginTop: 2 },
  regBtn: {
    width: "100%", background: "var(--gold)", color: "#fff", border: "none", borderRadius: "var(--r-md)",
    padding: "16px", fontSize: 15, fontWeight: 800, cursor: "pointer",
    boxShadow: "0 4px 20px rgba(201,168,76,0.3)", letterSpacing: -0.2, transition: "all 0.2s",
  },
  regBtnDone: { background: "var(--success-bg)", color: "var(--success)", boxShadow: "none" },
  propHeader: { padding: "12px 16px 4px" },
  propNewBtn: {
    background: "var(--navy)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 18px",
    fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center",
  },
  propCard: { background: "var(--surface)", margin: "8px 16px 0", borderRadius: "var(--r-lg)", padding: 16, boxShadow: "var(--sh-xs)" },
  propTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 },
  propName: { fontSize: 14, fontWeight: 800, color: "var(--text-1)", flex: 1, letterSpacing: -0.2 },
  propDesc: { fontSize: 12, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 10 },
  propMeta: { display: "flex", flexWrap: "wrap", gap: 10, fontSize: 11, color: "var(--text-3)", marginBottom: 8 },
  propVotes: { display: "flex", gap: 16 },
  galleryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "12px 16px" },
  albumCard: { borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--sh-sm)", cursor: "pointer" },
  albumThumb: { height: 100, display: "flex", alignItems: "center", justifyContent: "center" },
  albumInfo: { background: "var(--surface)", padding: "10px 12px" },
  albumName: { fontSize: 12, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.1 },
  albumMeta: { fontSize: 10, color: "var(--text-3)", marginTop: 2 },
};
