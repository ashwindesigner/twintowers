import { useState } from "react";
import { useData, useStatusTheme, useStore } from "../lib/store";
import { greeting, initials, isoDate } from "../lib/format";
import { PriorityChip, TwinTowersLogo, statusColor, type Styles } from "../components/shared";
import type { NavProps, ScreenId } from "./nav";

export default function ScreenDashboard({ navigate }: NavProps) {
  const { profile, signOut } = useStore();
  const { issues, events, polls, myBookings, notifications, maintenanceItems, facilities, policies, coreMembers } = useData();
  const [menuOpen, setMenuOpen] = useState(false);
  useStatusTheme("dark");

  const name = profile?.name ?? "Resident";
  const pendingIssues = issues.filter(
    (i) => i.raisedById === profile?.id && i.status !== "Resolved" && i.status !== "Closed"
  );
  const activePolls = polls.filter((p) => p.status === "active");
  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const today = isoDate();
  const nextEvent = upcomingEvents.find((e) => e.date >= today) ?? upcomingEvents[0];
  const unread = notifications.filter((n) => !n.read).length;
  const openIssues = issues.filter((i) => i.status === "Open" || i.status === "In Progress");

  const categories: { id: ScreenId; emoji: string; label: string; sub: string; badge?: number }[] = [
    { id: "maintenance", emoji: "🔧", label: "Maintenance", sub: `${maintenanceItems.length} tracked` },
    { id: "cultural", emoji: "🎊", label: "Events", sub: `${upcomingEvents.length} upcoming` },
    { id: "issues", emoji: "📋", label: "Issues", sub: `${openIssues.length} open`, badge: openIssues.length },
    { id: "booking", emoji: "🏸", label: "Book", sub: `${facilities.length} facilities` },
    { id: "policies", emoji: "📜", label: "Policies", sub: `${policies.length} categories` },
    { id: "polls", emoji: "🗳️", label: "Polls", sub: `${activePolls.length} active`, badge: activePolls.length },
  ];

  // Same four faces as the design (President, Secretary, Treasurer, Cultural head)
  const faces = ["SN", "PV", "RI", "AR"].filter((a) => coreMembers.some((m) => m.avatar === a));
  const stack = faces.length === 4 ? faces : coreMembers.slice(0, 4).map((m) => m.avatar);

  return (
    <div style={d.root}>
      {/* Header — community logo visible here */}
      <div style={d.header}>
        <div style={d.headerInner}>
          <div style={d.headerLeft}>
            <div style={d.logoMark}><TwinTowersLogo size={22} /></div>
            <div>
              <div style={d.headerTitle}>Twin Towers</div>
              <div style={d.headerSub}>by Namishree</div>
            </div>
          </div>
          <div style={d.headerIcons}>
            <button style={d.headerIcon} onClick={() => navigate("notifications")} aria-label={`Notifications, ${unread} unread`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {unread > 0 && <span style={d.notifDot}>{unread}</span>}
            </button>
            <div style={{ position: "relative" }}>
              <button style={d.avatar} onClick={() => setMenuOpen((o) => !o)} aria-label="Account">
                {initials(name)}
              </button>
              {menuOpen && (
                <div style={d.menu}>
                  <div style={d.menuName}>{name}</div>
                  <div style={d.menuSub}>{profile?.flat} · {profile?.tower}</div>
                  <button style={d.menuBtn} onClick={signOut}>Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Welcome */}
        <div style={d.welcome}>
          <div style={d.welcomeGreet}>{greeting()}, {name.split(" ")[0]} 👋</div>
          <div style={d.welcomeFlat}>{profile?.flat} · {profile?.tower}</div>
        </div>

        {/* Summary pills */}
        <div style={d.pillRow}>
          <div style={d.pill} onClick={() => navigate("issues")}>
            <span style={{ ...d.pillDot, background: "#EF4444" }} />
            <span style={d.pillNum}>{pendingIssues.length}</span>
            <span style={d.pillLabel}>My Issues</span>
          </div>
          <div style={d.pillDivider} />
          <div style={d.pill} onClick={() => navigate("polls")}>
            <span style={{ ...d.pillDot, background: "var(--gold)" }} />
            <span style={d.pillNum}>{activePolls.length}</span>
            <span style={d.pillLabel}>Active Polls</span>
          </div>
          <div style={d.pillDivider} />
          <div style={d.pill} onClick={() => navigate("booking")}>
            <span style={{ ...d.pillDot, background: "#10B981" }} />
            <span style={d.pillNum}>{myBookings.length}</span>
            <span style={d.pillLabel}>Bookings</span>
          </div>
        </div>
      </div>

      <div style={d.scroll}>
        {/* Next event card */}
        {nextEvent && (
          <div className="tap" style={d.eventCard} onClick={() => navigate("cultural")}>
            <div style={d.eventCardBg} />
            <div style={d.eventCardInner}>
              <div style={d.eventLabel}>UPCOMING EVENT</div>
              <div style={d.eventName}>{nextEvent.name}</div>
              <div style={d.eventMeta}>
                <span>📅 {nextEvent.date}</span>
                <span style={d.eventMetaDot} />
                <span>📍 {nextEvent.location.split(" ").slice(0, 2).join(" ")}</span>
              </div>
              <div style={d.eventRegistered}>{nextEvent.registered} residents registered</div>
            </div>
            <div style={d.eventArrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}

        {/* Category grid */}
        <div style={d.sectionHeader}>
          <div style={d.sectionTitle}>Community Services</div>
        </div>
        <div style={d.grid}>
          {categories.map((cat) => (
            <div key={cat.id} className="tap" style={d.catCard} onClick={() => navigate(cat.id)}>
              {!!cat.badge && <span style={d.catBadge}>{cat.badge}</span>}
              <div style={d.catEmoji}>{cat.emoji}</div>
              <div style={d.catLabel}>{cat.label}</div>
              <div style={d.catSub}>{cat.sub}</div>
            </div>
          ))}
        </div>

        {/* Members quick access */}
        <div className="tap" style={d.membersCard} onClick={() => navigate("members")}>
          <div style={d.membersLeft}>
            <div style={d.membersAvatars}>
              {stack.map((a, i) => (
                <div key={a} style={{ ...d.memberAvatar, left: i * 22, zIndex: 4 - i }}>{a}</div>
              ))}
            </div>
            <div>
              <div style={d.membersTitle}>Core Committee</div>
              <div style={d.membersSub}>{coreMembers.length} members · Tap to contact</div>
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="var(--text-2)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Recent issues */}
        <div style={d.sectionHeader}>
          <div style={d.sectionTitle}>Recent Issues</div>
          <button style={d.seeAll} onClick={() => navigate("issues")}>See all</button>
        </div>
        {issues.slice(0, 3).map((issue) => (
          <div key={issue.id} className="tap" style={d.issueRow} onClick={() => navigate("issues")}>
            <div style={{ ...d.issueAccent, background: statusColor(issue.status) }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={d.issueTitle} title={issue.description}>
                {issue.subcategory} — {issue.area}
              </div>
              <div style={d.issueMeta}>{issue.id} · {issue.created.split(" ")[0]}</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
              <PriorityChip priority={issue.priority} />
            </div>
          </div>
        ))}

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

const d: Styles = {
  root: { height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" },
  header: { background: "var(--navy)", paddingBottom: 20, flexShrink: 0, borderRadius: "0 0 28px 28px" },
  headerInner: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px 0" },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: {
    width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid rgba(201,168,76,0.3)",
  },
  headerTitle: { fontSize: 15, fontWeight: 800, color: "var(--gold)", letterSpacing: 0.5 },
  headerSub: { fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: 0.8 },
  headerIcons: { display: "flex", alignItems: "center", gap: 10 },
  headerIcon: {
    width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "none",
    color: "rgba(255,255,255,0.9)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
  },
  notifDot: {
    position: "absolute", top: 6, right: 6, width: 16, height: 16, borderRadius: "50%",
    background: "var(--gold)", color: "var(--navy)", fontSize: 9, fontWeight: 800,
    display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--navy)",
  },
  avatar: {
    width: 38, height: 38, borderRadius: 12, background: "var(--gold)", color: "var(--navy)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 800, cursor: "pointer", border: "none",
  },
  menu: {
    position: "absolute", top: 46, right: 0, zIndex: 20, width: 180,
    background: "var(--surface)", borderRadius: "var(--r-md)", padding: "12px",
    boxShadow: "var(--sh-lg)", animation: "scaleIn 0.15s both", transformOrigin: "top right",
  },
  menuName: { fontSize: 13, fontWeight: 800, color: "var(--text-1)" },
  menuSub: { fontSize: 11, color: "var(--text-3)", marginTop: 2, marginBottom: 10 },
  menuBtn: {
    width: "100%", background: "var(--danger-bg)", color: "var(--danger)", border: "none",
    borderRadius: "var(--r-sm)", padding: "9px", fontSize: 12, fontWeight: 700,
  },
  welcome: { padding: "20px 20px 0" },
  welcomeGreet: { fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.4 },
  welcomeFlat: { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 3 },
  pillRow: {
    display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)",
    borderRadius: 16, margin: "16px 20px 0", padding: "12px 0",
  },
  pill: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" },
  pillDot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  pillNum: { fontSize: 17, fontWeight: 800, color: "#fff" },
  pillLabel: { fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.55)" },
  pillDivider: { width: 1, height: 24, background: "rgba(255,255,255,0.12)" },
  scroll: { flex: 1, overflowY: "auto", padding: "20px 16px 0" },
  eventCard: {
    borderRadius: "var(--r-xl)", overflow: "hidden", marginBottom: 20,
    background: "linear-gradient(135deg, #1B3A6B 0%, #0d1e40 100%)",
    position: "relative", padding: "20px", cursor: "pointer",
    boxShadow: "var(--sh-md)", border: "1px solid rgba(201,168,76,0.2)",
  },
  eventCardBg: {
    position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)", pointerEvents: "none",
  },
  eventCardInner: { position: "relative" },
  eventLabel: { fontSize: 9, fontWeight: 800, color: "var(--gold)", letterSpacing: 1.5, marginBottom: 6 },
  eventName: { fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: -0.3, marginBottom: 8, paddingRight: 40 },
  eventMeta: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.6)" },
  eventMetaDot: { width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.3)" },
  eventRegistered: { fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 6 },
  eventArrow: {
    position: "absolute", bottom: 20, right: 20, width: 36, height: 36, borderRadius: 10,
    background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
  },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: 800, color: "var(--text-2)", letterSpacing: 0.3 },
  seeAll: { background: "none", border: "none", color: "var(--gold)", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 },
  catCard: {
    background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "16px 12px 14px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer",
    boxShadow: "var(--sh-sm)", position: "relative",
  },
  catBadge: {
    position: "absolute", top: 8, right: 8, background: "var(--danger)", color: "#fff",
    fontSize: 9, fontWeight: 800, borderRadius: 99, width: 18, height: 18,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  catEmoji: { fontSize: 26 },
  catLabel: { fontSize: 12, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.1 },
  catSub: { fontSize: 10, color: "var(--text-3)", fontWeight: 500, textAlign: "center" },
  membersCard: {
    background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "14px 16px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 20, cursor: "pointer", boxShadow: "var(--sh-sm)",
  },
  membersLeft: { display: "flex", alignItems: "center", gap: 14 },
  membersAvatars: { position: "relative", width: 88, height: 36 },
  memberAvatar: {
    position: "absolute", width: 34, height: 34, borderRadius: 10, background: "var(--navy)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800,
    border: "2px solid var(--surface)", top: 0,
  },
  membersTitle: { fontSize: 13, fontWeight: 800, color: "var(--text-1)" },
  membersSub: { fontSize: 11, color: "var(--text-3)", marginTop: 2 },
  issueRow: {
    display: "flex", alignItems: "center", gap: 12, background: "var(--surface)",
    borderRadius: "var(--r-md)", padding: "13px 14px", marginBottom: 8, cursor: "pointer",
    boxShadow: "var(--sh-xs)", overflow: "hidden",
  },
  issueAccent: { width: 3, height: 36, borderRadius: 99, flexShrink: 0 },
  issueTitle: { fontSize: 13, fontWeight: 700, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  issueMeta: { fontSize: 11, color: "var(--text-3)", marginTop: 2 },
};
