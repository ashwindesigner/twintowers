import { Fragment, useState } from "react";
import { useData, useStatusTheme } from "../lib/store";
import { daysUntil } from "../lib/format";
import { InfoModal, ScreenHeader, type Styles } from "../components/shared";
import type { AssetStatus, MaintenanceItem } from "../lib/types";
import type { NavProps } from "./nav";

const STATUS: Record<AssetStatus, { fg: string; bg: string; icon: string; hex: string }> = {
  Good: { fg: "var(--success)", bg: "var(--success-bg)", icon: "✓", hex: "#10B981" },
  Fair: { fg: "var(--warning)", bg: "var(--warning-bg)", icon: "~", hex: "#F59E0B" },
  Poor: { fg: "var(--danger)", bg: "var(--danger-bg)", icon: "!", hex: "#EF4444" },
  "Out of service": { fg: "var(--text-3)", bg: "var(--surface-2)", icon: "?", hex: "#A09FB0" },
};

/** Warranty label: days left when expiring within 90 days, "expired" once past. */
function warranty(expiry: string | null): { soon: boolean; label: string } | null {
  if (!expiry) return null;
  const d = daysUntil(expiry);
  if (d < 0) return { soon: true, label: "expired" };
  if (d < 90) return { soon: true, label: `${d}d` };
  return { soon: false, label: "" };
}

export default function ScreenMaintenance({ goBack }: NavProps) {
  const { maintenanceItems } = useData();
  const [selected, setSelected] = useState<MaintenanceItem | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [showInfo, setShowInfo] = useState(false);
  useStatusTheme("light");

  const tabs = ["All", "Tower A", "Tower B", "Common Areas", "Clubhouse", "Parking"];
  const filtered = activeTab === "All" ? maintenanceItems : maintenanceItems.filter((m) => m.category === activeTab);
  const counts = {
    Good: maintenanceItems.filter((m) => m.status === "Good").length,
    Fair: maintenanceItems.filter((m) => m.status === "Fair").length,
    Poor: maintenanceItems.filter((m) => m.status === "Poor").length,
  };

  // ── DETAIL VIEW ────────────────────────────────────────
  if (selected) {
    const s = STATUS[selected.status];
    const w = warranty(selected.warrantyExpiry);
    const nextSoon = daysUntil(selected.nextCheck) <= 3;
    return (
      <div style={mx.root}>
        <ScreenHeader
          title={selected.name}
          subtitle={`${selected.category} · ${selected.subcategory}`}
          onBack={() => setSelected(null)}
        />
        <div style={mx.scroll}>
          {/* Status hero card */}
          <div style={{ ...mx.heroCard, background: s.bg, borderColor: s.hex + "30" }}>
            <div style={{ ...mx.heroIconCircle, background: s.hex + "18", border: `2px solid ${s.hex}30` }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: s.fg }}>{s.icon}</span>
            </div>
            <div style={mx.heroRight}>
              <div style={mx.heroStatus}>
                <span style={{ ...mx.heroStatusText, color: s.fg }}>{selected.status}</span>
                <span style={mx.heroStatusLabel}>Current Condition</span>
              </div>
              <div style={mx.heroDates}>
                <div style={mx.heroDateItem}>
                  <span style={mx.heroDateLabel}>Last checked</span>
                  <span style={mx.heroDateVal}>{selected.lastInspected}</span>
                </div>
                <div style={mx.heroDivider} />
                <div style={mx.heroDateItem}>
                  <span style={mx.heroDateLabel}>Next check</span>
                  <span style={{
                    ...mx.heroDateVal,
                    color: nextSoon ? "var(--danger)" : "var(--text-1)",
                    fontWeight: nextSoon ? 800 : 700,
                  }}>{selected.nextCheck}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div style={mx.infoGrid}>
            <div style={mx.infoCell}>
              <div style={mx.infoCellLabel}>Assigned To</div>
              <div style={mx.infoCellVal}>{selected.assignedTo.split(" ").slice(0, 2).join(" ")}</div>
            </div>
            {w && (
              <div style={{ ...mx.infoCell, ...(w.soon ? { background: "var(--warning-bg)" } : {}) }}>
                <div style={mx.infoCellLabel}>Warranty Expiry</div>
                <div style={{ ...mx.infoCellVal, color: w.soon ? "var(--warning)" : "var(--text-1)" }}>
                  {selected.warrantyExpiry}
                  {w.soon && <span style={{ fontSize: 10, marginLeft: 4 }}>({w.label})</span>}
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
              const hs = STATUS[h.status] ?? STATUS["Out of service"];
              const isLast = i === selected.history.length - 1;
              const [first, last] = h.inspector.split(" ");
              return (
                <div key={i} style={mx.timelineRow}>
                  <div style={mx.timelineLeft}>
                    <div style={{ ...mx.tlDot, background: hs.fg, boxShadow: `0 0 0 3px ${hs.hex}20` }} />
                    {!isLast && <div style={mx.tlLine} />}
                  </div>
                  <div style={{ ...mx.tlContent, paddingBottom: isLast ? 0 : 16 }}>
                    <div style={mx.tlHeader}>
                      <span style={mx.tlDate}>{h.date}</span>
                      <span style={{ ...mx.tlStatus, color: hs.fg, background: hs.hex + "18" }}>{h.status}</span>
                    </div>
                    <div style={mx.tlNote}>{h.note}</div>
                    <div style={mx.tlBy}>Inspector: {first} {last?.[0]}.</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ height: 24 }} />
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────
  return (
    <div style={mx.root}>
      <ScreenHeader title="Maintenance" onBack={goBack} onInfo={() => setShowInfo(true)} />

      {/* Summary strip */}
      <div style={mx.summaryStrip}>
        {([
          ["Good", counts.Good, "var(--success)", "var(--success-bg)"],
          ["Fair", counts.Fair, "var(--warning)", "var(--warning-bg)"],
          ["Poor", counts.Poor, "var(--danger)", "var(--danger-bg)"],
        ] as const).map(([label, count, fg, bg], i) => (
          <Fragment key={label}>
            {i > 0 && <div style={mx.summaryDivider} />}
            <div style={mx.summaryCell}>
              <div style={{ ...mx.summaryBadge, color: fg, background: bg }}>
                <span style={mx.summaryNum}>{count}</span>
              </div>
              <span style={mx.summaryLabel}>{label}</span>
            </div>
          </Fragment>
        ))}
      </div>

      {/* Scrollable category tabs */}
      <div style={mx.tabStrip}>
        {tabs.map((t) => (
          <button key={t} style={{ ...mx.tabBtn, ...(activeTab === t ? mx.tabBtnActive : {}) }}
            onClick={() => setActiveTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={mx.scroll}>
        {filtered.map((item) => {
          const st = STATUS[item.status] ?? STATUS["Out of service"];
          const w = warranty(item.warrantyExpiry);
          return (
            <div key={item.id} className="tap" style={mx.card} onClick={() => setSelected(item)}>
              <div style={{ ...mx.cardAccent, background: st.fg }} />
              <div style={mx.cardBody}>
                <div style={mx.cardRow1}>
                  <span style={mx.cardCatLabel}>{item.category} · {item.subcategory}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: st.fg, background: st.hex + "18",
                    borderRadius: 99, padding: "3px 10px", letterSpacing: 0.2, flexShrink: 0,
                  }}>{item.status}</span>
                </div>
                <div style={mx.cardName}>{item.name}</div>
                <div style={mx.cardChips}>
                  <div style={mx.chip}>
                    <span style={mx.chipIcon}>👤</span>
                    <span>{item.assignedTo.split(" ")[0]}</span>
                  </div>
                  <div style={mx.chip}>
                    <span style={mx.chipIcon}>📅</span>
                    <span>Next {item.nextCheck}</span>
                  </div>
                  {w?.soon && (
                    <div style={{ ...mx.chip, color: "var(--warning)", background: "var(--warning-bg)" }}>
                      <span>⚠️</span>
                      <span>Warranty {w.label}</span>
                    </div>
                  )}
                </div>
              </div>
              <div style={mx.cardChevron}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="var(--text-3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          );
        })}
        <div style={{ height: 16 }} />
      </div>

      {showInfo && (
        <InfoModal title="Maintenance & Assets" onClose={() => setShowInfo(false)} lines={[
          "Tracks condition of all physical assets across Twin Towers.",
          "Updated weekly by task members; critical items checked daily.",
          "Photos attached with every inspection for a full audit trail.",
          "You're notified when any status changes to Poor or Out of Service.",
          "Tap any item to view full history or raise a linked issue.",
        ]} />
      )}
    </div>
  );
}

const mx: Styles = {
  root: { height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" },
  summaryStrip: {
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--surface)", borderBottom: "1px solid var(--border)",
    padding: "12px 16px", flexShrink: 0, gap: 0,
  },
  summaryCell: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  summaryBadge: { width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" },
  summaryNum: { fontSize: 20, fontWeight: 800, lineHeight: 1 },
  summaryLabel: { fontSize: 10, fontWeight: 700, color: "var(--text-3)", letterSpacing: 0.3 },
  summaryDivider: { width: 1, height: 40, background: "var(--border)", flexShrink: 0, margin: "0 8px" },
  tabStrip: {
    display: "flex", gap: 6, padding: "10px 16px", overflowX: "auto", flexShrink: 0,
    background: "var(--surface)", borderBottom: "1px solid var(--border)", WebkitOverflowScrolling: "touch",
  },
  tabBtn: {
    flexShrink: 0, fontSize: 12, fontWeight: 700, border: "none", borderRadius: 99, padding: "7px 16px",
    background: "var(--surface-2)", color: "var(--text-3)", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
  },
  tabBtnActive: { background: "var(--navy)", color: "#fff", boxShadow: "0 2px 8px rgba(27,45,91,0.25)" },
  scroll: { flex: 1, overflowY: "auto", padding: "12px 16px" },
  card: {
    display: "flex", alignItems: "stretch", background: "var(--surface)", borderRadius: "var(--r-lg)",
    marginBottom: 10, cursor: "pointer", boxShadow: "var(--sh-sm)", overflow: "hidden",
  },
  cardAccent: { width: 4, flexShrink: 0 },
  cardBody: { flex: 1, padding: "13px 12px", minWidth: 0 },
  cardRow1: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 4 },
  cardCatLabel: { fontSize: 10, fontWeight: 700, color: "var(--gold)", letterSpacing: 0.3, textTransform: "uppercase" },
  cardName: { fontSize: 14, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.2, marginBottom: 10, lineHeight: 1.3 },
  cardChips: { display: "flex", flexWrap: "wrap", gap: 6 },
  chip: {
    display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: "var(--text-2)",
    background: "var(--surface-2)", borderRadius: 99, padding: "4px 10px",
  },
  chipIcon: { fontSize: 11 },
  cardChevron: { display: "flex", alignItems: "center", justifyContent: "center", width: 36, flexShrink: 0, paddingRight: 4 },
  heroCard: {
    display: "flex", alignItems: "center", gap: 16, margin: "4px 0 0", borderRadius: "var(--r-xl)",
    padding: "18px 20px", border: "1.5px solid transparent", boxShadow: "var(--sh-sm)",
  },
  heroIconCircle: { width: 64, height: 64, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  heroRight: { flex: 1, minWidth: 0 },
  heroStatus: { marginBottom: 10 },
  heroStatusText: { fontSize: 22, fontWeight: 900, display: "block", letterSpacing: -0.5 },
  heroStatusLabel: { fontSize: 11, color: "var(--text-3)", fontWeight: 600 },
  heroDates: { display: "flex", alignItems: "center", gap: 12 },
  heroDateItem: { display: "flex", flexDirection: "column", gap: 2 },
  heroDateLabel: { fontSize: 9, fontWeight: 700, color: "var(--text-3)", letterSpacing: 0.4, textTransform: "uppercase" },
  heroDateVal: { fontSize: 12, fontWeight: 700, color: "var(--text-1)" },
  heroDivider: { width: 1, height: 28, background: "var(--border)", flexShrink: 0 },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "12px 0 0" },
  infoCell: { background: "var(--surface)", borderRadius: "var(--r-md)", padding: "12px 14px", boxShadow: "var(--sh-xs)" },
  infoCellLabel: { fontSize: 9, fontWeight: 800, color: "var(--text-3)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5 },
  infoCellVal: { fontSize: 13, fontWeight: 700, color: "var(--text-1)" },
  notesCard: { background: "var(--surface)", margin: "10px 0 0", borderRadius: "var(--r-md)", padding: "13px 14px", boxShadow: "var(--sh-xs)" },
  notesCellLabel: { fontSize: 9, fontWeight: 800, color: "var(--text-3)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 },
  notesText: { fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 10px" },
  sectionTitle: { fontSize: 11, fontWeight: 800, color: "var(--text-3)", letterSpacing: 0.5, textTransform: "uppercase" },
  sectionCount: { fontSize: 11, fontWeight: 600, color: "var(--text-3)" },
  timeline: { padding: "0" },
  timelineRow: { display: "flex", gap: 14, alignItems: "stretch" },
  timelineLeft: { display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 10, paddingTop: 3 },
  tlDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  tlLine: { width: 2, flex: 1, background: "var(--border)", marginTop: 4, minHeight: 20 },
  tlContent: { flex: 1, paddingBottom: 16, minWidth: 0 },
  tlHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 5 },
  tlDate: { fontSize: 11, fontWeight: 700, color: "var(--text-2)" },
  tlStatus: { fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "2px 8px", letterSpacing: 0.2 },
  tlNote: {
    fontSize: 13, color: "var(--text-1)", lineHeight: 1.5, marginBottom: 4, background: "var(--surface)",
    borderRadius: "var(--r-md)", padding: "10px 12px", boxShadow: "var(--sh-xs)",
  },
  tlBy: { fontSize: 11, color: "var(--text-3)", marginTop: 4, paddingLeft: 2 },
};
