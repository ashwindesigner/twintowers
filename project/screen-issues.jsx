// ============================================================
// ISSUES v2
// ============================================================
function ScreenIssues({ navigate, data, goBack }) {
  const [view, setView] = React.useState("list");
  const [selected, setSelected] = React.useState(null);
  const [showCreate, setShowCreate] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [priorityFilter, setPriorityFilter] = React.useState("All");
  const [showInfo, setShowInfo] = React.useState(false);
  const { issues } = data;

  React.useEffect(() => { window.setStatusTheme?.("light"); }, []);

  const filtered = issues.filter(i => {
    if (statusFilter !== "All" && i.status !== statusFilter) return false;
    if (priorityFilter !== "All" && i.priority !== priorityFilter) return false;
    return true;
  });

  if (showCreate) return <CreateIssueV2 onBack={() => setShowCreate(false)} />;
  if (view === "detail" && selected) return <IssueDetailV2 issue={selected} onBack={() => setView("list")} />;

  const stats = [
    { label:"Open", count: issues.filter(i=>i.status==="Open").length, color:"var(--danger)" },
    { label:"In Progress", count: issues.filter(i=>i.status==="In Progress").length, color:"var(--warning)" },
    { label:"Resolved", count: issues.filter(i=>i.status==="Resolved").length, color:"var(--success)" },
    { label:"On Hold", count: issues.filter(i=>i.status==="On Hold").length, color:"#8B5CF6" },
  ];

  return (
    <div style={ixStyles.root}>
      <ScreenHeader title="Issues" onBack={goBack} onInfo={() => setShowInfo(true)}
        right={
          <button style={ixStyles.newBtn} onClick={() => setShowCreate(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            New
          </button>
        }/>

      {/* Stats row */}
      <div style={ixStyles.statsRow}>
        {stats.map(s => (
          <div key={s.label} style={ixStyles.statCard}
            onClick={() => setStatusFilter(statusFilter === s.label ? "All" : s.label)}>
            <div style={{...ixStyles.statNum, color: s.color}}>{s.count}</div>
            <div style={ixStyles.statLabel}>{s.label}</div>
            {statusFilter === s.label && <div style={{...ixStyles.statBar, background: s.color}}/>}
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div style={ixStyles.filterRow}>
        <div style={ixStyles.filterScroll}>
          {["All","High","Medium","Low"].map(p => (
            <button key={p}
              style={{...ixStyles.chip,...(priorityFilter===p?{background:"var(--navy)",color:"#fff",border:"none"}:{})}}
              onClick={() => setPriorityFilter(p)}>{p}</button>
          ))}
        </div>
      </div>

      <div style={ixStyles.list}>
        {filtered.map(issue => (
          <div key={issue.id} style={ixStyles.card}
            onClick={() => { setSelected(issue); setView("detail"); }}>
            <div style={ixStyles.cardLeft}>
              <div style={{...ixStyles.statusBar2, background: statusColor(issue.status)}}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={ixStyles.cardHead}>
                <span style={ixStyles.ticketId}>{issue.id}</span>
                <PriorityChip priority={issue.priority}/>
              </div>
              <div style={ixStyles.cardTitle} title={issue.description}>
                {issue.description.substring(0,65)}…
              </div>
              <div style={ixStyles.cardMeta}>
                <span style={{...ixStyles.statusPill,
                  color: statusColor(issue.status),
                  background: statusColor(issue.status)+"18"}}>
                  {issue.status}
                </span>
                <span style={ixStyles.metaText}>📍 {issue.area}</span>
                <span style={ixStyles.metaText}>{issue.created.split(" ")[0]}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 &&
          <div style={ixStyles.empty}>No issues match these filters.</div>}
        <div style={{height:16}}/>
      </div>

      {showInfo && <InfoModal title="Issues & Tracking" onClose={() => setShowInfo(false)} lines={[
        "Raise and track community issues end-to-end.",
        "High priority issues are targeted for resolution within 24–48 hours.",
        "You'll receive notifications on status changes to your tickets.",
        "Attach photos for faster diagnosis and resolution.",
        "Close your ticket once you're satisfied with the resolution.",
      ]}/>}
    </div>
  );
}

function IssueDetailV2({ issue, onBack }) {
  const [comment, setComment] = React.useState("");
  return (
    <div style={ixStyles.root}>
      <ScreenHeader title={issue.id} subtitle={issue.category + " · " + issue.area} onBack={onBack}/>
      <div style={ixStyles.list}>
        <div style={ixStyles.detailCard}>
          <div style={ixStyles.detailBadges}>
            <PriorityChip priority={issue.priority}/>
            <span style={{...ixStyles.statusPill,
              color: statusColor(issue.status),
              background: statusColor(issue.status)+"18",
              fontSize:11, padding:"3px 10px"}}>
              {issue.status}
            </span>
            {issue.sla && <span style={{fontSize:11,color:"var(--danger)",fontWeight:700}}>Due {issue.sla}</span>}
          </div>
          <div style={ixStyles.detailDesc}>{issue.description}</div>
          <div style={ixStyles.detailGrid}>
            {[["Raised by", `${issue.raisedBy} · ${issue.flat}`],
              ["Assigned to", issue.assignedTo],
              ["Created", issue.created],
              ["Updated", issue.updated]
            ].map(([k,v]) => (
              <div key={k}>
                <div style={ixStyles.detailKey}>{k}</div>
                <div style={ixStyles.detailVal}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={ixStyles.sectionLabel}>Comments</div>
        {issue.comments.length === 0 &&
          <div style={ixStyles.empty}>No comments yet.</div>}
        {issue.comments.map((c,i) => (
          <div key={i} style={ixStyles.commentCard}>
            <div style={ixStyles.commentAvatar}>{c.by.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
            <div style={{flex:1}}>
              <div style={ixStyles.commentBy}>{c.by.split(" ")[0]} · {c.time}</div>
              <div style={ixStyles.commentText}>{c.text}</div>
            </div>
          </div>
        ))}

        <div style={ixStyles.commentInputRow}>
          <input style={ixStyles.commentInput} placeholder="Add a comment…"
            value={comment} onChange={e => setComment(e.target.value)}/>
          <button style={ixStyles.sendBtn} onClick={() => setComment("")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div style={{height:16}}/>
      </div>
    </div>
  );
}

function CreateIssueV2({ onBack, onSubmit }) {
  const [form, setForm] = React.useState({ category:"", area:"", priority:"Medium", description:"" });
  const set = (k,v) => setForm({...form,[k]:v});
  return (
    <div style={ixStyles.root}>
      <ScreenHeader title="New Issue" onBack={onBack}/>
      <div style={ixStyles.list}>
        <div style={ixStyles.formCard}>
          <FormSelect label="Category"
            options={["Maintenance","Water","Security","Noise","Cleanliness","Parking","Other"]}
            value={form.category} onChange={v => set("category",v)}/>
          <FormSelect label="Area / Tower"
            options={["Tower A","Tower B","Common Area","Clubhouse","Parking","Other"]}
            value={form.area} onChange={v => set("area",v)}/>
          <FormSelect label="Priority" options={["High","Medium","Low"]}
            value={form.priority} onChange={v => set("priority",v)}/>
          <FormField label="Description">
            <textarea style={ixStyles.textarea} rows={4}
              placeholder="Describe the issue clearly — include location and context…"
              value={form.description} onChange={e => set("description",e.target.value)}/>
          </FormField>
          <button style={ixStyles.attachBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight:6}}>
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Attach Photo / Video
          </button>
        </div>
        <button style={ixStyles.submitBtn} onClick={onBack}>Submit Issue</button>
        <div style={ixStyles.submitNote}>A ticket ID will be assigned on submission</div>
        <div style={{height:16}}/>
      </div>
    </div>
  );
}

const ixStyles = {
  root: { height:"100%",display:"flex",flexDirection:"column",background:"var(--bg)" },
  statsRow: {
    display:"flex",background:"var(--surface)",
    borderBottom:"1px solid var(--border)",flexShrink:0,
  },
  statCard: {
    flex:1,padding:"12px 6px",textAlign:"center",cursor:"pointer",
    position:"relative",overflow:"hidden",
  },
  statNum: { fontSize:22,fontWeight:800,letterSpacing:-0.5 },
  statLabel: { fontSize:9,fontWeight:700,color:"var(--text-3)",letterSpacing:0.3,textTransform:"uppercase" },
  statBar: { position:"absolute",bottom:0,left:0,right:0,height:2,borderRadius:99 },
  filterRow: {
    background:"var(--surface)",padding:"10px 16px",
    borderBottom:"1px solid var(--border)",flexShrink:0,
  },
  filterScroll: { display:"flex",gap:6 },
  chip: {
    flexShrink:0,fontSize:11,fontWeight:700,
    border:"1.5px solid var(--border)",borderRadius:99,
    padding:"5px 14px",background:"var(--surface)",
    color:"var(--text-2)",cursor:"pointer",
    transition:"all 0.15s",
  },
  list: { flex:1,overflowY:"auto",padding:"12px 0" },
  card: {
    display:"flex",alignItems:"stretch",gap:0,
    background:"var(--surface)",margin:"0 16px 8px",
    borderRadius:"var(--r-lg)",overflow:"hidden",
    cursor:"pointer",boxShadow:"var(--sh-xs)",
  },
  cardLeft: { width:4,flexShrink:0 },
  statusBar2: { width:4,height:"100%" },
  cardHead: { display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px 6px",gap:6 },
  ticketId: { fontSize:10,fontWeight:800,color:"var(--gold)",letterSpacing:0.4 },
  cardTitle: {
    fontSize:13,color:"var(--text-1)",lineHeight:1.45,
    padding:"0 14px",fontWeight:500,
    overflow:"hidden",textOverflow:"ellipsis",
    display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",
  },
  cardMeta: {
    display:"flex",flexWrap:"wrap",gap:8,padding:"8px 14px 12px",
    alignItems:"center",
  },
  statusPill: { fontSize:10,fontWeight:700,borderRadius:99,padding:"2px 8px" },
  metaText: { fontSize:10,color:"var(--text-3)",fontWeight:500 },
  newBtn: {
    display:"flex",alignItems:"center",gap:5,
    background:"var(--gold)",color:"#fff",
    border:"none",borderRadius:10,padding:"7px 14px",
    fontSize:12,fontWeight:800,cursor:"pointer",
  },
  empty: { textAlign:"center",color:"var(--text-3)",fontSize:13,padding:32 },
  sectionLabel: {
    fontSize:11,fontWeight:800,color:"var(--text-3)",
    letterSpacing:0.5,padding:"8px 16px",textTransform:"uppercase",
  },
  detailCard: {
    background:"var(--surface)",margin:"0 16px 12px",
    borderRadius:"var(--r-lg)",padding:"16px",boxShadow:"var(--sh-sm)",
  },
  detailBadges: { display:"flex",gap:8,flexWrap:"wrap",marginBottom:12 },
  detailDesc: { fontSize:14,color:"var(--text-1)",lineHeight:1.6,marginBottom:14 },
  detailGrid: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 },
  detailKey: { fontSize:10,fontWeight:700,color:"var(--text-3)",marginBottom:2,textTransform:"uppercase",letterSpacing:0.3 },
  detailVal: { fontSize:12,color:"var(--text-1)",fontWeight:600 },
  commentCard: {
    display:"flex",gap:10,background:"var(--surface)",
    margin:"0 16px 8px",borderRadius:"var(--r-md)",padding:"12px",
  },
  commentAvatar: {
    width:32,height:32,borderRadius:10,background:"var(--navy)",
    color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:10,fontWeight:800,flexShrink:0,
  },
  commentBy: { fontSize:11,fontWeight:700,color:"var(--gold)",marginBottom:3 },
  commentText: { fontSize:13,color:"var(--text-1)",lineHeight:1.45 },
  commentInputRow: {
    display:"flex",gap:8,margin:"8px 16px",
    background:"var(--surface)",borderRadius:"var(--r-md)",
    padding:"8px",boxShadow:"var(--sh-xs)",
  },
  commentInput: {
    flex:1,border:"none",outline:"none",fontSize:13,
    color:"var(--text-1)",background:"transparent",padding:"6px 8px",
  },
  sendBtn: {
    width:36,height:36,borderRadius:10,background:"var(--navy)",
    border:"none",color:"#fff",display:"flex",
    alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,
  },
  formCard: {
    background:"var(--surface)",margin:"0 16px",
    borderRadius:"var(--r-lg)",padding:"18px",boxShadow:"var(--sh-sm)",
  },
  textarea: {
    width:"100%",border:"1.5px solid var(--border)",
    borderRadius:"var(--r-md)",padding:"12px 14px",
    fontSize:14,color:"var(--text-1)",outline:"none",
    resize:"none",background:"var(--surface-2)",lineHeight:1.5,
  },
  attachBtn: {
    width:"100%",background:"var(--surface-2)",
    border:"1.5px dashed var(--border)",
    borderRadius:"var(--r-md)",padding:"13px",
    fontSize:13,color:"var(--text-2)",cursor:"pointer",
    display:"flex",alignItems:"center",justifyContent:"center",
    marginTop:4,fontWeight:600,
  },
  submitBtn: {
    display:"block",width:"calc(100% - 32px)",margin:"16px 16px 0",
    background:"var(--gold)",color:"#fff",border:"none",
    borderRadius:"var(--r-md)",padding:"16px",
    fontSize:15,fontWeight:800,cursor:"pointer",
    boxShadow:"0 4px 20px rgba(201,168,76,0.3)",letterSpacing:-0.2,
  },
  submitNote: { textAlign:"center",fontSize:11,color:"var(--text-3)",marginTop:8 },
};

Object.assign(window, { ScreenIssues });
