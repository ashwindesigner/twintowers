// ============================================================
// CULTURAL v2
// ============================================================
function ScreenCultural({ navigate, data, goBack }) {
  const [tab, setTab] = React.useState("events");
  const [showInfo, setShowInfo] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const { events, proposals } = data;

  React.useEffect(() => { window.setStatusTheme?.("light"); }, []);

  const tabItems = [["events","Events"],["proposals","Proposals"],["gallery","Gallery"]];

  if (selected) {
    const ev = selected;
    const pct = Math.round((ev.registered / ev.capacity) * 100);
    return (
      <div style={cxStyles.root}>
        <ScreenHeader title="" onBack={() => setSelected(null)} transparent />
        <div style={cxStyles.scroll}>
          <div style={cxStyles.eventHero}>
            <div style={cxStyles.heroBg}/>
            <div style={cxStyles.heroEmoji}>{ev.category==="Festival"?"🎊":ev.category==="Sports"?"🏅":ev.category==="National"?"🇮🇳":"📅"}</div>
            <span style={cxStyles.heroCat}>{ev.category}</span>
            <div style={cxStyles.heroTitle}>{ev.name}</div>
            <div style={cxStyles.heroDate}>{ev.date} · {ev.time}</div>
            <div style={cxStyles.heroLoc}>📍 {ev.location}</div>
          </div>
          <div style={cxStyles.detailBody}>
            <div style={cxStyles.detailDesc}>{ev.description}</div>
            <div style={cxStyles.regSection}>
              <div style={cxStyles.regRow}>
                <span style={cxStyles.regLabel}>{ev.registered} registered</span>
                <span style={cxStyles.regCap}>of {ev.capacity}</span>
              </div>
              <div style={cxStyles.regBarBg}>
                <div style={{...cxStyles.regBarFill, width:`${pct}%`}}/>
              </div>
            </div>
            <div style={cxStyles.orgRow}>
              <div style={cxStyles.orgAvatar}>{ev.organizer.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
              <div>
                <div style={cxStyles.orgName}>{ev.organizer}</div>
                <div style={cxStyles.orgRole}>Cultural Committee</div>
              </div>
            </div>
            <button style={cxStyles.regBtn}>{ev.registered > 0 ? "✅  Registered" : "Register Interest"}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={cxStyles.root}>
      <ScreenHeader title="Cultural" onBack={goBack} onInfo={() => setShowInfo(true)}/>
      <div style={cxStyles.tabBar}>
        {tabItems.map(([id,label]) => (
          <button key={id} style={{...cxStyles.tab,...(tab===id?cxStyles.tabActive:{})}}
            onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      <div style={{flex:1,overflow:"hidden"}}>
        {tab === "events" && (
          <div style={cxStyles.scroll}>
            {events.map(ev => (
              <div key={ev.id} style={cxStyles.eventCard} onClick={() => setSelected(ev)}>
                <div style={cxStyles.evDateBox}>
                  <div style={cxStyles.evMonth}>{new Date(ev.date).toLocaleString("default",{month:"short"}).toUpperCase()}</div>
                  <div style={cxStyles.evDay}>{new Date(ev.date).getDate()}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={cxStyles.evName}>{ev.name}</div>
                  <div style={cxStyles.evMeta}>⏰ {ev.time} · 📍 {ev.location.split(" ").slice(0,2).join(" ")}</div>
                  <div style={cxStyles.evFooter}>
                    <span style={cxStyles.evOrg}>{ev.organizer.split(" ")[0]}</span>
                    <span style={{...cxStyles.evStatus, color: ev.status==="upcoming"?"var(--success)":"var(--warning)",
                      background: ev.status==="upcoming"?"var(--success-bg)":"var(--warning-bg)"}}>
                      {ev.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{height:16}}/>
          </div>
        )}
        {tab === "proposals" && (
          <div style={cxStyles.scroll}>
            <div style={cxStyles.propHeader}>
              <button style={cxStyles.propNewBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{marginRight:6}}>
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Propose an Event
              </button>
            </div>
            {proposals.map(p => {
              const sMap = { approved:["var(--success)","var(--success-bg)"], under_review:["var(--warning)","var(--warning-bg)"], pending:["var(--info)","var(--info-bg)"] };
              const sLabel = { approved:"Approved", under_review:"Under Review", pending:"Pending" };
              const [fg,bg] = sMap[p.status]||["var(--text-3)","var(--surface-2)"];
              return (
                <div key={p.id} style={cxStyles.propCard}>
                  <div style={cxStyles.propTop}>
                    <div style={cxStyles.propName}>{p.name}</div>
                    <span style={{fontSize:10,fontWeight:700,color:fg,background:bg,borderRadius:99,padding:"3px 9px",flexShrink:0}}>{sLabel[p.status]}</span>
                  </div>
                  <div style={cxStyles.propDesc}>{p.description}</div>
                  <div style={cxStyles.propMeta}>
                    <span>💰 ₹{p.budget?.toLocaleString()}</span>
                    <span>📅 {p.proposedDate}</span>
                    <span>By {p.proposedBy.split(" ")[0]}</span>
                  </div>
                  <div style={cxStyles.propVotes}>
                    <span style={{color:"var(--success)",fontWeight:700,fontSize:13}}>👍 {p.votes.yes}</span>
                    <span style={{color:"var(--danger)",fontWeight:700,fontSize:13}}>👎 {p.votes.no}</span>
                  </div>
                </div>
              );
            })}
            <div style={{height:16}}/>
          </div>
        )}
        {tab === "gallery" && (
          <div style={cxStyles.scroll}>
            <div style={cxStyles.galleryGrid}>
              {[["Ugadi 2026","24 photos","Apr 2026","🌸",45],
                ["New Year 2026","38 photos","Jan 2026","🎆",200],
                ["Diwali 2025","52 photos","Oct 2025","🪔",270],
                ["Ganesh Chaturthi 2025","41 photos","Sep 2025","🐘",120],
                ["Sports Day 2025","29 photos","May 2025","🏅",30],
                ["Onam 2025","33 photos","Sep 2025","🌺",160],
              ].map(([name,count,date,emoji,hue]) => (
                <div key={name} style={cxStyles.albumCard}>
                  <div style={{...cxStyles.albumThumb,
                    background:`linear-gradient(135deg, oklch(0.5 0.15 ${hue}) 0%, oklch(0.38 0.12 ${hue+50}) 100%)`}}>
                    <span style={{fontSize:32}}>{emoji}</span>
                  </div>
                  <div style={cxStyles.albumInfo}>
                    <div style={cxStyles.albumName}>{name}</div>
                    <div style={cxStyles.albumMeta}>{count} · {date}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{height:16}}/>
          </div>
        )}
      </div>
      {showInfo && <InfoModal title="Cultural Activities" onClose={() => setShowInfo(false)} lines={[
        "Community events, festivals, and celebration gallery.",
        "Managed by Anitha Reddy — Cultural Committee Head.",
        "Events published once confirmed; gallery updated post-event.",
        "Register interest for events or propose new ones.",
      ]}/>}
    </div>
  );
}

const cxStyles = {
  root: { height:"100%",display:"flex",flexDirection:"column",background:"var(--bg)" },
  tabBar: {
    display:"flex",background:"var(--surface)",
    borderBottom:"1px solid var(--border)",flexShrink:0,
  },
  tab: {
    flex:1,padding:"13px 4px",fontSize:12,fontWeight:700,
    border:"none",background:"none",cursor:"pointer",
    color:"var(--text-3)",borderBottom:"2px solid transparent",
    transition:"all 0.15s",
  },
  tabActive: { color:"var(--navy)",borderBottom:"2px solid var(--navy)" },
  scroll: { flex:1,overflowY:"auto" },
  eventCard: {
    display:"flex",gap:14,background:"var(--surface)",
    margin:"8px 16px 0",borderRadius:"var(--r-lg)",padding:"14px",
    cursor:"pointer",boxShadow:"var(--sh-xs)",alignItems:"flex-start",
  },
  evDateBox: {
    background:"var(--navy)",borderRadius:12,padding:"8px 10px",
    textAlign:"center",minWidth:46,flexShrink:0,
  },
  evMonth: { fontSize:9,fontWeight:800,color:"var(--gold)",letterSpacing:1 },
  evDay: { fontSize:22,fontWeight:800,color:"#fff",lineHeight:1.1 },
  evName: { fontSize:14,fontWeight:800,color:"var(--text-1)",marginBottom:5,letterSpacing:-0.2 },
  evMeta: { fontSize:11,color:"var(--text-3)",marginBottom:6 },
  evFooter: { display:"flex",alignItems:"center",justifyContent:"space-between" },
  evOrg: { fontSize:11,color:"var(--text-2)",fontWeight:600 },
  evStatus: { fontSize:10,fontWeight:700,borderRadius:99,padding:"2px 9px" },
  eventHero: {
    background:"var(--navy)",padding:"40px 24px 28px",
    display:"flex",flexDirection:"column",alignItems:"center",
    gap:8,position:"relative",flexShrink:0,
  },
  heroBg: {
    position:"absolute",width:250,height:250,borderRadius:"50%",
    background:"radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 65%)",
    top:0,left:"50%",transform:"translateX(-50%)",pointerEvents:"none",
  },
  heroEmoji: { fontSize:60,position:"relative" },
  heroCat: {
    fontSize:10,fontWeight:800,color:"var(--gold)",
    letterSpacing:2,background:"rgba(201,168,76,0.15)",
    borderRadius:99,padding:"3px 12px",
  },
  heroTitle: { fontSize:22,fontWeight:800,color:"#fff",textAlign:"center",letterSpacing:-0.4 },
  heroDate: { fontSize:13,color:"rgba(255,255,255,0.6)" },
  heroLoc: { fontSize:13,color:"rgba(255,255,255,0.5)" },
  detailBody: { padding:"20px 16px" },
  detailDesc: {
    fontSize:14,color:"var(--text-2)",lineHeight:1.65,
    background:"var(--surface)",borderRadius:"var(--r-md)",padding:16,
    marginBottom:16,boxShadow:"var(--sh-xs)",
  },
  regSection: { marginBottom:16 },
  regRow: { display:"flex",justifyContent:"space-between",marginBottom:8 },
  regLabel: { fontSize:13,fontWeight:700,color:"var(--text-1)" },
  regCap: { fontSize:12,color:"var(--text-3)" },
  regBarBg: { height:6,background:"var(--surface-2)",borderRadius:99,overflow:"hidden" },
  regBarFill: { height:"100%",background:"var(--gold)",borderRadius:99,transition:"width 0.5s" },
  orgRow: {
    display:"flex",gap:12,alignItems:"center",
    background:"var(--surface)",borderRadius:"var(--r-md)",padding:14,
    marginBottom:16,boxShadow:"var(--sh-xs)",
  },
  orgAvatar: {
    width:40,height:40,borderRadius:12,
    background:"var(--navy)",color:"#fff",
    display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:13,fontWeight:800,flexShrink:0,
  },
  orgName: { fontSize:13,fontWeight:800,color:"var(--text-1)" },
  orgRole: { fontSize:11,color:"var(--text-3)",marginTop:2 },
  regBtn: {
    width:"100%",background:"var(--gold)",color:"#fff",
    border:"none",borderRadius:"var(--r-md)",padding:"16px",
    fontSize:15,fontWeight:800,cursor:"pointer",
    boxShadow:"0 4px 20px rgba(201,168,76,0.3)",letterSpacing:-0.2,
  },
  propHeader: { padding:"12px 16px 4px" },
  propNewBtn: {
    background:"var(--navy)",color:"#fff",border:"none",
    borderRadius:12,padding:"10px 18px",fontSize:13,fontWeight:700,
    cursor:"pointer",display:"flex",alignItems:"center",
  },
  propCard: {
    background:"var(--surface)",margin:"8px 16px 0",
    borderRadius:"var(--r-lg)",padding:16,boxShadow:"var(--sh-xs)",
  },
  propTop: { display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8 },
  propName: { fontSize:14,fontWeight:800,color:"var(--text-1)",flex:1,letterSpacing:-0.2 },
  propDesc: { fontSize:12,color:"var(--text-2)",lineHeight:1.55,marginBottom:10 },
  propMeta: { display:"flex",flexWrap:"wrap",gap:10,fontSize:11,color:"var(--text-3)",marginBottom:8 },
  propVotes: { display:"flex",gap:16 },
  galleryGrid: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"12px 16px" },
  albumCard: { borderRadius:"var(--r-lg)",overflow:"hidden",boxShadow:"var(--sh-sm)",cursor:"pointer" },
  albumThumb: { height:100,display:"flex",alignItems:"center",justifyContent:"center" },
  albumInfo: { background:"var(--surface)",padding:"10px 12px" },
  albumName: { fontSize:12,fontWeight:800,color:"var(--text-1)",letterSpacing:-0.1 },
  albumMeta: { fontSize:10,color:"var(--text-3)",marginTop:2 },
};

Object.assign(window, { ScreenCultural });
