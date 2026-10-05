import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import * as api from "./api";
import type { Booking, CommunityData, Issue, Priority, Profile, Tower } from "./types";

interface Store {
  session: Session | null;
  profile: Profile | null;
  data: CommunityData | null;
  /** True until the initial session check (and data load, when signed in) completes. */
  loading: boolean;
  error: string | null;
  /** Bumps each time live updates refresh the data; screens with their own fetches watch it. */
  liveVersion: number;
  reload: () => Promise<void>;
  signOut: () => Promise<void>;
  saveProfile: (patch: { name: string; flat: string; tower: Tower }) => Promise<void>;
  createIssue: (form: { category: string; area: string; priority: Priority; description: string }) => Promise<Issue>;
  addComment: (issueId: string, text: string) => Promise<void>;
  toggleEventRegistration: (eventId: string) => Promise<void>;
  bookSlot: (facility: { id: string; name: string }, date: string, start: string, end: string) => Promise<Booking>;
  castVote: (pollId: string, optionIdx: number) => Promise<void>;
  markRead: (ids: string[]) => Promise<void>;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [data, setData] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user.id ?? null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession((prev) => (prev?.user.id === s?.user.id && prev?.access_token === s?.access_token ? prev : s));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = useCallback(async (uid: string) => {
    setError(null);
    try {
      const [p, d] = await Promise.all([api.fetchProfile(uid), api.fetchCommunity()]);
      setProfile(p);
      setData(d);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      load(userId);
    } else {
      setProfile(null);
      setData(null);
    }
  }, [userId, load]);

  // ── Live updates ─────────────────────────────────────────
  // The database broadcasts a "changed" signal on the private `community` topic
  // whenever community data is written (see migration *_realtime_broadcast.sql).
  // We refetch through the normal RLS-filtered queries, debounced so a burst of
  // writes costs one reload. Returning to the app also refreshes, which covers
  // anything missed while the phone was asleep or the socket was down.
  const [liveVersion, setLiveVersion] = useState(0);
  useEffect(() => {
    if (!userId) return;
    let timer: number | undefined;
    let cancelled = false;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(async () => {
        try {
          const fresh = await api.fetchCommunity();
          if (cancelled) return;
          setData(fresh);
          setLiveVersion((v) => v + 1);
        } catch {
          // Keep showing the last good data; the next signal or focus retries.
        }
      }, 400);
    };

    const channel = supabase.channel("community", { config: { private: true } });
    supabase.realtime.setAuth().then(() => {
      if (cancelled) return;
      channel
        .on("broadcast", { event: "change" }, refresh)
        .subscribe((status) => {
          // After a reconnect, catch up on whatever changed while offline
          if (status === "SUBSCRIBED") refresh();
        });
    });

    const onVisible = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const requireProfile = () => {
    if (!profile) throw new Error("Not signed in");
    return profile;
  };

  const store: Store = {
    session,
    profile,
    data,
    loading,
    error,
    liveVersion,
    reload: async () => {
      if (userId) await load(userId);
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
    saveProfile: async (patch) => {
      setProfile(await api.updateProfile(requireProfile().id, patch));
    },
    createIssue: async (form) => {
      const issue = await api.createIssue(requireProfile(), form);
      setData((d) => d && { ...d, issues: [issue, ...d.issues] });
      return issue;
    },
    addComment: async (issueId, text) => {
      const c = await api.addComment(requireProfile(), issueId, text);
      setData((d) => d && {
        ...d,
        issues: d.issues.map((i) => (i.id === issueId ? { ...i, comments: [...i.comments, c] } : i)),
      });
    },
    toggleEventRegistration: async (eventId) => {
      const ev = data?.events.find((e) => e.id === eventId);
      if (!ev) return;
      const register = !ev.registeredByMe;
      await api.setEventRegistration(requireProfile().id, eventId, register);
      setData((d) => d && {
        ...d,
        events: d.events.map((e) =>
          e.id === eventId
            ? { ...e, registeredByMe: register, registered: e.registered + (register ? 1 : -1) }
            : e
        ),
      });
    },
    bookSlot: async (facility, date, start, end) => {
      const booking = await api.bookSlot(requireProfile(), facility, date, start, end);
      setData((d) => d && {
        ...d,
        myBookings: [...d.myBookings, booking].sort((a, b) =>
          (a.date + a.startTime).localeCompare(b.date + b.startTime)
        ),
      });
      // The booking trigger adds a confirmation notification server-side
      api.fetchCommunity().then(
        (fresh) => setData((d) => d && { ...d, notifications: fresh.notifications }),
        () => {}
      );
      return booking;
    },
    castVote: async (pollId, optionIdx) => {
      await api.castVote(requireProfile().id, pollId, optionIdx);
      setData((d) => d && {
        ...d,
        polls: d.polls.map((p) => {
          if (p.id !== pollId) return p;
          const votes = [...p.votes];
          votes[optionIdx]++;
          return { ...p, votes, userVoted: optionIdx };
        }),
      });
    },
    markRead: async (ids) => {
      if (ids.length === 0) return;
      setData((d) => d && {
        ...d,
        notifications: d.notifications.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)),
      });
      await api.markNotificationsRead(requireProfile().id, ids);
    },
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const s = useContext(StoreContext);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}

/** Community data for signed-in screens (App only renders them once it's loaded). */
export function useData(): CommunityData {
  const { data } = useStore();
  if (!data) throw new Error("Community data not loaded");
  return data;
}

// ── Status-bar theme (replaces the prototype's window.setStatusTheme) ──
export type StatusTheme = "dark" | "light";
/** `color` paints the status bar to match a full-bleed hero (and leaves the home indicator light). */
export interface StatusBarStyle { theme: StatusTheme; color?: string }
export const StatusThemeContext = createContext<(s: StatusBarStyle) => void>(() => {});

export function useStatusTheme(theme: StatusTheme, color?: string) {
  const set = useContext(StatusThemeContext);
  useEffect(() => set({ theme, color }), [set, theme, color]);
}
