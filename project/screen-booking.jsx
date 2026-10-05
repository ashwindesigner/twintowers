// ============================================================
// BOOKING v2
// ============================================================
function ScreenBooking({ navigate, data, goBack }) {
  const [view, setView] = React.useState("list");
  const [facility, setFacility] = React.useState(null);
  const [selDate, setSelDate] = React.useState("2026-04-27");
  const [selSlot, setSelSlot] = React.useState(null);
  const [showInfo, setShowInfo] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);
  const { facilities, bookings } = data;

  React.useEffect(() => { window.setStatusTheme?.(view==="list"?"light":"light"); }, [view]);

  const SLOTS = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];

  const isBooked = slot => bookings.some(b => b.facility===facility?.name && b.date===selDate && b.startTime===slot);
  const myBookings = bookings.filter(b => b.bookedBy==="Ravi Shankar");

  const facilityIcons = {"Badminton Court 1":"🏸","Badminton Court 2":"🏸","Lawn Area":"🌿","Banquet Hall":"🏛️","Club House Room":"🪑"};
  const facilityColors = ["#1B3A6B","#1a5c3a","#6b3a1a","#3a1a6b","#1a4a5c"];

  if (confirmed) {
    return (
      <div style={bxStyles.root}>
        <div style={bxStyles.successScreen}>
          <div style={bxStyles.successRing}>
            <div style={bxStyles.successCheck}>✓</div>
          </div>
          <div style={bxStyles.successTitle}>Booking Confirmed!</div>
          <div style={bxStyles.successCard}>
            <div style={bxStyles.successFac}>{facility?.name}</div>
            <div style={bxStyles.successDate}>{selDate}</div>
            <div style={bxStyles.successSlot}>{selSlot} – {SLOTS[SLOTS.indexOf(selSlot)+1]}</div>
            <div style={bxStyles.bookingId}>
              Booking ID: TT-BK-{Math.floor(Math.random()*9000+1000)}
            </div>
          </div>
          <button style={bxStyles.doneBtn}
            onClick={() => { setConfirmed(false); setView("list"); setSelSlot(null); }}>
            Back to Facilities
          </button>
        </div>
      </div>
    );
  }

  if (view === "slots" && facility) {
    const days = Array.from({length:7},(_,d) => {
      const dt = new Date("2026-04-27"); dt.setDate(dt.getDate()+d);
      return { ds: dt.toISOString().split("T")[0], day: dt.toLocaleString("default",{weekday:"short"}), dd: dt.getDate() };
    });

    return (
      <div style={bxStyles.root}>
        <ScreenHeader title={facility.name} subtitle={facility.charges} onBack={() => setView("list")}/>
        <div style={bxStyles.scroll}>
          {/* Date selector */}
          <div style={bxStyles.dateSection}>
            <div style={bxStyles.sectionLabel}>Select Date</div>
            <div style={bxStyles.dateRow}>
              {days.map(({ds,day,dd}) => (
                <div key={ds}
                  style={{...bxStyles.datePill,...(selDate===ds?bxStyles.datePillActive:{})}}
                  onClick={() => { setSelDate(ds); setSelSlot(null); }}>
                  <div style={{fontSize:9,fontWeight:700,opacity:0.65}}>{day}</div>
                  <div style={{fontSize:18,fontWeight:800}}>{dd}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div style={bxStyles.rulesCard}>
            {facility.rules.map((r,i) => (
              <div key={i} style={bxStyles.ruleRow}>
                <div style={bxStyles.ruleDot}/>
                <div style={bxStyles.ruleText}>{r}</div>
              </div>
            ))}
          </div>

          {/* Slot grid */}
          <div style={bxStyles.sectionLabel}>Available Slots</div>
          <div style={bxStyles.slotGrid}>
            {SLOTS.map(slot => {
              const booked = isBooked(slot);
              const active = selSlot === slot;
              return (
                <div key={slot} style={{...bxStyles.slot,
                  ...(booked?bxStyles.slotBooked:active?bxStyles.slotActive:bxStyles.slotFree)}}
                  onClick={() => !booked && setSelSlot(active?null:slot)}>
                  <div style={{fontSize:12,fontWeight:700}}>{slot}</div>
                  {booked && <div style={{fontSize:9,marginTop:1,opacity:0.7}}>Taken</div>}
                </div>
              );
            })}
          </div>

          {selSlot && (
            <div style={bxStyles.confirmBar}>
              <div>
                <div style={bxStyles.confirmLabel}>Booking Summary</div>
                <div style={bxStyles.confirmTime}>{selDate} · {selSlot} – {SLOTS[SLOTS.indexOf(selSlot)+1]}</div>
              </div>
              <button style={bxStyles.confirmBtn} onClick={() => setConfirmed(true)}>Confirm</button>
            </div>
          )}
          <div style={{height:120}}/>
        </div>
      </div>
    );
  }

  return (
    <div style={bxStyles.root}>
      <ScreenHeader title="Slot Booking" onBack={goBack} onInfo={() => setShowInfo(true)}/>
      <div style={bxStyles.scroll}>
        <div style={bxStyles.sectionLabel}>Facilities</div>
        {facilities.map((f,i) => (
          <div key={f.id} style={bxStyles.facilityCard}
            onClick={() => { setFacility(f); setView("slots"); }}>
            <div style={{...bxStyles.facilityThumb, background: facilityColors[i%facilityColors.length]}}>
              <span style={{fontSize:28}}>{facilityIcons[f.name]||"🏢"}</span>
            </div>
            <div style={{flex:1}}>
              <div style={bxStyles.facilityName}>{f.name}</div>
              <div style={bxStyles.facilityMeta}>Max {f.maxDuration} min · {f.charges}</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="var(--text-3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}

        {myBookings.length > 0 && <>
          <div style={bxStyles.sectionLabel}>My Bookings</div>
          {myBookings.map(b => (
            <div key={b.id} style={bxStyles.myBookingCard}>
              <div style={bxStyles.myBookingIcon}>{facilityIcons[b.facility]||"🏢"}</div>
              <div style={{flex:1}}>
                <div style={bxStyles.myBookingName}>{b.facility}</div>
                <div style={bxStyles.myBookingTime}>{b.date} · {b.startTime}–{b.endTime}</div>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:"var(--success)",background:"var(--success-bg)",borderRadius:99,padding:"3px 9px"}}>
                Confirmed
              </span>
            </div>
          ))}
        </>}
        <div style={{height:24}}/>
      </div>
      {showInfo && <InfoModal title="Slot Booking" onClose={() => setShowInfo(false)} lines={[
        "Book community facilities up to 7 days in advance.",
        "Slots shown in 1-hour blocks; max duration varies by facility.",
        "Max 2 active bookings per flat at any time.",
        "Cancel at least 2 hours before to avoid penalties.",
        "Charges apply for Lawn Area and Banquet Hall.",
      ]}/>}
    </div>
  );
}

const bxStyles = {
  root: { height:"100%",display:"flex",flexDirection:"column",background:"var(--bg)" },
  scroll: { flex:1,overflowY:"auto" },
  sectionLabel: {
    fontSize:11,fontWeight:800,color:"var(--text-3)",letterSpacing:0.5,
    padding:"16px 16px 8px",textTransform:"uppercase",
  },
  facilityCard: {
    display:"flex",alignItems:"center",gap:14,
    background:"var(--surface)",margin:"0 16px 10px",
    borderRadius:"var(--r-lg)",overflow:"hidden",
    cursor:"pointer",boxShadow:"var(--sh-sm)",padding:"0 14px 0 0",
  },
  facilityThumb: {
    width:72,height:72,flexShrink:0,
    display:"flex",alignItems:"center",justifyContent:"center",
  },
  facilityName: { fontSize:14,fontWeight:800,color:"var(--text-1)",letterSpacing:-0.2 },
  facilityMeta: { fontSize:11,color:"var(--text-3)",marginTop:3 },
  myBookingCard: {
    display:"flex",alignItems:"center",gap:12,
    background:"var(--surface)",margin:"0 16px 8px",
    borderRadius:"var(--r-md)",padding:"12px 14px",
    boxShadow:"var(--sh-xs)",
  },
  myBookingIcon: { fontSize:22,flexShrink:0 },
  myBookingName: { fontSize:13,fontWeight:700,color:"var(--text-1)" },
  myBookingTime: { fontSize:11,color:"var(--text-3)",marginTop:2 },
  dateSection: { padding:"0 0 4px" },
  dateRow: { display:"flex",gap:8,padding:"0 16px",overflowX:"auto" },
  datePill: {
    flexShrink:0,width:48,height:60,borderRadius:"var(--r-md)",
    background:"var(--surface)",display:"flex",flexDirection:"column",
    alignItems:"center",justifyContent:"center",cursor:"pointer",
    color:"var(--text-1)",boxShadow:"var(--sh-xs)",transition:"all 0.15s",
  },
  datePillActive: { background:"var(--navy)",color:"#fff" },
  rulesCard: {
    margin:"12px 16px",background:"var(--surface)",
    borderRadius:"var(--r-md)",padding:"14px",
    boxShadow:"var(--sh-xs)",
  },
  ruleRow: { display:"flex",gap:8,alignItems:"flex-start",marginBottom:8 },
  ruleDot: { width:5,height:5,borderRadius:"50%",background:"var(--gold)",flexShrink:0,marginTop:5 },
  ruleText: { fontSize:12,color:"var(--text-2)",lineHeight:1.5 },
  slotGrid: { display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,padding:"0 16px" },
  slot: {
    borderRadius:"var(--r-md)",padding:"11px 4px",textAlign:"center",
    cursor:"pointer",transition:"all 0.15s",
  },
  slotFree: { background:"var(--surface)",color:"var(--text-1)",boxShadow:"var(--sh-xs)" },
  slotBooked: { background:"var(--surface-2)",color:"var(--text-3)",cursor:"not-allowed" },
  slotActive: { background:"var(--gold)",color:"#fff",boxShadow:"0 4px 12px rgba(201,168,76,0.4)" },
  confirmBar: {
    display:"flex",alignItems:"center",justifyContent:"space-between",
    background:"var(--navy)",margin:"16px 16px 0",
    borderRadius:"var(--r-lg)",padding:"16px 18px",
    boxShadow:"var(--sh-md)",
  },
  confirmLabel: { fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.55)",letterSpacing:0.5,marginBottom:4 },
  confirmTime: { fontSize:15,fontWeight:800,color:"#fff",letterSpacing:-0.2 },
  confirmBtn: {
    background:"var(--gold)",color:"#fff",border:"none",
    borderRadius:"var(--r-md)",padding:"12px 20px",
    fontSize:13,fontWeight:800,cursor:"pointer",
    boxShadow:"0 4px 16px rgba(201,168,76,0.4)",
  },
  successScreen: {
    height:"100%",display:"flex",flexDirection:"column",
    alignItems:"center",justifyContent:"center",padding:28,
    background:"var(--bg)",gap:20,
  },
  successRing: {
    width:90,height:90,borderRadius:"50%",
    background:"var(--success-bg)",
    display:"flex",alignItems:"center",justifyContent:"center",
    boxShadow:"0 0 0 8px rgba(16,185,129,0.1)",
  },
  successCheck: { fontSize:40,color:"var(--success)" },
  successTitle: { fontSize:24,fontWeight:800,color:"var(--text-1)",letterSpacing:-0.4 },
  successCard: {
    background:"var(--surface)",borderRadius:"var(--r-xl)",
    padding:"20px 24px",width:"100%",textAlign:"center",
    boxShadow:"var(--sh-sm)",
  },
  successFac: { fontSize:16,fontWeight:800,color:"var(--navy)",marginBottom:6 },
  successDate: { fontSize:13,color:"var(--text-2)",marginBottom:2 },
  successSlot: { fontSize:22,fontWeight:800,color:"var(--text-1)",letterSpacing:-0.4 },
  bookingId: {
    fontSize:11,fontWeight:700,color:"var(--gold)",
    background:"var(--gold-soft)",borderRadius:99,
    padding:"5px 14px",marginTop:12,display:"inline-block",
  },
  doneBtn: {
    background:"var(--navy)",color:"#fff",border:"none",
    borderRadius:"var(--r-md)",padding:"16px 40px",
    fontSize:15,fontWeight:800,cursor:"pointer",
    boxShadow:"var(--sh-md)",
  },
};

Object.assign(window, { ScreenBooking });
