// ============================================================
// APP SHELL v2 — Modern Bottom Nav
// ============================================================
function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [screen, setScreen] = React.useState("dashboard");
  const [history, setHistory] = React.useState([]);
  const data = window.APP_DATA;

  function navigate(screenId) {
    setHistory(h => [...h, screen]);
    setScreen(screenId);
  }

  function goBack() {
    if (history.length > 0) {
      setScreen(history[history.length - 1]);
      setHistory(h => h.slice(0, -1));
    } else {
      setScreen("dashboard");
    }
  }

  const TAB_SCREENS = ["dashboard","issues","booking","polls","members"];

  const tabs = [
    { id:"dashboard", label:"Home",    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active?"var(--navy)":"none"} stroke={active?"var(--navy)":"var(--text-3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { id:"issues",    label:"Issues",  icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"var(--navy)":"var(--text-3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    )},
    { id:"booking",   label:"Book",    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"var(--navy)":"var(--text-3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )},
    { id:"polls",     label:"Polls",   icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"var(--navy)":"var(--text-3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )},
    { id:"members",   label:"Team",    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"var(--navy)":"var(--text-3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )},
  ];

  // Expose navigation for PPTX capture
  React.useEffect(() => {
    window.appNavigate = (id) => {
      if (id === "__login") { setLoggedIn(false); return; }
      if (id === "__login_done") { setLoggedIn(true); window.setStatusTheme?.("dark"); return; }
      setHistory([]);
      setScreen(id);
    };
  }, []);

  if (!loggedIn) {
    return (
      <div style={{height:"100%"}}>
        <ScreenLogin onLogin={() => { setLoggedIn(true); window.setStatusTheme?.("dark"); }} />
      </div>
    );
  }

  const showBottomNav = TAB_SCREENS.includes(screen);
  const props = { navigate, goBack, data };

  const activeData = data.notifications.filter(n=>!n.read).length;

  const screens = {
    dashboard:     <ScreenDashboard {...props}/>,
    maintenance:   <ScreenMaintenance {...props}/>,
    issues:        <ScreenIssues {...props}/>,
    cultural:      <ScreenCultural {...props}/>,
    booking:       <ScreenBooking {...props}/>,
    policies:      <ScreenPolicies {...props}/>,
    polls:         <ScreenPolls {...props}/>,
    members:       <ScreenMembers {...props}/>,
    notifications: <ScreenNotifications {...props}/>,
  };

  return (
    <div style={shellStyles.root}>
      <div style={shellStyles.screenArea}>
        <div key={screen} className="screen-enter" style={{height:"100%"}}>
          {screens[screen] || screens["dashboard"]}
        </div>
      </div>

      {showBottomNav && (
        <div style={shellStyles.tabBar}>
          {tabs.map(t => {
            const active = screen === t.id;
            const badge = t.id === "issues"
              ? data.issues.filter(i=>i.status==="Open").length
              : t.id === "dashboard" ? activeData : 0;

            return (
              <button key={t.id} style={shellStyles.tabItem}
                onClick={() => { setScreen(t.id); setHistory([]); }}>
                <div style={{...shellStyles.tabIconWrap,...(active?shellStyles.tabIconActive:{})}}>
                  {t.icon(active)}
                  {badge > 0 && !active && (
                    <span style={shellStyles.tabBadge}>{badge}</span>
                  )}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: active ? 800 : 600,
                  color: active ? "var(--navy)" : "var(--text-3)",
                  letterSpacing: active ? -0.1 : 0, marginTop: 4,
                  transition: "color 0.15s",
                }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const shellStyles = {
  root: {
    height:"100%",display:"flex",flexDirection:"column",
    background:"var(--bg)",overflow:"hidden",
  },
  screenArea: { flex:1,overflow:"hidden",position:"relative" },
  tabBar: {
    display:"flex",background:"var(--surface)",flexShrink:0,
    borderTop:"1px solid var(--border)",
    paddingBottom:"env(safe-area-inset-bottom,0)",
    boxShadow:"0 -4px 20px rgba(0,0,0,0.06)",
  },
  tabItem: {
    flex:1,display:"flex",flexDirection:"column",
    alignItems:"center",justifyContent:"center",
    padding:"8px 4px 6px",background:"none",border:"none",
    cursor:"pointer",position:"relative",
  },
  tabIconWrap: {
    width:44,height:32,borderRadius:12,
    display:"flex",alignItems:"center",justifyContent:"center",
    position:"relative",transition:"background 0.2s",
  },
  tabIconActive: { background:"var(--navy-soft)" },
  tabBadge: {
    position:"absolute",top:2,right:2,
    width:16,height:16,borderRadius:"50%",
    background:"var(--danger)",color:"#fff",
    fontSize:9,fontWeight:800,
    display:"flex",alignItems:"center",justifyContent:"center",
    border:"2px solid var(--surface)",
  },
};

const root = ReactDOM.createRoot(document.getElementById("app-root"));
root.render(<App/>);
