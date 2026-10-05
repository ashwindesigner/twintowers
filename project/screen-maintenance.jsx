// ============================================================
// MAINTENANCE v3 — Rebuilt & Pixel-Perfect
// ============================================================
function ScreenMaintenance({ navigate, data, goBack }) {
  const [view, setView] = React.useState("list");
  const [selected, setSelected] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState("All");
  const [showInfo, setShowInfo] = React.useState(false);
  const { maintenanceItems } = data;

  React.useEffect(() => { window.setStatusTheme?.("light"); }, []);

  const tabs = ["All","Tower A","Tower B","Common Areas","Clubhouse","Parking"];
  const filtered = activeTab === "All"
    ? maintenanceItems
    : maintenanceItems.filter(m => m.category === activeTab);

  const counts = {
    Good: maintenanceItems.filter(m => m.status === "Good").length,
    Fair: maintenanceItems.filter(m => m.status === "Fair").length,
    Poor: maintenanceItems.filter(m => m.status === "Poor").length,
  };

  // ── DETAIL VIEW ────────────────────────────────────────
  if (view === "detail" && selected) {
    const statusMap = {
      Good:  { fg:"var(--success)", bg:"var(--success-bg)", icon:"✓" },
      Fair:  { fg:"var(--warning)", bg:"var(--warning-bg)", icon:"~" },
      Poor:  { fg:"var(--danger)",  bg:"var(--danger-bg)",  icon:"!" },
    };
    const s = statusMap[selected.status] || { fg:"var(--text-3)", bg:"var(--surface-2)", icon:"?" };

    return (
      <div style={mx.root}>
        <ScreenHeader
          title={selected.name}
          subtitle={`${selected.category} · ${selected.subcategory}`}
          onBack={() => setView("list")}
        />
        <div style={mx.scroll}>

          {/* Status hero card */}
          <div style={{...mx.heroCard, background: s.bg, borderColor: s.fg + "30"}}>
            <div style={{...mx.heroIconCircle, background: s.fg + "18", border: `2px solid ${s.fg}30`}}>
              <span style={{fontSize:32, fontWeight:900, color: s.fg}}>{s.icon}</span>
            </div>
            <div style={mx.heroRight}>
              <div style={mx.heroStatus}>
                <span style={{...mx.heroStatusText, color: s.fg}}>{selected.status}</span>
                <span style={mx.heroStatusLabel}>Current Condition</span>
              </div>
              <div style={mx.heroDates}>
                <div style={mx.heroDateItem}>
                  <span style={mx.heroDateLabel}>Last checked</span>
                  <span style={mx.heroDateVal}>{selected.lastInspected}</span>
                </div>
                <div style={mx.heroDivider}/>
                <div style={mx.heroDateItem}>
                  <span style={mx.heroDateLabel}>Next check</span>
                  <span style={{
                    ...mx.heroDateVal,
                    color: daysUntil(selected.nextCheck) <= 3 ? "var(--danger)" : "var(--text-1)",
                    fontWeight: daysUntil(selected.nextCheck) <= 3 ? 800 : 700,
                  }}>{selected.nextCheck}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div style={mx.infoGrid}>
            <div style={mx.infoCell}>
              <div style={mx.infoCellLabel}>Assigned To</div>
              <div style={mx.infoCellVal}>{selected.assignedTo.split(" ").slice(0,2).join(" ")}</div>
            </div>
            {selected.warrantyExpiry && (
              <div style={{...mx.infoCell, ...(daysUntil(selected.warrantyExpiry) < 90 ? {background:"var(--warning-bg)"} : {})}}>
                <div style={mx.infoCellLabel}>Warranty Expiry</div>
                <div style={{...mx.infoCellVal, color: daysUntil(selected.warrantyExpiry) < 90 ? "var(--warning)" : "var(--text-1)"}}>
                  {selected.warrantyExpiry}
                  {daysUntil(selected.warrantyExpiry) < 90 &&
                    <span style={{fontSize:10, marginLeft:4}}>({daysUntil(selected.warrantyExpiry)}d)</span>}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div style={mx.notesCard}>
            <div style={mx.notesCellLabel}>Notes</div>
            <div style={mx.notesText}>{selected.notes}</div>
          </div>

          {/* Timeline */}
          <div style={mx.sectionHeader}>
            <span style={mx.sectionTitle}>Inspection History</span>
            <span style={mx.sectionCount}>{selected.history.length} records</span>
          </div>

          <div style={mx.timeline}>
            {selected.history.map((h, i) => {
              const hs = statusMap[h.status] || { fg:"var(--text-3)", bg:"var(--surface-2)" };
              const isLast = i === selected.history.length - 1;
              return (
                <div key={i} style={mx.timelineRow}>
                  {/* Left: dot + line */}
                  <div style={mx.timelineLeft}>
                    <div style={{...mx.tlDot, background: hs.fg, boxShadow:`0 0 0 3px ${hs.fg}20`}}/>
                    {!isLast && <div style={mx.tlLine}/>}
                  </div>
                  {/* Content */}
                  <div style={{...mx.tlContent, paddingBottom: isLast ? 0 : 16}}>
                    <div style={mx.tlHeader}>
                      <span style={mx.tlDate}>{h.date}</span>
                      <span style={{...mx.tlStatus, color: hs.fg, background: hs.fg+"18"}}>{h.status}</span>
                    </div>
                    <div style={mx.tlNote}>{h.note}</div>
                    <div style={mx.tlBy}>Inspector: {h.inspector.split(" ")[0]} {h.inspector.split(" ")[1]?.[0]}.</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{height:24}}/>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────
  return (
    <div style={mx.root}>
      <ScreenHeader title="Maintenance" onBack={goBack} onInfo={() => setShowInfo(true)}/>

      {/* Summary strip */}
      <div style={mx.summaryStrip}>
        {[
          ["Good",  counts.Good,  "var(--success)", "var(--success-bg)"],
          ["Fair",  counts.Fair,  "var(--warning)", "var(--warning-bg)"],
          ["Poor",  counts.Poor,  "var(--danger)",  "var(--danger-bg)"],
        ].map(([label, count, fg, bg], i) => (
          <React.Fragment key={label}>
            {i > 0 && <div style={mx.summaryDivider}/>}
            <div style={mx.summaryCell}>
              <div style={{...mx.summaryBadge, color: fg, background: bg}}>
                <span style={mx.summaryNum}>{count}</span>
              </div>
              <span style={mx.summaryLabel}>{label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Scrollable category tabs */}
      <div style={mx.tabStrip}>
        {tabs.map(t => (
          <button
            key={t}
            style={{...mx.tabBtn, ...(activeTab === t ? mx.tabBtnActive : {})}}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={mx.scroll}>
        {filtered.map(item => {
          const statusColors = {
            Good:  "var(--success)",
            Fair:  "var(--warning)",
            Poor:  "var(--danger)",
            "Out of service": "var(--text-3)",
          };
          const accentColor = statusColors[item.status] || "var(--text-3)";

          return (
            <div key={item.id} style={mx.card}
              onClick={() => { setSelected(item); setView("detail"); }}>
              {/* Left accent */}
              <div style={{...mx.cardAccent, background: accentColor}}/>

              {/* Body */}
              <div style={mx.cardBody}>
                {/* Row 1: category label + status chip */}
                <div style={mx.cardRow1}>
                  <span style={mx.cardCatLabel}>{item.category} · {item.subcategory}</span>
                  <span style={{
                    fontSize:11, fontWeight:700,
                    color: accentColor,
                    background: accentColor + "18",
                    borderRadius:99, padding:"3px 10px",
                    letterSpacing:0.2, flexShrink:0,
                  }}>{item.status}</span>
                </div>

                {/* Row 2: item name */}
                <div style={mx.cardName}>{item.name}</div>

                {/* Row 3: meta chips */}
                <div style={mx.cardChips}>
                  <div style={mx.chip}>
                    <span style={mx.chipIcon}>👤</span>
                    <span>{item.assignedTo.split(" ")[0]}</span>
                  </div>
                  <div style={mx.chip}>
                    <span style={mx.chipIcon}>📅</span>
                    <span>Next {item.nextCheck}</span>
                  </div>
                  {item.warrantyExpiry && daysUntil(item.warrantyExpiry) < 90 && (
                    <div style={{...mx.chip, color:"var(--warning)", background:"var(--warning-bg)"}}>
                      <span>⚠️</span>
                      <span>Warranty {daysUntil(item.warrantyExpiry)}d</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Chevron */}
              <div style={mx.cardChevron}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="var(--text-3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          );
        })}
        <div style={{height:16}}/>
      </div>

      {showInfo && (
        <InfoModal title="Maintenance & Assets" onClose={() => setShowInfo(false)} lines={[
          "Tracks condition of all physical assets across Twin Towers.",
          "Updated weekly by task members; critical items checked daily.",
          "Photos attached with every inspection for a full audit trail.",
          "You're notified when any status changes to Poor or Out of Service.",
          "Tap any item to view full history or raise a linked issue.",
        ]}/>
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const mx = {
  root: {
    height:"100%", display:"flex", flexDirection:"column", background:"var(--bg)",
  },

  // Summary strip
  summaryStrip: {
    display:"flex", alignItems:"center", justifyContent:"center",
    background:"var(--surface)", borderBottom:"1px solid var(--border)",
    padding:"12px 16px", flexShrink:0, gap:0,
  },
  summaryCell: {
    flex:1, display:"flex", flexDirection:"column",
    alignItems:"center", gap:6,
  },
  summaryBadge: {
    width:44, height:44, borderRadius:14,
    display:"flex", alignItems:"center", justifyContent:"center",
  },
  summaryNum: { fontSize:20, fontWeight:800, lineHeight:1 },
  summaryLabel: { fontSize:10, fontWeight:700, color:"var(--text-3)", letterSpacing:0.3 },
  summaryDivider: { width:1, height:40, background:"var(--border)", flexShrink:0, margin:"0 8px" },

  // Tabs
  tabStrip: {
    display:"flex", gap:6, padding:"10px 16px",
    overflowX:"auto", flexShrink:0,
    background:"var(--surface)", borderBottom:"1px solid var(--border)",
    WebkitOverflowScrolling:"touch",
  },
  tabBtn: {
    flexShrink:0, fontSize:12, fontWeight:700,
    border:"none", borderRadius:99,
    padding:"7px 16px",
    background:"var(--surface-2)", color:"var(--text-3)",
    cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap",
  },
  tabBtnActive: {
    background:"var(--navy)", color:"#fff",
    boxShadow:"0 2px 8px rgba(27,45,91,0.25)",
  },

  // List scroll
  scroll: { flex:1, overflowY:"auto", padding:"12px 16px" },

  // Card
  card: {
    display:"flex", alignItems:"stretch",
    background:"var(--surface)", borderRadius:"var(--r-lg)",
    marginBottom:10, cursor:"pointer",
    boxShadow:"var(--sh-sm)", overflow:"hidden",
    transition:"transform 0.1s, box-shadow 0.1s",
  },
  cardAccent: { width:4, flexShrink:0 },
  cardBody: { flex:1, padding:"13px 12px", minWidth:0 },
  cardRow1: {
    display:"flex", justifyContent:"space-between",
    alignItems:"center", gap:8, marginBottom:4,
  },
  cardCatLabel: {
    fontSize:10, fontWeight:700, color:"var(--gold)",
    letterSpacing:0.3, textTransform:"uppercase",
  },
  cardName: {
    fontSize:14, fontWeight:800, color:"var(--text-1)",
    letterSpacing:-0.2, marginBottom:10, lineHeight:1.3,
  },
  cardChips: { display:"flex", flexWrap:"wrap", gap:6 },
  chip: {
    display:"flex", alignItems:"center", gap:4,
    fontSize:10, fontWeight:600, color:"var(--text-2)",
    background:"var(--surface-2)", borderRadius:99, padding:"4px 10px",
  },
  chipIcon: { fontSize:11 },
  cardChevron: {
    display:"flex", alignItems:"center", justifyContent:"center",
    width:36, flexShrink:0, paddingRight:4,
  },

  // Detail hero card
  heroCard: {
    display:"flex", alignItems:"center", gap:16,
    margin:"16px 16px 0", borderRadius:"var(--r-xl)",
    padding:"18px 20px", border:"1.5px solid transparent",
    boxShadow:"var(--sh-sm)",
  },
  heroIconCircle: {
    width:64, height:64, borderRadius:20,
    display:"flex", alignItems:"center", justifyContent:"center",
    flexShrink:0,
  },
  heroRight: { flex:1, minWidth:0 },
  heroStatus: { marginBottom:10 },
  heroStatusText: { fontSize:22, fontWeight:900, display:"block", letterSpacing:-0.5 },
  heroStatusLabel: { fontSize:11, color:"var(--text-3)", fontWeight:600 },
  heroDates: { display:"flex", alignItems:"center", gap:12 },
  heroDateItem: { display:"flex", flexDirection:"column", gap:2 },
  heroDateLabel: { fontSize:9, fontWeight:700, color:"var(--text-3)", letterSpacing:0.4, textTransform:"uppercase" },
  heroDateVal: { fontSize:12, fontWeight:700, color:"var(--text-1)" },
  heroDivider: { width:1, height:28, background:"var(--border)", flexShrink:0 },

  // Info grid
  infoGrid: {
    display:"grid", gridTemplateColumns:"1fr 1fr",
    gap:10, padding:"12px 16px 0",
  },
  infoCell: {
    background:"var(--surface)", borderRadius:"var(--r-md)",
    padding:"12px 14px", boxShadow:"var(--sh-xs)",
  },
  infoCellLabel: {
    fontSize:9, fontWeight:800, color:"var(--text-3)",
    letterSpacing:0.5, textTransform:"uppercase", marginBottom:5,
  },
  infoCellVal: { fontSize:13, fontWeight:700, color:"var(--text-1)" },

  // Notes
  notesCard: {
    background:"var(--surface)", margin:"10px 16px 0",
    borderRadius:"var(--r-md)", padding:"13px 14px",
    boxShadow:"var(--sh-xs)",
  },
  notesCellLabel: {
    fontSize:9, fontWeight:800, color:"var(--text-3)",
    letterSpacing:0.5, textTransform:"uppercase", marginBottom:6,
  },
  notesText: { fontSize:13, color:"var(--text-2)", lineHeight:1.6 },

  // Section header
  sectionHeader: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"16px 16px 10px",
  },
  sectionTitle: {
    fontSize:11, fontWeight:800, color:"var(--text-3)",
    letterSpacing:0.5, textTransform:"uppercase",
  },
  sectionCount: { fontSize:11, fontWeight:600, color:"var(--text-3)" },

  // Timeline
  timeline: { padding:"0 16px" },
  timelineRow: { display:"flex", gap:14, alignItems:"flex-start" },
  timelineLeft: {
    display:"flex", flexDirection:"column",
    alignItems:"center", flexShrink:0, width:10,
    paddingTop:3,
  },
  tlDot: { width:10, height:10, borderRadius:"50%", flexShrink:0 },
  tlLine: { width:2, flex:1, background:"var(--border)", marginTop:4, minHeight:20 },
  tlContent: { flex:1, paddingBottom:16 },
  tlHeader: {
    display:"flex", alignItems:"center", gap:8, marginBottom:5,
  },
  tlDate: { fontSize:11, fontWeight:700, color:"var(--text-2)" },
  tlStatus: {
    fontSize:10, fontWeight:700, borderRadius:99,
    padding:"2px 8px", letterSpacing:0.2,
  },
  tlNote: {
    fontSize:13, color:"var(--text-1)", lineHeight:1.5,
    marginBottom:4,
    background:"var(--surface)", borderRadius:"var(--r-md)",
    padding:"10px 12px", boxShadow:"var(--sh-xs)",
  },
  tlBy: { fontSize:11, color:"var(--text-3)", marginTop:4, paddingLeft:2 },
};

Object.assign(window, { ScreenMaintenance });
