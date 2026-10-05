// ============================================================
// LOGIN SCREEN v2 — Modern 2025
// ============================================================
function ScreenLogin({ onLogin }) {
  const [step, setStep] = React.useState("landing");
  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState(["","","","","",""]);
  const [loading, setLoading] = React.useState(false);
  const otpRefs = React.useRef([]);

  React.useEffect(() => {
    window.setStatusTheme?.("transparent");
  }, []);

  const sendOTP = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 1000);
  };

  const handleOtp = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const n = [...otp]; n[i] = val; setOtp(n);
    if (val && i < 5) otpRefs.current[i+1]?.focus();
  };

  const verify = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  const otpFull = otp.every(d => d !== "");

  return (
    <div style={lgStyles.root}>
      {/* Hero area */}
      <div style={lgStyles.hero}>
        <div style={lgStyles.heroGlow}/>
        <div style={lgStyles.logoWrap}>
          <TwinTowersLogo size={72} />
        </div>
        <div style={lgStyles.heroTitle}>TWIN TOWERS</div>
        <div style={lgStyles.heroBy}>
          <span style={lgStyles.heroByDot}/>
          <span>by Namishree</span>
          <span style={lgStyles.heroByDot}/>
        </div>
        <div style={lgStyles.heroTagline}>Your Community, Connected.</div>
      </div>

      {/* Card */}
      <div style={lgStyles.card}>
        {step === "landing" && (
          <div style={{animation:"fadeUp 0.3s both"}}>
            <div style={lgStyles.cardTitle}>Welcome back</div>
            <div style={lgStyles.cardSub}>Sign in with your registered mobile number</div>

            <div style={lgStyles.phoneWrap}>
              <div style={lgStyles.countryPill}>🇮🇳 +91</div>
              <input
                style={lgStyles.phoneInput}
                type="tel" maxLength={10} placeholder="Mobile number"
                value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,""))}
              />
            </div>

            <button style={{...lgStyles.primaryBtn, opacity: phone.length<10?0.55:1}}
              onClick={sendOTP} disabled={phone.length<10||loading}>
              {loading
                ? <span style={lgStyles.spinner}/>
                : <><span>Continue</span><span style={{marginLeft:8}}>→</span></>}
            </button>

            <div style={lgStyles.divider}>
              <div style={lgStyles.divLine}/><span style={lgStyles.divText}>or</span><div style={lgStyles.divLine}/>
            </div>

            <button style={lgStyles.ghostBtn}>Continue with Email</button>

            <div style={lgStyles.footerNote}>
              New resident? <span style={lgStyles.link}>Register here</span>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div style={{animation:"fadeUp 0.3s both"}}>
            <button style={lgStyles.backPill} onClick={() => setStep("landing")}>
              ← Back
            </button>
            <div style={lgStyles.cardTitle}>Enter OTP</div>
            <div style={lgStyles.cardSub}>
              Sent to <span style={{color:"var(--navy)",fontWeight:700}}>+91 {phone}</span>
            </div>

            <div style={lgStyles.otpRow}>
              {otp.map((d, i) => (
                <input key={i} ref={el => otpRefs.current[i] = el}
                  style={{...lgStyles.otpBox, ...(d?{borderColor:"var(--gold)",background:"var(--gold-soft)"}:{})}}
                  type="tel" maxLength={1} value={d}
                  onChange={e => handleOtp(e.target.value, i)}
                  onKeyDown={e => { if (e.key==="Backspace"&&!d&&i>0) otpRefs.current[i-1]?.focus(); }}
                />
              ))}
            </div>

            <div style={lgStyles.resend}>
              Didn't receive it? <span style={lgStyles.link}>Resend in 28s</span>
            </div>

            <button style={{...lgStyles.primaryBtn, opacity: otpFull?1:0.55}}
              onClick={verify} disabled={!otpFull||loading}>
              {loading ? <span style={lgStyles.spinner}/> : "Verify & Sign In"}
            </button>

            <div style={lgStyles.demoNote}>Demo: enter any 6 digits to continue</div>
          </div>
        )}
      </div>

      <div style={lgStyles.versionNote}>Twin Towers Community App · v2.0</div>
    </div>
  );
}

const lgStyles = {
  root: {
    height: "100%", display: "flex", flexDirection: "column",
    background: "linear-gradient(180deg, var(--navy) 0%, #0d1e40 50%, var(--bg) 50%)",
    overflowY: "auto",
  },
  hero: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "28px 24px 36px", position: "relative", flexShrink: 0,
  },
  heroGlow: {
    position: "absolute", width: 280, height: 280, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)",
    top: 0, left: "50%", transform: "translateX(-50%)",
    pointerEvents: "none",
  },
  logoWrap: {
    width: 96, height: 96, borderRadius: 28,
    background: "rgba(255,255,255,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(201,168,76,0.3)",
    marginBottom: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  heroTitle: {
    fontSize: 24, fontWeight: 800, letterSpacing: 5,
    color: "var(--gold)", marginBottom: 6,
  },
  heroBy: {
    display: "flex", alignItems: "center", gap: 8,
    fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)",
    letterSpacing: 1, marginBottom: 8,
  },
  heroByDot: {
    width: 3, height: 3, borderRadius: "50%",
    background: "rgba(255,255,255,0.3)", display: "inline-block",
  },
  heroTagline: {
    fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5,
  },
  card: {
    background: "var(--surface)", borderRadius: "28px 28px 0 0",
    padding: "28px 24px 16px", flex: 1,
    boxShadow: "0 -8px 48px rgba(0,0,0,0.2)",
  },
  cardTitle: {
    fontSize: 22, fontWeight: 800, color: "var(--text-1)",
    letterSpacing: -0.4, marginBottom: 6,
  },
  cardSub: { fontSize: 13, color: "var(--text-2)", marginBottom: 24, lineHeight: 1.5 },
  phoneWrap: {
    display: "flex", gap: 10, marginBottom: 16, alignItems: "center",
  },
  countryPill: {
    flexShrink: 0, background: "var(--surface-2)", border: "1.5px solid var(--border)",
    borderRadius: "var(--r-md)", padding: "13px 14px", fontSize: 13, fontWeight: 700,
    color: "var(--text-1)",
  },
  phoneInput: {
    flex: 1, background: "var(--surface-2)", border: "1.5px solid var(--border)",
    borderRadius: "var(--r-md)", padding: "13px 16px", fontSize: 16,
    fontWeight: 600, color: "var(--text-1)", outline: "none",
    transition: "border-color 0.15s",
  },
  primaryBtn: {
    width: "100%", background: "var(--gold)", color: "#fff",
    border: "none", borderRadius: "var(--r-md)", padding: "16px",
    fontSize: 15, fontWeight: 800, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 8, letterSpacing: -0.2, transition: "opacity 0.15s, transform 0.1s",
    boxShadow: "0 4px 20px rgba(201,168,76,0.35)",
  },
  ghostBtn: {
    width: "100%", background: "transparent", color: "var(--navy)",
    border: "1.5px solid var(--border)", borderRadius: "var(--r-md)",
    padding: "15px", fontSize: 14, fontWeight: 700, cursor: "pointer",
    marginTop: 10,
  },
  divider: {
    display: "flex", alignItems: "center", gap: 12, margin: "16px 0",
  },
  divLine: { flex: 1, height: 1, background: "var(--border)" },
  divText: { fontSize: 12, color: "var(--text-3)", fontWeight: 600 },
  footerNote: { textAlign: "center", fontSize: 12, color: "var(--text-2)", marginTop: 20 },
  link: { color: "var(--gold)", fontWeight: 700, cursor: "pointer" },
  backPill: {
    background: "var(--surface-2)", border: "none", borderRadius: 99,
    padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "var(--text-2)",
    cursor: "pointer", marginBottom: 16, display: "inline-block",
  },
  otpRow: {
    display: "flex", gap: 8, justifyContent: "center", marginBottom: 16,
  },
  otpBox: {
    width: 46, height: 54, textAlign: "center", fontSize: 22, fontWeight: 800,
    border: "2px solid var(--border)", borderRadius: "var(--r-md)",
    outline: "none", color: "var(--text-1)", background: "var(--surface-2)",
    transition: "border-color 0.15s, background 0.15s",
  },
  resend: { textAlign: "center", fontSize: 12, color: "var(--text-2)", marginBottom: 16 },
  demoNote: {
    textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 12,
  },
  spinner: {
    display: "inline-block", width: 18, height: 18,
    border: "2.5px solid rgba(255,255,255,0.35)", borderTopColor: "#fff",
    borderRadius: "50%", animation: "spin 0.7s linear infinite",
  },
  versionNote: {
    textAlign: "center", fontSize: 10, color: "rgba(0,0,0,0.25)",
    padding: "10px 0 4px", background: "var(--surface)",
  },
};

Object.assign(window, { ScreenLogin });
