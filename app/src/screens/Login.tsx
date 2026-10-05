import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useStatusTheme, useStore } from "../lib/store";
import type { Tower } from "../lib/types";
import { ErrorText, TwinTowersLogo, useToast, type Styles } from "../components/shared";

type Step = "landing" | "email" | "otp" | "profile";
const RESEND_SECONDS = 60;

export default function ScreenLogin({ initialStep = "landing" }: { initialStep?: Step }) {
  const { profile, saveProfile } = useStore();
  const toast = useToast();
  const [step, setStep] = useState<Step>(initialStep);
  const [channel, setChannel] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [name, setName] = useState(profile?.name ?? "");
  const [tower, setTower] = useState<Tower | "">(profile?.tower ?? "");
  const [flat, setFlat] = useState(profile?.flat ?? "");

  useStatusTheme("dark");

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    if (step === "otp") otpRefs.current[0]?.focus();
  }, [step]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const target = channel === "phone" ? `+91 ${phone}` : email;

  const sendOTP = async () => {
    if (channel === "phone" ? phone.length < 10 : !emailValid) return;
    setLoading(true);
    setError(null);
    const { error } = channel === "phone"
      ? await supabase.auth.signInWithOtp({ phone: `+91${phone}` })
      : await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setOtp(["", "", "", "", "", ""]);
    setResendIn(RESEND_SECONDS);
    setStep("otp");
  };

  const handleOtp = (val: string, i: number) => {
    // Accept a full pasted / autofilled code in any box
    const digits = val.replace(/\D/g, "");
    if (digits.length > 1) {
      const n = [...otp];
      digits.slice(0, 6 - i).split("").forEach((d, k) => { n[i + k] = d; });
      setOtp(n);
      otpRefs.current[Math.min(i + digits.length, 5)]?.focus();
      return;
    }
    if (!/^\d?$/.test(val)) return;
    const n = [...otp]; n[i] = val; setOtp(n);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const verify = async () => {
    setLoading(true);
    setError(null);
    const token = otp.join("");
    const { error } = channel === "phone"
      ? await supabase.auth.verifyOtp({ phone: `+91${phone}`, token, type: "sms" })
      : await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (error) {
      setLoading(false);
      setError(error.message);
    }
    // On success the store picks up the session and App moves on.
  };

  const submitProfile = async () => {
    if (!name.trim() || !tower || !flat.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await saveProfile({ name: name.trim(), tower, flat: flat.trim().toUpperCase() });
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  const otpFull = otp.every((d) => d !== "");
  const profileValid = name.trim() && tower && flat.trim();

  return (
    <div style={lg.root}>
      {/* Hero area — community logo visible here */}
      <div style={lg.hero}>
        <div style={lg.heroGlow} />
        <div style={lg.logoWrap}>
          <TwinTowersLogo size={72} />
        </div>
        <div style={lg.heroTitle}>TWIN TOWERS</div>
        <div style={lg.heroBy}>
          <span style={lg.heroByDot} />
          <span>by Namishree</span>
          <span style={lg.heroByDot} />
        </div>
        <div style={lg.heroTagline}>Your Community, Connected.</div>
      </div>

      {/* Card */}
      <div style={lg.card}>
        {(step === "landing" || step === "email") && (
          <div key={step} style={{ animation: "fadeUp 0.3s both" }}>
            <div style={lg.cardTitle}>Welcome back</div>
            <div style={lg.cardSub}>
              {step === "landing"
                ? "Sign in with your registered mobile number"
                : "Sign in with your email — we'll send you a 6-digit code"}
            </div>

            {step === "landing" ? (
              <div style={lg.phoneWrap}>
                <div style={lg.countryPill}>🇮🇳 +91</div>
                <input
                  style={lg.phoneInput}
                  type="tel" inputMode="numeric" autoComplete="tel-national"
                  maxLength={10} placeholder="Mobile number" aria-label="Mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && sendOTP()}
                />
              </div>
            ) : (
              <div style={lg.phoneWrap}>
                <input
                  style={lg.phoneInput}
                  type="email" autoComplete="email" placeholder="you@example.com" aria-label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  onKeyDown={(e) => e.key === "Enter" && sendOTP()}
                />
              </div>
            )}

            {(() => {
              const ready = step === "landing" ? phone.length === 10 : emailValid;
              return (
                <button className="tap" style={{ ...lg.primaryBtn, opacity: ready ? 1 : 0.55 }}
                  onClick={sendOTP} disabled={!ready || loading}>
                  {loading
                    ? <span style={lg.spinner} />
                    : <><span>Continue</span><span style={{ marginLeft: 8 }}>→</span></>}
                </button>
              );
            })()}
            {error && <ErrorText>{error}</ErrorText>}

            <div style={lg.divider}>
              <div style={lg.divLine} /><span style={lg.divText}>or</span><div style={lg.divLine} />
            </div>

            <button className="tap" style={lg.ghostBtn}
              onClick={() => {
                setError(null);
                const next = step === "landing" ? "email" : "landing";
                setChannel(next === "email" ? "email" : "phone");
                setStep(next);
              }}>
              {step === "landing" ? "Continue with Email" : "Continue with Mobile Number"}
            </button>

            <div style={lg.footerNote}>
              New resident?{" "}
              <span style={lg.link} role="button" tabIndex={0}
                onClick={() => toast("New residents sign in the same way — we'll set up your profile next.")}>
                Register here
              </span>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div style={{ animation: "fadeUp 0.3s both" }}>
            <button style={lg.backPill} onClick={() => { setStep(channel === "phone" ? "landing" : "email"); setError(null); }}>
              ← Back
            </button>
            <div style={lg.cardTitle}>Enter OTP</div>
            <div style={lg.cardSub}>
              Sent to <span style={{ color: "var(--navy)", fontWeight: 700 }}>{target}</span>
            </div>

            <div style={lg.otpRow}>
              {otp.map((d, i) => (
                <input key={i} ref={(el) => { otpRefs.current[i] = el; }}
                  style={{ ...lg.otpBox, ...(d ? { borderColor: "var(--gold)", background: "var(--gold-soft)" } : {}) }}
                  type="tel" inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"}
                  aria-label={`Digit ${i + 1}`}
                  maxLength={i === 0 ? 6 : 1} value={d}
                  onChange={(e) => handleOtp(e.target.value, i)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus();
                    if (e.key === "Enter" && otpFull) verify();
                  }}
                />
              ))}
            </div>

            <div style={lg.resend}>
              Didn't receive it?{" "}
              {resendIn > 0
                ? <span style={{ ...lg.link, color: "var(--text-3)", cursor: "default" }}>Resend in {resendIn}s</span>
                : <span style={lg.link} role="button" tabIndex={0} onClick={sendOTP}>Resend code</span>}
            </div>

            <button className="tap" style={{ ...lg.primaryBtn, opacity: otpFull ? 1 : 0.55 }}
              onClick={verify} disabled={!otpFull || loading}>
              {loading ? <span style={lg.spinner} /> : "Verify & Sign In"}
            </button>
            {error && <ErrorText>{error}</ErrorText>}
          </div>
        )}

        {step === "profile" && (
          <div style={{ animation: "fadeUp 0.3s both" }}>
            <div style={lg.cardTitle}>Complete your profile</div>
            <div style={lg.cardSub}>Tell us where you live so the committee can reach you.</div>

            <input style={{ ...lg.phoneInput, width: "100%", marginBottom: 12 }}
              placeholder="Full name" aria-label="Full name" autoComplete="name"
              value={name} onChange={(e) => setName(e.target.value)} />

            <div style={{ ...lg.phoneWrap, marginBottom: 12 }}>
              {(["Tower A", "Tower B"] as Tower[]).map((t) => (
                <button key={t} type="button"
                  style={{ ...lg.towerBtn, ...(tower === t ? lg.towerBtnActive : {}) }}
                  onClick={() => setTower(t)}>{t}</button>
              ))}
            </div>

            <input style={{ ...lg.phoneInput, width: "100%", marginBottom: 16 }}
              placeholder="Flat number (e.g. A-302)" aria-label="Flat number"
              value={flat} onChange={(e) => setFlat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitProfile()} />

            <button className="tap" style={{ ...lg.primaryBtn, opacity: profileValid ? 1 : 0.55 }}
              onClick={submitProfile} disabled={!profileValid || loading}>
              {loading ? <span style={lg.spinner} /> : <><span>Save & Continue</span><span style={{ marginLeft: 8 }}>→</span></>}
            </button>
            {error && <ErrorText>{error}</ErrorText>}
          </div>
        )}
      </div>

      <div style={lg.versionNote}>Twin Towers Community App · v2.0</div>
    </div>
  );
}

const lg: Styles = {
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
    top: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none",
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
  heroTitle: { fontSize: 24, fontWeight: 800, letterSpacing: 5, color: "var(--gold)", marginBottom: 6 },
  heroBy: {
    display: "flex", alignItems: "center", gap: 8,
    fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)",
    letterSpacing: 1, marginBottom: 8,
  },
  heroByDot: { width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "inline-block" },
  heroTagline: { fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 },
  card: {
    background: "var(--surface)", borderRadius: "28px 28px 0 0",
    padding: "28px 24px 16px", flex: 1,
    boxShadow: "0 -8px 48px rgba(0,0,0,0.2)",
  },
  cardTitle: { fontSize: 22, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.4, marginBottom: 6 },
  cardSub: { fontSize: 13, color: "var(--text-2)", marginBottom: 24, lineHeight: 1.5 },
  phoneWrap: { display: "flex", gap: 10, marginBottom: 16, alignItems: "center" },
  countryPill: {
    flexShrink: 0, background: "var(--surface-2)", border: "1.5px solid var(--border)",
    borderRadius: "var(--r-md)", padding: "13px 14px", fontSize: 13, fontWeight: 700,
    color: "var(--text-1)",
  },
  phoneInput: {
    flex: 1, minWidth: 0, background: "var(--surface-2)", border: "1.5px solid var(--border)",
    borderRadius: "var(--r-md)", padding: "13px 16px", fontSize: 16,
    fontWeight: 600, color: "var(--text-1)", outline: "none",
    transition: "border-color 0.15s",
  },
  towerBtn: {
    flex: 1, background: "var(--surface-2)", border: "1.5px solid var(--border)",
    borderRadius: "var(--r-md)", padding: "13px 14px", fontSize: 14, fontWeight: 700,
    color: "var(--text-2)", transition: "all 0.15s",
  },
  towerBtnActive: {
    background: "var(--navy)", color: "#fff", borderColor: "var(--navy)",
    boxShadow: "0 2px 8px rgba(27,45,91,0.25)",
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
  divider: { display: "flex", alignItems: "center", gap: 12, margin: "16px 0" },
  divLine: { flex: 1, height: 1, background: "var(--border)" },
  divText: { fontSize: 12, color: "var(--text-3)", fontWeight: 600 },
  footerNote: { textAlign: "center", fontSize: 12, color: "var(--text-2)", marginTop: 20 },
  link: { color: "var(--gold)", fontWeight: 700, cursor: "pointer" },
  backPill: {
    background: "var(--surface-2)", border: "none", borderRadius: 99,
    padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "var(--text-2)",
    cursor: "pointer", marginBottom: 16, display: "inline-block",
  },
  otpRow: { display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 },
  otpBox: {
    width: 46, height: 54, textAlign: "center", fontSize: 22, fontWeight: 800,
    border: "2px solid var(--border)", borderRadius: "var(--r-md)",
    outline: "none", color: "var(--text-1)", background: "var(--surface-2)",
    transition: "border-color 0.15s, background 0.15s", minWidth: 0,
  },
  resend: { textAlign: "center", fontSize: 12, color: "var(--text-2)", marginBottom: 16 },
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
