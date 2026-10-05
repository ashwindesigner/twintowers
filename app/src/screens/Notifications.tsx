import { Fragment } from "react";
import { useData, useStatusTheme, useStore } from "../lib/store";
import { ScreenHeader, type Styles } from "../components/shared";
import type { NotificationType } from "../lib/types";
import type { NavProps } from "./nav";

const TYPE_CONFIG: Record<NotificationType, { icon: string; color: string; bg: string }> = {
  issue: { icon: "📋", color: "var(--danger)", bg: "var(--danger-bg)" },
  maintenance: { icon: "🔧", color: "var(--info)", bg: "var(--info-bg)" },
  booking: { icon: "📅", color: "var(--success)", bg: "var(--success-bg)" },
  poll: { icon: "🗳️", color: "var(--navy)", bg: "var(--navy-soft)" },
  event: { icon: "🎉", color: "var(--gold)", bg: "var(--gold-soft)" },
  alert: { icon: "⚠️", color: "var(--warning)", bg: "var(--warning-bg)" },
};

export default function ScreenNotifications({ goBack }: NavProps) {
  const { notifications: notifs } = useData();
  const { markRead } = useStore();
  useStatusTheme("light");

  const unreadIds = notifs.filter((n) => !n.read).map((n) => n.id);
  const unread = unreadIds.length;
  const firstReadIdx = notifs.findIndex((n) => n.read);

  return (
    <div style={nx.root}>
      <ScreenHeader title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : "All caught up"}
        onBack={goBack}
        right={unread > 0 && <button style={nx.markBtn} onClick={() => markRead(unreadIds)}>Mark all read</button>} />

      <div style={nx.scroll}>
        {notifs.map((n, i) => {
          const cfg = TYPE_CONFIG[n.type] ?? { icon: "🔔", color: "var(--text-2)", bg: "var(--surface-2)" };
          return (
            <Fragment key={n.id}>
              {i === 0 && !n.read && <div style={nx.groupLabel}>New</div>}
              {i === firstReadIdx && i > 0 && <div style={nx.groupLabel}>Earlier</div>}
              <div style={{ ...nx.card, ...(!n.read ? nx.cardUnread : {}) }}
                onClick={() => !n.read && markRead([n.id])}>
                <div style={{ ...nx.iconBox, background: cfg.bg }}>
                  <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...nx.title, ...(!n.read ? { color: "var(--text-1)", fontWeight: 800 } : { color: "var(--text-2)", fontWeight: 600 }) }}>
                    {n.title}
                  </div>
                  <div style={nx.message}>{n.message}</div>
                  <div style={nx.time}>{n.time}</div>
                </div>
                {!n.read && <div style={{ ...nx.dot, background: cfg.color }} />}
              </div>
            </Fragment>
          );
        })}
        {unread === 0 && (
          <div style={nx.emptyState}>
            <div style={nx.emptyIcon}>🔔</div>
            <div style={nx.emptyTitle}>You're all caught up</div>
            <div style={nx.emptySubtitle}>No new notifications right now</div>
          </div>
        )}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

const nx: Styles = {
  root: { height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" },
  scroll: { flex: 1, overflowY: "auto", padding: "8px 0" },
  groupLabel: { fontSize: 11, fontWeight: 800, color: "var(--text-3)", letterSpacing: 0.5, padding: "10px 16px 6px", textTransform: "uppercase" },
  card: {
    display: "flex", gap: 12, background: "var(--surface)", margin: "0 16px 6px", borderRadius: "var(--r-lg)",
    padding: "14px", cursor: "pointer", boxShadow: "var(--sh-xs)", transition: "background 0.15s", position: "relative",
  },
  cardUnread: { background: "var(--surface)", boxShadow: "var(--sh-sm)", borderLeft: "3px solid var(--gold)" },
  iconBox: { width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontSize: 13, marginBottom: 3, lineHeight: 1.4 },
  message: { fontSize: 12, color: "var(--text-2)", lineHeight: 1.45, marginBottom: 4 },
  time: { fontSize: 10, color: "var(--text-3)", fontWeight: 500 },
  dot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, alignSelf: "center" },
  markBtn: { background: "none", border: "none", color: "var(--gold)", fontSize: 12, fontWeight: 800, cursor: "pointer", padding: "4px 8px" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px", gap: 10 },
  emptyIcon: { fontSize: 48, filter: "grayscale(0.3)" },
  emptyTitle: { fontSize: 16, fontWeight: 800, color: "var(--text-1)" },
  emptySubtitle: { fontSize: 13, color: "var(--text-3)" },
};
