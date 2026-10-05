# Twin Towers Community App

Production implementation of the Claude Design prototype in `../project/Twin Towers App.html`
(React 18 + Vite + TypeScript, backed by Supabase).

Every screen from the prototype is implemented with the v2 design system (Plus Jakarta Sans,
gold `#C9A84C` / navy `#1B2D5B`, the same spacing, radii and shadows): Login, Dashboard,
Maintenance (v3 layout), Issues, Cultural, Slot Booking, Policies, Polls, Core Members and
Notifications.

## Running it

```bash
cd app
cp .env.example .env.local   # Supabase URL + publishable key (safe for browsers; RLS guards data)
npm install
npm run dev                  # http://localhost:5173
npm run build                # type-check + production build to dist/
```

On desktop the app renders inside the iPhone frame from the prototype; at ≤ 440px wide (real
phones) the frame, fake status bar and home indicator drop away and safe-area insets take over.
It's installable to the home screen (`public/manifest.webmanifest`, icons rendered from
`public/icon.svg` by `npm run icons`).

## Sign-in (phone OTP) — one-time Supabase setup

Login is Supabase phone OTP (`+91` numbers), with "Continue with Email" as a fallback that sends
a 6-digit email code. To enable it, in the Supabase dashboard for project `uwprgaworykuyifijkih`:

1. **Authentication → Sign In / Providers → Phone**: enable it and pick an SMS provider
   (Twilio, MessageBird, Vonage or TextLocal). Until real SMS is set up you can enter placeholder
   credentials and add **Test phone numbers** (e.g. `919876543210=123456`) — those numbers sign in
   with the fixed code and no SMS is sent.
2. **Email codes** (optional): in **Authentication → Emails → Magic Link**, include `{{ .Token }}`
   in the template so residents receive the 6-digit code rather than only a link.
3. **URL configuration**: add the deployed site URL under **Authentication → URL Configuration**.

First sign-in creates a `profiles` row (trigger on `auth.users`); the app then asks for name,
tower and flat before showing the dashboard.

## Data model

Schema, RLS policies and seed data live in `../supabase/migrations/` (applied to the project
already). `../supabase/gen-seed.mjs` regenerates the seed migration from `project/data.js`.

| Area | Tables / functions | Who can write |
|---|---|---|
| Profile | `profiles` | the resident (name, flat, tower only — not `role`) |
| Maintenance | `maintenance_items`, `maintenance_history` | committee (via dashboard / SQL) |
| Issues | `issues`, `issue_comments` | residents raise their own (status forced to `Open`) and comment as themselves |
| Cultural | `events`, `event_registrations`, `proposals`, `gallery_albums`, `event_counts()` | residents register / withdraw themselves |
| Booking | `facilities`, `bookings`, `taken_slots()` | residents book for themselves; a unique index blocks double-booking a slot |
| Policies | `community_policies` | committee |
| Polls | `polls`, `poll_votes`, `poll_results()` | one vote per resident, active polls only; votes are private — only totals are exposed |
| Notifications | `notifications`, `notification_reads` | triggers add personal ones (booking confirmed, comment on your ticket) |

## Live updates

Changes by other residents (or committee edits in the Supabase table editor) appear within about
a second, with no reload. Every write to a community table fires a statement-level trigger that
calls `realtime.send` on the **private** Realtime topic `community` with only the table name as
payload. Signed-in apps listen on that topic (policy on `realtime.messages`; nobody can send on
it from a client) and refetch through their normal RLS-filtered queries, so a neighbour's booking
greys out the slot via `taken_slots()` without revealing who booked it. The app also refreshes
when it comes back to the foreground and after a socket reconnect.

Committee-side editing (updating issue status, maintenance inspections, creating polls/events)
has no UI yet — the prototype only designed the resident experience. Use the Supabase table
editor for now.

## Testing

Run `npm run build && npm run preview`, then `npm run e2e:mock` in another terminal. It drives every screen and the
write flows (profile, new issue + comment, event registration, booking, vote, notifications), plus
live updates from a simulated neighbour (booking, issue, vote), in Chromium against an in-memory
stand-in for Supabase including its Realtime socket (`scripts/mock-supabase.mjs`), saving
screenshots to `e2e-shots/`. Point it at the real project with `E2E_EMAIL` / `E2E_PASSWORD` for
a confirmed email/password test user instead of `E2E_MOCK=1`.

## Not yet wired up

These controls exist in the design but have no backend yet; they show a "coming soon" toast:
photo/video attachments on issues, by-laws PDF download, "Propose an Event". "Register here"
explains that new residents simply sign in with their number.
