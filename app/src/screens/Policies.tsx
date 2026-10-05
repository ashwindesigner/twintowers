import { useState } from "react";
import { useData, useStatusTheme } from "../lib/store";
import { InfoModal, ScreenHeader, useToast, type Styles } from "../components/shared";
import type { CommunityPolicy } from "../lib/types";
import type { NavProps } from "./nav";

const ACCENT_COLORS = ["#1B3A6B", "#1a5c3a", "#6b3a1a", "#3a1a6b", "#1a4a5c"];

function DownloadButton({ label }: { label: string }) {
  const toast = useToast();
  return (
    <button className="tap" style={px.downloadBtn} onClick={() => toast("The by-laws PDF will be available soon")}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}

export default function ScreenPolicies({ goBack }: NavProps) {
  const { policies } = useData();
  const [selected, setSelected] = useState<CommunityPolicy | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  useStatusTheme("light");

  if (selected) {
    return (
      <div style={px.root}>
        <ScreenHeader title={selected.category} onBack={() => setSelected(null)} />
        <div style={px.scroll}>
          <div style={px.detailHero}>
            <div style={px.heroEmoji}>{selected.icon}</div>
            <div style={px.heroTitle}>{selected.category} Rules</div>
            <div style={px.heroSub}>Twin Towers · Updated Apr 2026</div>
          </div>
          <div style={px.rulesList}>
            {selected.rules.map((r, i) => (
              <div key={i} style={px.ruleCard}>
                <div style={px.ruleNum}>{String(i + 1).padStart(2, "0")}</div>
                <div style={px.ruleText}>{r}</div>
              </div>
            ))}
          </div>
          <DownloadButton label="Download Full By-Laws PDF" />
          <div style={{ height: 24 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={px.root}>
      <ScreenHeader title="Policies & Rules" onBack={goBack} onInfo={() => setShowInfo(true)} />
      <div style={px.scroll}>
        <div style={px.heroBanner}>
          <div style={px.heroBannerGlow} />
          <div style={px.heroBannerTitle}>Community Guidelines</div>
          <div style={px.heroBannerSub}>
            Rules that help us maintain a safe, peaceful and harmonious community for everyone at Twin Towers.
          </div>
        </div>
        {policies.map((p, i) => (
          <div key={p.id} className="tap" style={px.catCard} onClick={() => setSelected(p)}>
            <div style={{ ...px.catIconBox, background: ACCENT_COLORS[i % ACCENT_COLORS.length] }}>
              <span style={{ fontSize: 24 }}>{p.icon}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={px.catName}>{p.category}</div>
              <div style={px.catCount}>{p.rules.length} rules</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="var(--text-3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
        <DownloadButton label="Download Full Community By-Laws" />
        <div style={{ height: 24 }} />
      </div>
      {showInfo && <InfoModal title="Policies & Rules" onClose={() => setShowInfo(false)} lines={[
        "Official community rules approved by the RWA committee.",
        "Updated after resident polls or Annual General Meeting.",
        "Repeat violations may result in fines as per the by-laws.",
        "Full PDF available for download from this section.",
      ]} />}
    </div>
  );
}

const px: Styles = {
  root: { height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" },
  scroll: { flex: 1, overflowY: "auto" },
  heroBanner: {
    background: "var(--navy)", margin: "12px 16px", borderRadius: "var(--r-xl)", padding: "22px 20px",
    position: "relative", overflow: "hidden",
  },
  heroBannerGlow: {
    position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,168,76,0.25) 0%, transparent 70%)", pointerEvents: "none",
  },
  heroBannerTitle: { fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: -0.3, marginBottom: 8, position: "relative" },
  heroBannerSub: { fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, position: "relative" },
  catCard: {
    display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", margin: "0 16px 10px",
    borderRadius: "var(--r-lg)", padding: "14px", cursor: "pointer", boxShadow: "var(--sh-sm)",
  },
  catIconBox: { width: 52, height: 52, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  catName: { fontSize: 14, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.2 },
  catCount: { fontSize: 11, color: "var(--text-3)", marginTop: 3 },
  detailHero: { display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 16px 20px", gap: 8 },
  heroEmoji: { fontSize: 56 },
  heroTitle: { fontSize: 20, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.3 },
  heroSub: { fontSize: 11, color: "var(--text-3)" },
  rulesList: { padding: "0 16px" },
  ruleCard: {
    display: "flex", gap: 14, background: "var(--surface)", borderRadius: "var(--r-md)", padding: "14px",
    marginBottom: 8, boxShadow: "var(--sh-xs)", alignItems: "flex-start",
  },
  ruleNum: { fontSize: 12, fontWeight: 800, color: "var(--gold)", flexShrink: 0, minWidth: 24, paddingTop: 1 },
  ruleText: { fontSize: 13, color: "var(--text-1)", lineHeight: 1.55, flex: 1 },
  downloadBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", width: "calc(100% - 32px)",
    margin: "12px 16px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)",
    padding: "14px", fontSize: 13, fontWeight: 700, color: "var(--navy)", cursor: "pointer", boxShadow: "var(--sh-xs)",
  },
};
