// ============================================================
// NOTIFICATIONS v2
// ============================================================
function ScreenNotifications({ goBack, data }) {
  const [notifs, setNotifs] = React.useState(data.notifications);

  React.useEffect(() => { window.setStatusTheme?.("light"); }, []);

  const markAll = () => setNotifs(prev => prev.map(n => ({...n, read:true})));
  const markOne = id => setNotifs(prev => prev.map(n => n.id===id?{...n,read:true}:n));
  const unread = notifs.filter(n => !n.read).length;

  const typeConfig = {
    issue:       { icon:"📋", color:"var(--danger)",  bg:"var(--danger-bg)"  },
    maintenance: { icon:"🔧", color:"var(--info)",    bg:"var(--info-bg)"    },
    booking:     { icon:"📅", color:"var(--success)", bg:"var(--success-bg)" },
    poll:        { icon:"🗳️", color:"var(--navy)",    bg:"var(--navy-soft)"  },
    event:       { icon:"🎉", color:"var(--gold)",    bg:"var(--gold-soft)"  },
    alert:       { icon:"⚠️", color:"var(--warning)", bg:"var(--warning-bg)" },
  };

  return (
    <div style={nxStyles.root}>
      <ScreenHeader title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : "All caught up"}
        onBack={goBack}
        right={
          unread > 0 &&
          <button style={nxStyles.markBtn} onClick={markAll}>Mark all read</button>
        }/>

      <div style={nxStyles.scroll}>
        {notifs.map((n,i) => {
          const cfg = typeConfig[n.type] || { icon:"🔔", color:"var(--text-2)", bg:"var(--surface-2)" };
          const isFirst = i === 0 || notifs[i-1].read !== n.read;
          return (
            <React.Fragment key={n.id}>
              {isFirst && !n.read && unread > 0 && i === 0 &&
                <div style={nxStyles.groupLabel}>New</div>}
              {isFirst && n.read && notifs.findIndex(x=>!x.read) < i &&
                <div style={nxStyles.groupLabel}>Earlier</div>}
              <div style={{...nxStyles.card,...(!n.read?nxStyles.cardUnread:{})}}
                onClick={() => markOne(n.id)}>
                <div style={{...nxStyles.iconBox, background: cfg.bg}}>
                  <span style={{fontSize:20}}>{cfg.icon}</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{...nxStyles.title,...(!n.read?{color:"var(--text-1)",fontWeight:800}:{color:"var(--text-2)",fontWeight:600})}}>
                    {n.title}
                  </div>
                  <div style={nxStyles.message}>{n.message}</div>
                  <div style={nxStyles.time}>{n.time}</div>
                </div>
                {!n.read && <div style={{...nxStyles.dot, background: cfg.color}}/>}
              </div>
            </React.Fragment>
          );
        })}
        {notifs.every(n=>n.read) && (
          <div style={nxStyles.emptyState}>
            <div style={nxStyles.emptyIcon}>🔔</div>
            <div style={nxStyles.emptyTitle}>You're all caught up</div>
            <div style={nxStyles.emptySubtitle}>No new notifications right now</div>
          </div>
        )}
        <div style={{height:20}}/>
      </div>
    </div>
  );
}

const nxStyles = {
  root: { height:"100%",display:"flex",flexDirection:"column",background:"var(--bg)" },
  scroll: { flex:1,overflowY:"auto",padding:"8px 0" },
  groupLabel: {
    fontSize:11,fontWeight:800,color:"var(--text-3)",
    letterSpacing:0.5,padding:"10px 16px 6px",textTransform:"uppercase",
  },
  card: {
    display:"flex",gap:12,background:"var(--surface)",
    margin:"0 16px 6px",borderRadius:"var(--r-lg)",padding:"14px",
    cursor:"pointer",boxShadow:"var(--sh-xs)",
    transition:"background 0.15s",position:"relative",
  },
  cardUnread: {
    background:"var(--surface)",
    boxShadow:"var(--sh-sm)",
    borderLeft:"3px solid var(--gold)",
  },
  iconBox: {
    width:44,height:44,borderRadius:14,
    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
  },
  title: { fontSize:13,marginBottom:3,lineHeight:1.4 },
  message: { fontSize:12,color:"var(--text-2)",lineHeight:1.45,marginBottom:4 },
  time: { fontSize:10,color:"var(--text-3)",fontWeight:500 },
  dot: {
    width:8,height:8,borderRadius:"50%",
    flexShrink:0,alignSelf:"center",
  },
  markBtn: {
    background:"none",border:"none",color:"var(--gold)",
    fontSize:12,fontWeight:800,cursor:"pointer",padding:"4px 8px",
  },
  emptyState: {
    display:"flex",flexDirection:"column",alignItems:"center",
    padding:"60px 24px",gap:10,
  },
  emptyIcon: { fontSize:48,filter:"grayscale(0.3)" },
  emptyTitle: { fontSize:16,fontWeight:800,color:"var(--text-1)" },
  emptySubtitle: { fontSize:13,color:"var(--text-3)" },
};

Object.assign(window, { ScreenNotifications });
