// ============================================================
// POLLS v2
// ============================================================
function ScreenPolls({ goBack, data }) {
  const [polls, setPolls] = React.useState(data.polls);
  const [selected, setSelected] = React.useState(null);
  const [showInfo, setShowInfo] = React.useState(false);
  const [voting, setVoting] = React.useState(null);

  React.useEffect(() => { window.setStatusTheme?.("light"); }, []);

  function castVote(pollId, optIdx) {
    setVoting(optIdx);
    setTimeout(() => {
      setPolls(prev => prev.map(p => {
        if (p.id !== pollId || p.userVoted !== null || p.status !== "active") return p;
        const nv = [...p.votes]; nv[optIdx]++;
        return {...p, votes: nv, userVoted: optIdx};
      }));
      setSelected(s => {
        if (!s || s.id !== pollId) return s;
        const nv = [...s.votes]; nv[optIdx]++;
        return {...s, votes: nv, userVoted: optIdx};
      });
      setVoting(null);
    }, 600);
  }

  const active = polls.filter(p => p.status === "active");
  const upcoming = polls.filter(p => p.status === "upcoming");
  const closed = polls.filter(p => p.status === "closed");

  if (selected) {
    const poll = polls.find(p => p.id === selected.id) || selected;
    const total = poll.votes.reduce((a,b)=>a+b,0);
    const canVote = poll.status === "active" && poll.userVoted === null;
    const maxVotes = Math.max(...poll.votes);

    return (
      <div style={vxStyles.root}>
        <ScreenHeader title="Poll" onBack={() => setSelected(null)}/>
        <div style={vxStyles.scroll}>
          {/* Poll header */}
          <div style={vxStyles.pollHeader}>
            <div style={vxStyles.pollStatusRow}>
              <span style={{...vxStyles.statusBadge,
                background: poll.status==="active"?"var(--success-bg)":poll.status==="upcoming"?"var(--info-bg)":"var(--surface-2)",
                color: poll.status==="active"?"var(--success)":poll.status==="upcoming"?"var(--info)":"var(--text-3)"}}>
                {poll.status==="active"?"● Live":poll.status==="upcoming"?"⏳ Upcoming":"✓ Closed"}
              </span>
              {poll.userVoted !== null &&
                <span style={vxStyles.votedBadge}>✓ You voted</span>}
            </div>
            <div style={vxStyles.pollTitle}>{poll.title}</div>
            <div style={vxStyles.pollDesc}>{poll.description}</div>
            <div style={vxStyles.pollMeta}>
              <span>📅 {poll.startDate} – {poll.endDate}</span>
              <span>👥 {poll.eligibleVoters}</span>
            </div>
          </div>

          {/* Options */}
          <div style={vxStyles.sectionLabel}>
            {canVote ? "Cast your vote" : `Results · ${total} votes`}
          </div>
          {poll.options.map((opt, i) => {
            const pct = total > 0 ? Math.round((poll.votes[i]/total)*100) : 0;
            const isWinner = !canVote && poll.votes[i] === maxVotes && maxVotes > 0;
            const isUserVote = poll.userVoted === i;
            const isVoting = voting === i;
            return (
              <div key={i}
                style={{...vxStyles.optCard,
                  ...(isUserVote?{borderColor:"var(--gold)",borderWidth:2}:{}),
                  ...(isWinner&&!canVote?{background:"var(--gold-soft)"}:{})}}
                onClick={() => canVote && !voting && castVote(poll.id, i)}>
                <div style={vxStyles.optTop}>
                  <div style={vxStyles.optLabel}>{opt}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    {isWinner && !canVote && <span style={vxStyles.winBadge}>Leading</span>}
                    {isUserVote && <span style={vxStyles.myBadge}>✓ You</span>}
                    {isVoting && <span style={vxStyles.spinnerSmall}/>}
                  </div>
                </div>
                {!canVote && (
                  <div style={vxStyles.optBar}>
                    <div style={vxStyles.optBarBg}>
                      <div style={{...vxStyles.optBarFill,
                        width:`${pct}%`,
                        background: isWinner?"var(--gold)":"var(--navy)",
                        opacity: isWinner?1:0.5}}/>
                    </div>
                    <div style={vxStyles.optPct}>{pct}%</div>
                  </div>
                )}
                {canVote && (
                  <div style={vxStyles.optVoteHint}>Tap to select this option</div>
                )}
              </div>
            );
          })}

          <div style={vxStyles.pollFooter}>
            <div style={vxStyles.participation}>
              <div style={vxStyles.partNum}>{total}</div>
              <div style={vxStyles.partLabel}>of {poll.totalEligible} eligible voters</div>
            </div>
            {canVote && <div style={vxStyles.anonNote}>🔒 Your vote is anonymous</div>}
          </div>
          <div style={{height:20}}/>
        </div>
      </div>
    );
  }

  return (
    <div style={vxStyles.root}>
      <ScreenHeader title="Polls" onBack={goBack} onInfo={() => setShowInfo(true)}/>
      <div style={vxStyles.scroll}>
        {active.length > 0 && <>
          <div style={vxStyles.sectionLabel}>Active Now</div>
          {active.map(p => <PollCardV2 key={p.id} poll={p} onTap={() => setSelected(p)}/>)}
        </>}
        {upcoming.length > 0 && <>
          <div style={vxStyles.sectionLabel}>Upcoming</div>
          {upcoming.map(p => <PollCardV2 key={p.id} poll={p} onTap={() => setSelected(p)}/>)}
        </>}
        {closed.length > 0 && <>
          <div style={vxStyles.sectionLabel}>Past Polls</div>
          {closed.map(p => <PollCardV2 key={p.id} poll={p} onTap={() => setSelected(p)}/>)}
        </>}
        <div style={{height:20}}/>
      </div>
      {showInfo && <InfoModal title="Polls & Voting" onClose={() => setShowInfo(false)} lines={[
        "Community decisions made democratically.",
        "Core committee creates and manages polls.",
        "Voting is anonymous — only totals are shown to residents.",
        "One vote per resident per poll. No changes after close.",
        "Results visible to all once the poll ends.",
      ]}/>}
    </div>
  );
}

function PollCardV2({ poll, onTap }) {
  const total = poll.votes.reduce((a,b)=>a+b,0);
  const participation = poll.totalEligible > 0 ? Math.round((total/poll.totalEligible)*100) : 0;
  const sBg = poll.status==="active"?"var(--success-bg)":poll.status==="upcoming"?"var(--info-bg)":"var(--surface-2)";
  const sFg = poll.status==="active"?"var(--success)":poll.status==="upcoming"?"var(--info)":"var(--text-3)";

  return (
    <div style={vxStyles.pollCard} onClick={onTap}>
      <div style={vxStyles.pollCardHead}>
        <span style={{...vxStyles.statusBadge,background:sBg,color:sFg}}>
          {poll.status==="active"?"● Live":poll.status==="upcoming"?"⏳ Soon":"✓ Closed"}
        </span>
        {poll.userVoted !== null && <span style={vxStyles.votedBadge}>✓ Voted</span>}
      </div>
      <div style={vxStyles.pollCardTitle}>{poll.title}</div>
      <div style={vxStyles.pollCardMeta}>
        <span>📅 Ends {poll.endDate}</span>
        <span>{total} votes · {participation}% participation</span>
      </div>
      {poll.status !== "upcoming" && (
        <div style={vxStyles.miniBar}>
          {poll.options.map((opt,i) => {
            const pct = total > 0 ? (poll.votes[i]/total)*100 : 33.3;
            const colors = ["var(--gold)","var(--navy)","var(--text-3)"];
            return <div key={i} style={{flex:pct,height:"100%",background:colors[i%3],opacity:i===0?1:0.5}}/>;
          })}
        </div>
      )}
    </div>
  );
}

const vxStyles = {
  root: { height:"100%",display:"flex",flexDirection:"column",background:"var(--bg)" },
  scroll: { flex:1,overflowY:"auto" },
  sectionLabel: {
    fontSize:11,fontWeight:800,color:"var(--text-3)",letterSpacing:0.5,
    padding:"14px 16px 8px",textTransform:"uppercase",
  },
  pollCard: {
    background:"var(--surface)",margin:"0 16px 10px",
    borderRadius:"var(--r-lg)",padding:"16px",cursor:"pointer",
    boxShadow:"var(--sh-sm)",
  },
  pollCardHead: { display:"flex",gap:8,alignItems:"center",marginBottom:10 },
  statusBadge: { fontSize:10,fontWeight:700,borderRadius:99,padding:"3px 10px",letterSpacing:0.2 },
  votedBadge: { fontSize:10,fontWeight:700,color:"var(--success)",background:"var(--success-bg)",borderRadius:99,padding:"3px 9px" },
  pollCardTitle: { fontSize:14,fontWeight:800,color:"var(--text-1)",marginBottom:8,letterSpacing:-0.2,lineHeight:1.4 },
  pollCardMeta: { display:"flex",flexWrap:"wrap",gap:10,fontSize:11,color:"var(--text-3)",marginBottom:10 },
  miniBar: { display:"flex",height:4,borderRadius:99,overflow:"hidden",gap:1 },
  pollHeader: {
    background:"var(--surface)",margin:"12px 16px",
    borderRadius:"var(--r-lg)",padding:"18px",
    boxShadow:"var(--sh-sm)",
  },
  pollStatusRow: { display:"flex",gap:8,alignItems:"center",marginBottom:10 },
  pollTitle: { fontSize:18,fontWeight:800,color:"var(--text-1)",letterSpacing:-0.3,marginBottom:8,lineHeight:1.3 },
  pollDesc: { fontSize:13,color:"var(--text-2)",lineHeight:1.55,marginBottom:10 },
  pollMeta: { display:"flex",flexWrap:"wrap",gap:12,fontSize:11,color:"var(--text-3)" },
  optCard: {
    background:"var(--surface)",margin:"0 16px 8px",
    borderRadius:"var(--r-md)",padding:"14px 16px",
    cursor:"pointer",boxShadow:"var(--sh-xs)",
    border:"1.5px solid transparent",transition:"all 0.2s",
  },
  optTop: { display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:8 },
  optLabel: { fontSize:14,fontWeight:700,color:"var(--text-1)",flex:1 },
  winBadge: { fontSize:10,fontWeight:800,color:"var(--gold)",background:"var(--gold-soft)",borderRadius:99,padding:"3px 9px" },
  myBadge: { fontSize:10,fontWeight:800,color:"var(--success)",background:"var(--success-bg)",borderRadius:99,padding:"3px 9px" },
  spinnerSmall: { display:"inline-block",width:14,height:14,border:"2px solid rgba(0,0,0,0.1)",borderTopColor:"var(--gold)",borderRadius:"50%",animation:"spin 0.6s linear infinite" },
  optBar: { display:"flex",alignItems:"center",gap:10 },
  optBarBg: { flex:1,height:7,background:"var(--surface-2)",borderRadius:99,overflow:"hidden" },
  optBarFill: { height:"100%",borderRadius:99,transition:"width 0.5s cubic-bezier(0.34,1.1,0.64,1)" },
  optPct: { fontSize:13,fontWeight:800,color:"var(--text-2)",minWidth:34,textAlign:"right" },
  optVoteHint: { fontSize:11,color:"var(--text-3)" },
  pollFooter: { padding:"8px 16px 0",display:"flex",justifyContent:"space-between",alignItems:"center" },
  participation: { display:"flex",alignItems:"baseline",gap:4 },
  partNum: { fontSize:22,fontWeight:800,color:"var(--text-1)" },
  partLabel: { fontSize:11,color:"var(--text-3)" },
  anonNote: { fontSize:11,color:"var(--text-3)" },
};

Object.assign(window, { ScreenPolls });
