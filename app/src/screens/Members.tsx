import { useState } from "react";
import { useData, useStatusTheme } from "../lib/store";
import { InfoModal, InfoRow, ScreenHeader, type Styles } from "../components/shared";
import type { CoreMember } from "../lib/types";
import type { NavProps } from "./nav";

const TEAM_COLORS: Record<string, string> = {
  Administration: "#1B3A6B", Finance: "#1a5c3a",
  "Tower A Maintenance": "#6b3a1a", "Tower B Maintenance": "#3a1a6b",
  Cultural: "#b5451b", "Common Areas": "#1a4a5c", Security: "#4a1a1a",
};
const teamColor = (team: string) => TEAM_COLORS[team] ?? "#1B2D5B";

export default function ScreenMembers({ goBack }: NavProps) {
  const { coreMembers } = useData();
  const [selected, setSelected] = useState<CoreMember | null>(null);
  const [filterTeam, setFilterTeam] = useState("All");
  const [showInfo, setShowInfo] = useState(false);
  // The profile view's hero is the member's team colour
  useStatusTheme(selected ? "dark" : "light", selected ? teamColor(selected.team) : undefined);

  const teams = ["All", ...Array.from(new Set(coreMembers.map((m) => m.team)))];
  const filtered = filterTeam === "All" ? coreMembers : coreMembers.filter((m) => m.team === filterTeam);

  if (selected) return <MemberDetail m={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={mm.root}>
      <ScreenHeader title="Core Members" onBack={goBack} onInfo={() => setShowInfo(true)} />
      <div style={mm.teamFilter}>
        {teams.map((t) => (
          <button key={t} style={{ ...mm.filterChip, ...(filterTeam === t ? mm.filterChipActive : {}) }}
            onClick={() => setFilterTeam(t)}>{t}</button>
        ))}
      </div>
      <div style={mm.scroll}>
        {filtered.map((m) => {
          const color = teamColor(m.team);
          return (
            <div key={m.id} className="tap" style={mm.memberCard} onClick={() => setSelected(m)}>
              <div style={{ ...mm.memberAvatar, background: color }}>{m.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={mm.memberName}>{m.name}</div>
                <div style={mm.memberRole}>{m.role}</div>
                <span style={{ ...mm.teamChip, color, background: color + "18" }}>{m.team}</span>
              </div>
              <div style={mm.memberRight}>
                <div style={mm.memberFlat}>{m.flat}</div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="var(--text-3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          );
        })}
        <div style={{ height: 20 }} />
      </div>
      {showInfo && <InfoModal title="Core Members" onClose={() => setShowInfo(false)} lines={[
        "Directory of all RWA committee and task team members.",
        "Updated after each AGM or mid-term election.",
        "Tap any member to call, WhatsApp or email directly.",
        "Committee members are elected by resident polls.",
      ]} />}
    </div>
  );
}

function MemberDetail({ m, onBack }: { m: CoreMember; onBack: () => void }) {
  const color = teamColor(m.team);
  return (
    <div style={mm.root}>
      <div style={mm.scroll}>
        <div style={{ ...mm.profileHero, background: color }}>
          <div style={mm.heroBg} />
          <div style={mm.heroBack}>
            <ScreenHeader title="" onBack={onBack} transparent />
          </div>
          <div style={mm.profileAvatar}>{m.avatar}</div>
          <div style={mm.profileName}>{m.name}</div>
          <div style={mm.profileRole}>{m.role}</div>
          <span style={mm.teamTag}>{m.team}</span>
        </div>

        <div style={mm.contactRow}>
          <a href={`tel:+91${m.phone}`} className="tap" style={{ ...mm.contactBtn, background: "var(--navy)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.93 6.93l1.13-1.14a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Call
          </a>
          <a href={`https://wa.me/91${m.phone}`} target="_blank" rel="noopener noreferrer" className="tap"
            style={{ ...mm.contactBtn, background: "#25D366" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
          <a href={`mailto:${m.email}`} className="tap" style={{ ...mm.contactBtn, background: "var(--gold)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="22,6 12,13 2,6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Email
          </a>
        </div>

        <InfoRow label="Flat & Tower" value={`${m.flat} · ${m.tower}`} />
        <InfoRow label="Email" value={m.email} />
        <InfoRow label="Mobile" value={`+91 ${m.phone}`} />

        <div style={mm.sectionLabel}>Responsibilities</div>
        {m.responsibilities.map((r, i) => (
          <div key={i} style={mm.respCard}>
            <div style={{ ...mm.respDot, background: color }} />
            <div style={mm.respText}>{r}</div>
          </div>
        ))}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

const mm: Styles = {
  root: { height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" },
  teamFilter: {
    display: "flex", gap: 6, padding: "10px 16px 8px", overflowX: "auto", flexShrink: 0,
    background: "var(--surface)", borderBottom: "1px solid var(--border)",
  },
  filterChip: {
    flexShrink: 0, fontSize: 11, fontWeight: 700, border: "none", borderRadius: 99, padding: "6px 14px",
    background: "var(--surface-2)", color: "var(--text-2)", cursor: "pointer", transition: "all 0.15s",
  },
  filterChipActive: { background: "var(--navy)", color: "#fff" },
  scroll: { flex: 1, overflowY: "auto", padding: "10px 0" },
  memberCard: {
    display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", margin: "0 16px 8px",
    borderRadius: "var(--r-lg)", padding: "13px", cursor: "pointer", boxShadow: "var(--sh-xs)",
  },
  memberAvatar: {
    width: 46, height: 46, borderRadius: 14, color: "#fff", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0,
  },
  memberName: { fontSize: 14, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.2, marginBottom: 2 },
  memberRole: { fontSize: 11, color: "var(--text-2)", marginBottom: 5 },
  teamChip: { fontSize: 9, fontWeight: 800, borderRadius: 99, padding: "2px 8px", letterSpacing: 0.2 },
  memberRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },
  memberFlat: { fontSize: 11, fontWeight: 700, color: "var(--text-3)" },
  profileHero: {
    padding: "0 24px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    position: "relative", overflow: "hidden", flexShrink: 0, marginTop: -10,
  },
  heroBack: { alignSelf: "stretch", margin: "0 -24px", position: "relative", zIndex: 1 },
  heroBg: {
    position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 280, height: 280,
    borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 65%)", pointerEvents: "none",
  },
  profileAvatar: {
    width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.15)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800,
    border: "2px solid rgba(255,255,255,0.2)", position: "relative",
  },
  profileName: { fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.4, position: "relative" },
  profileRole: { fontSize: 13, color: "rgba(255,255,255,0.65)", position: "relative" },
  teamTag: {
    fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.15)",
    borderRadius: 99, padding: "4px 14px", border: "1px solid rgba(255,255,255,0.2)", position: "relative",
  },
  contactRow: { display: "flex", gap: 10, padding: "16px 16px 8px" },
  contactBtn: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, borderRadius: "var(--r-md)",
    padding: "13px 8px", color: "#fff", textDecoration: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
  },
  sectionLabel: { fontSize: 11, fontWeight: 800, color: "var(--text-3)", letterSpacing: 0.5, padding: "8px 16px", textTransform: "uppercase" },
  respCard: {
    display: "flex", gap: 12, alignItems: "flex-start", background: "var(--surface)", margin: "0 16px 8px",
    borderRadius: "var(--r-md)", padding: "12px 14px", boxShadow: "var(--sh-xs)",
  },
  respDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 4 },
  respText: { fontSize: 13, color: "var(--text-1)", lineHeight: 1.5, flex: 1 },
};
