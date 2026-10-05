import { useEffect, useState, type ReactNode } from "react";
import { StatusThemeContext, useStore, type StatusBarStyle } from "./lib/store";
import { clock } from "./lib/format";
import { ErrorText, Spinner, ToastProvider, TwinTowersLogo, type Styles } from "./components/shared";
import type { NavProps, ScreenId } from "./screens/nav";
import ScreenLogin from "./screens/Login";
import ScreenDashboard from "./screens/Dashboard";
import ScreenMaintenance from "./screens/Maintenance";
import ScreenIssues from "./screens/Issues";
import ScreenCultural from "./screens/Cultural";
import ScreenBooking from "./screens/Booking";
import ScreenPolicies from "./screens/Policies";
import ScreenPolls from "./screens/Polls";
import ScreenMembers from "./screens/Members";
import ScreenNotifications from "./screens/Notifications";

// ── Phone frame (desktop) / full-screen shell (phones) ─────
function PhoneFrame({ bar, children }: { bar: StatusBarStyle; children: ReactNode }) {
  const { theme, color } = bar;
  const [time, setTime] = useState(clock());
  useEffect(() => {
    const t = window.setInterval(() => setTime(clock()), 30000);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? color ?? "#1B2D5B" : "#FFFFFF");
  }, [theme, color]);

  return (
    <div className="phone-shell">
      <div className="dynamic-island" />
      <div className={`status-bar ${theme}`} style={color ? { background: color } : undefined}>
        <div className="status-time">{time}</div>
        <div className="status-icons" aria-hidden>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="3" width="3" height="9" rx="1" /><rect x="4.5" y="2" width="3" height="10" rx="1" /><rect x="9" y="0" width="3" height="12" rx="1" /><rect x="13.5" y="1" width="3" height="11" rx="1" /></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.5C10.2 2.5 12.2 3.4 13.6 4.9L15 3.5C13.2 1.6 10.7 0.5 8 0.5C5.3 0.5 2.8 1.6 1 3.5L2.4 4.9C3.8 3.4 5.8 2.5 8 2.5Z" /><path d="M8 5.5C9.4 5.5 10.7 6.1 11.6 7L13 5.6C11.7 4.3 10 3.5 8 3.5C6 3.5 4.3 4.3 3 5.6L4.4 7C5.3 6.1 6.6 5.5 8 5.5Z" /><circle cx="8" cy="10" r="1.5" /></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.35" fill="none" /><rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" /><path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="currentColor" fillOpacity="0.4" /></svg>
        </div>
      </div>
      <div className="app-root">
        <ToastProvider>{children}</ToastProvider>
      </div>
      {/* Hero screens (colour override) have light content at the bottom, so keep the indicator light */}
      <div className={`home-indicator ${color ? "light" : theme}`}>
        <div className="home-bar" />
      </div>
    </div>
  );
}

// ── Splash (community logo visible here) ───────────────────
function Splash({ error, onRetry }: { error?: string | null; onRetry?: () => void }) {
  return (
    <div style={sh.splash}>
      <div style={sh.splashLogo}><TwinTowersLogo size={64} /></div>
      <div style={sh.splashTitle}>TWIN TOWERS</div>
      <div style={sh.splashBy}>by Namishree</div>
      <div style={{ marginTop: 28, minHeight: 40 }}>
        {error ? (
          <div style={{ padding: "0 32px", textAlign: "center" }}>
            <ErrorText>Couldn't load community data: {error}</ErrorText>
            <button style={sh.retry} onClick={onRetry}>Try again</button>
          </div>
        ) : <Spinner />}
      </div>
    </div>
  );
}

// ── Tabs ───────────────────────────────────────────────────
const TAB_SCREENS: ScreenId[] = ["dashboard", "issues", "booking", "polls", "members"];

const stroke = (active: boolean) => (active ? "var(--navy)" : "var(--text-3)");
const TABS: { id: ScreenId; label: string; icon: (active: boolean) => ReactNode }[] = [
  { id: "dashboard", label: "Home", icon: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? "var(--navy)" : "none"} stroke={stroke(a)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ) },
  { id: "issues", label: "Issues", icon: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke(a)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ) },
  { id: "booking", label: "Book", icon: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke(a)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ) },
  { id: "polls", label: "Polls", icon: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke(a)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ) },
  { id: "members", label: "Team", icon: (a) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke(a)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ) },
];

function SignedInApp() {
  const { data } = useStore();
  const [screen, setScreen] = useState<ScreenId>("dashboard");
  const [history, setHistory] = useState<ScreenId[]>([]);

  const nav: NavProps = {
    navigate: (id) => {
      setHistory((h) => [...h, screen]);
      setScreen(id);
    },
    goBack: () => {
      setScreen(history[history.length - 1] ?? "dashboard");
      setHistory((h) => h.slice(0, -1));
    },
  };

  const screens: Record<ScreenId, ReactNode> = {
    dashboard: <ScreenDashboard {...nav} />,
    maintenance: <ScreenMaintenance {...nav} />,
    issues: <ScreenIssues {...nav} />,
    cultural: <ScreenCultural {...nav} />,
    booking: <ScreenBooking {...nav} />,
    policies: <ScreenPolicies {...nav} />,
    polls: <ScreenPolls {...nav} />,
    members: <ScreenMembers {...nav} />,
    notifications: <ScreenNotifications {...nav} />,
  };

  const unread = data!.notifications.filter((n) => !n.read).length;
  const openIssues = data!.issues.filter((i) => i.status === "Open").length;

  return (
    <div style={sh.root}>
      <div style={sh.screenArea}>
        <div key={screen} className="screen-enter" style={{ height: "100%" }}>
          {screens[screen]}
        </div>
      </div>

      {TAB_SCREENS.includes(screen) && (
        <nav style={sh.tabBar}>
          {TABS.map((t) => {
            const active = screen === t.id;
            const badge = t.id === "issues" ? openIssues : t.id === "dashboard" ? unread : 0;
            return (
              <button key={t.id} style={sh.tabItem} aria-current={active ? "page" : undefined}
                onClick={() => { setScreen(t.id); setHistory([]); }}>
                <div style={{ ...sh.tabIconWrap, ...(active ? sh.tabIconActive : {}) }}>
                  {t.icon(active)}
                  {badge > 0 && !active && <span style={sh.tabBadge}>{badge}</span>}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: active ? 800 : 600,
                  color: active ? "var(--navy)" : "var(--text-3)",
                  letterSpacing: active ? -0.1 : 0, marginTop: 4, transition: "color 0.15s",
                }}>{t.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default function App() {
  const { session, profile, data, loading, error, reload } = useStore();
  const [bar, setBar] = useState<StatusBarStyle>({ theme: "dark" });

  let content: ReactNode;
  if (loading) content = <Splash />;
  else if (!session) content = <ScreenLogin />;
  else if (error || !data || !profile) content = <Splash error={error ?? "Unknown error"} onRetry={reload} />;
  else if (!profile.name || !profile.flat || !profile.tower) content = <ScreenLogin initialStep="profile" />;
  else content = <SignedInApp />;

  return (
    <StatusThemeContext.Provider value={setBar}>
      <PhoneFrame bar={loading || !session ? { theme: "dark" } : bar}>{content}</PhoneFrame>
    </StatusThemeContext.Provider>
  );
}

const sh: Styles = {
  root: { height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", overflow: "hidden" },
  screenArea: { flex: 1, overflow: "hidden", position: "relative" },
  tabBar: {
    display: "flex", background: "var(--surface)", flexShrink: 0,
    borderTop: "1px solid var(--border)", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
  },
  tabItem: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: "8px 4px 6px", background: "none", border: "none", cursor: "pointer", position: "relative",
  },
  tabIconWrap: {
    width: 44, height: 32, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", transition: "background 0.2s",
  },
  tabIconActive: { background: "var(--navy-soft)" },
  tabBadge: {
    position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%",
    background: "var(--danger)", color: "#fff", fontSize: 9, fontWeight: 800,
    display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--surface)",
  },
  splash: {
    height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(180deg, var(--navy) 0%, #0d1e40 100%)",
  },
  splashLogo: {
    width: 104, height: 104, borderRadius: 30, background: "rgba(255,255,255,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid rgba(201,168,76,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", marginBottom: 18,
    animation: "scaleIn 0.4s both",
  },
  splashTitle: { fontSize: 24, fontWeight: 800, letterSpacing: 5, color: "var(--gold)", marginBottom: 6 },
  splashBy: { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: 1 },
  retry: {
    marginTop: 12, background: "var(--gold)", color: "#fff", border: "none", borderRadius: "var(--r-md)",
    padding: "11px 22px", fontSize: 13, fontWeight: 800,
  },
};
