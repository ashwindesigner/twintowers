import { createContext, useCallback, useContext, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { AssetStatus, IssueStatus, Priority } from "../lib/types";

export type Styles = Record<string, CSSProperties>;

// ── Community logo ────────────────────────────────────────
export function TwinTowersLogo({ size = 48, dark = false }: { size?: number; dark?: boolean }) {
  const g = dark ? "#1B2D5B" : "#C9A84C";
  return (
    <svg width={size} height={Math.round(size * 1.05)} viewBox="0 0 100 105" fill="none" role="img" aria-label="Twin Towers logo">
      <rect x="4" y="6" width="92" height="8" rx="2" fill={g} />
      <rect x="12" y="2" width="76" height="6" rx="1.5" fill={g} />
      <rect x="12" y="14" width="28" height="76" rx="2.5" fill={g} />
      <rect x="60" y="14" width="28" height="76" rx="2.5" fill={g} />
      <rect x="44" y="14" width="12" height="76" rx="1.5" fill={g} />
      <rect x="16" y="18" width="20" height="68" rx="1.5" fill="white" opacity="0.18" />
      <rect x="64" y="18" width="20" height="68" rx="1.5" fill="white" opacity="0.18" />
    </svg>
  );
}

// ── Screen Header ─────────────────────────────────────────
export function ScreenHeader({
  title, subtitle, onBack, onInfo, right, transparent,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onInfo?: () => void;
  right?: ReactNode;
  transparent?: boolean;
}) {
  return (
    <div style={{ ...s.header, ...(transparent ? { background: "transparent", boxShadow: "none", borderBottom: "none" } : {}) }}>
      <div style={s.headerLeft}>
        {onBack && (
          <button style={s.backBtn} onClick={onBack} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div>
          <div style={s.headerTitle}>{title}</div>
          {subtitle && <div style={s.headerSub}>{subtitle}</div>}
        </div>
      </div>
      <div style={s.headerRight}>
        {right}
        {onInfo && (
          <button style={s.iconBtn} onClick={onInfo} aria-label="About this section">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 11v5M12 8.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Bottom Sheet Modal ────────────────────────────────────
export function InfoModal({ title, lines, onClose }: { title: string; lines: string[]; onClose: () => void }) {
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.sheet} onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div style={s.sheetHandle} />
        <div style={s.sheetIcon}>ⓘ</div>
        <div style={s.sheetTitle}>{title}</div>
        <div style={s.sheetBody}>
          {lines.map((l, i) => (
            <div key={i} style={s.sheetLine}>
              <div style={s.sheetLineDot} />
              <div style={s.sheetLineText}>{l}</div>
            </div>
          ))}
        </div>
        <button style={s.sheetBtn} onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

// ── Status Chip ───────────────────────────────────────────
export function StatusChip({ status, large, small }: { status: AssetStatus; large?: boolean; small?: boolean }) {
  const map: Record<string, [string, string]> = {
    Good: ["var(--success)", "var(--success-bg)"],
    Fair: ["var(--warning)", "var(--warning-bg)"],
    Poor: ["var(--danger)", "var(--danger-bg)"],
    "Out of service": ["var(--text-3)", "var(--surface-2)"],
  };
  const [fg, bg] = map[status] || ["var(--text-3)", "var(--surface-2)"];
  return (
    <span style={{
      fontSize: large ? 13 : small ? 10 : 11, fontWeight: 700, color: fg, background: bg,
      borderRadius: 999, padding: large ? "5px 14px" : small ? "2px 7px" : "3px 10px",
      letterSpacing: 0.2, flexShrink: 0, display: "inline-block",
    }}>{status}</span>
  );
}

// ── Priority Chip ─────────────────────────────────────────
export function PriorityChip({ priority }: { priority: Priority }) {
  const map: Record<Priority, [string, string]> = {
    High: ["#EF4444", "#FEF2F2"],
    Medium: ["#F59E0B", "#FFFBEB"],
    Low: ["#10B981", "#ECFDF5"],
  };
  const [fg, bg] = map[priority] || ["var(--text-3)", "var(--surface-2)"];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, color: fg, background: bg,
      borderRadius: 999, padding: "3px 9px", letterSpacing: 0.2,
      flexShrink: 0, display: "inline-block",
    }}>{priority}</span>
  );
}

// ── Status color helper ───────────────────────────────────
/** Hex so callers can append alpha (e.g. color + "18"). */
export function statusColor(s: IssueStatus): string {
  if (s === "Open") return "#EF4444";
  if (s === "In Progress") return "#F59E0B";
  if (s === "Resolved") return "#10B981";
  if (s === "On Hold") return "#8B5CF6";
  return "#A09FB0";
}

// ── Form helpers ──────────────────────────────────────────
export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "var(--text-2)",
        marginBottom: 7, letterSpacing: 0.4, textTransform: "uppercase",
      }}>{label}</div>
      {children}
    </label>
  );
}

export function FormSelect({
  label, options, value, onChange,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <FormField label={label}>
      <select style={s.select} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </FormField>
  );
}

export function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      background: "var(--surface)", margin: "0 16px 8px",
      borderRadius: "var(--r-md)", padding: "13px 15px", boxShadow: "var(--sh-xs)",
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: "var(--text-3)",
        marginBottom: 4, letterSpacing: 0.5, textTransform: "uppercase",
      }}>{label}</div>
      <div style={{
        fontSize: 13, color: highlight ? "var(--danger)" : "var(--text-1)",
        fontWeight: highlight ? 700 : 500,
      }}>{value}</div>
    </div>
  );
}

// ── Loading / error states ────────────────────────────────
export function Spinner({ color = "var(--gold)", size = 22 }: { color?: string; size?: number }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      border: "2.5px solid rgba(0,0,0,0.08)", borderTopColor: color,
      borderRadius: "50%", animation: "spin 0.7s linear infinite",
    }} />
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <div role="alert" style={{
      fontSize: 12, fontWeight: 600, color: "var(--danger)", background: "var(--danger-bg)",
      borderRadius: "var(--r-sm)", padding: "9px 12px", marginTop: 10, lineHeight: 1.45,
    }}>{children}</div>
  );
}

// ── Toast ─────────────────────────────────────────────────
const ToastContext = createContext<(msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number>(undefined);
  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 2400);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      {msg && (
        <div key={msg} role="status" style={s.toast}>{msg}</div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// ── Shared styles ─────────────────────────────────────────
const s: Styles = {
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 16px 10px", background: "var(--surface)",
    borderBottom: "1px solid var(--border)", flexShrink: 0, minHeight: 54,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 4, flex: 1, minWidth: 0 },
  headerTitle: { fontSize: 17, fontWeight: 800, color: "var(--text-1)", letterSpacing: -0.3 },
  headerSub: { fontSize: 11, color: "var(--text-3)", marginTop: 1 },
  headerRight: { display: "flex", alignItems: "center", gap: 6 },
  backBtn: {
    width: 36, height: 36, borderRadius: "var(--r-sm)", background: "var(--surface-2)",
    border: "none", display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--text-1)", cursor: "pointer", flexShrink: 0, marginRight: 6,
    transition: "background 0.15s",
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: "var(--r-sm)", background: "var(--surface-2)",
    border: "none", display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--text-2)", cursor: "pointer",
  },
  overlay: {
    position: "absolute", inset: 0, background: "rgba(13,12,20,0.45)",
    display: "flex", alignItems: "flex-end", zIndex: 200,
    backdropFilter: "blur(4px)",
  },
  sheet: {
    background: "var(--surface)", borderRadius: "24px 24px 0 0",
    padding: "8px 20px 32px", width: "100%",
    animation: "slideUp 0.25s cubic-bezier(0.34,1.1,0.64,1) both",
  },
  sheetHandle: { width: 40, height: 4, background: "var(--border)", borderRadius: 99, margin: "8px auto 16px" },
  sheetIcon: { fontSize: 28, textAlign: "center", marginBottom: 8 },
  sheetTitle: { fontSize: 18, fontWeight: 800, color: "var(--text-1)", marginBottom: 16, letterSpacing: -0.3 },
  sheetBody: { marginBottom: 20 },
  sheetLine: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 },
  sheetLineDot: { width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: 5 },
  sheetLineText: { fontSize: 13, color: "var(--text-2)", lineHeight: 1.55, flex: 1 },
  sheetBtn: {
    width: "100%", background: "var(--navy)", color: "#fff",
    border: "none", borderRadius: "var(--r-md)", padding: "15px",
    fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: -0.2,
  },
  select: {
    width: "100%", border: "1.5px solid var(--border)",
    borderRadius: "var(--r-md)", padding: "12px 14px",
    fontSize: 14, color: "var(--text-1)", background: "var(--surface)",
    outline: "none", appearance: "none",
  },
  toast: {
    position: "absolute", left: 16, right: 16, bottom: 96, zIndex: 300,
    background: "var(--navy)", color: "#fff", borderRadius: "var(--r-md)",
    padding: "13px 16px", fontSize: 13, fontWeight: 600, textAlign: "center",
    boxShadow: "var(--sh-lg)", animation: "fadeUp 0.2s both",
  },
};
