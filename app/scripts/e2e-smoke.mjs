// End-to-end smoke test against the live Supabase project.
// Signs in as an email/password test user, then walks every screen and the
// main write flows (profile, issue + comment, event registration, booking,
// vote, notifications), saving screenshots to $SHOTS (default ./e2e-shots).
//
// Usage (live):  E2E_EMAIL=... E2E_PASSWORD=... BASE_URL=http://localhost:4173 node scripts/e2e-smoke.mjs
// Usage (mock):  E2E_MOCK=1 node scripts/e2e-smoke.mjs   — no network access to Supabase needed
import { chromium } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { mkdirSync, readFileSync } from "node:fs";
import { fakeSession, installMock } from "./mock-supabase.mjs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n").filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => l.split("=").map((s) => s.trim()))
);
const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const SHOTS = process.env.SHOTS ?? "e2e-shots";
mkdirSync(SHOTS, { recursive: true });

const MOCK = !!process.env.E2E_MOCK;
let auth;
if (MOCK) {
  auth = { session: fakeSession() };
} else {
  const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
  const res = await sb.auth.signInWithPassword({ email: process.env.E2E_EMAIL, password: process.env.E2E_PASSWORD });
  if (res.error) throw res.error;
  auth = res.data;
}
const storageKey = `sb-${new URL(env.VITE_SUPABASE_URL).hostname.split(".")[0]}-auth-token`;

// Honour a preinstalled Chromium (e.g. CHROMIUM_PATH=/opt/pw-browsers/chromium) when the pinned one is absent
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const errors = [];
const step = (name) => console.log("✓", name);

async function newPage(viewport, session) {
  const ctx = await browser.newContext({ viewport });
  const mock = MOCK ? await installMock(ctx, env.VITE_SUPABASE_URL) : null;
  if (session) {
    await ctx.addInitScript(([k, v]) => localStorage.setItem(k, v), [storageKey, JSON.stringify(session)]);
  }
  const page = await ctx.newPage();
  page.mock = mock;
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  return page;
}
// Let screen fade-ins and status-bar transitions settle before capturing
const shot = async (page, name) => { await page.waitForTimeout(450); await page.screenshot({ path: `${SHOTS}/${name}.png` }); };

// ── Signed-out: login screen + phone OTP request ─────────────
{
  const page = await newPage({ width: 1280, height: 920 });
  await page.goto(BASE);
  await page.getByText("Welcome back").waitFor();
  await shot(page, "01-login");
  await page.getByLabel("Mobile number").fill("9999900001");
  await page.getByRole("button", { name: /Continue/ }).first().click();
  // Either the OTP step (SMS configured) or a surfaced auth error
  await Promise.race([
    page.getByText("Enter OTP").waitFor({ timeout: 10000 }),
    page.getByRole("alert").waitFor({ timeout: 10000 }),
  ]);
  await shot(page, "02-login-otp-request");
  step("login + OTP request: " + ((await page.getByRole("alert").count()) ? await page.getByRole("alert").innerText() : "OTP sent"));
  await page.context().close();
}

// ── Signed-in flows ──────────────────────────────────────────
const page = await newPage({ width: 1280, height: 920 }, auth.session);
await page.goto(BASE);

await page.getByText("Complete your profile").waitFor();
await shot(page, "03-profile");
await page.getByLabel("Full name").fill("Ravi Shankar");
await page.getByRole("button", { name: "Tower A" }).click();
await page.getByLabel("Flat number").fill("a-302");
await page.getByRole("button", { name: /Save & Continue/ }).click();
await page.getByText(/Good (morning|afternoon|evening), Ravi/).waitFor();
await shot(page, "04-dashboard");
step("profile → dashboard");

const back = () => page.getByLabel("Back").first().click();
const openCategory = (label) => page.getByText(label, { exact: true }).first().click();

// Maintenance
await openCategory("Maintenance");
await page.getByText("Tower A Lift").first().waitFor();
await shot(page, "05-maintenance");
await page.getByText("Gym Equipment", { exact: true }).click();
await page.getByText("Inspection History").waitFor();
await shot(page, "06-maintenance-detail");
await back(); await back();
step("maintenance list + detail");

// Issues: create, view, comment
await page.getByRole("button", { name: "Issues" }).click();
await page.getByText("TT-001").waitFor();
await shot(page, "07-issues");
await page.getByRole("button", { name: "New" }).click();
await page.getByRole("combobox").nth(0).selectOption("Water");
await page.getByRole("combobox").nth(1).selectOption("Tower A");
await page.getByRole("combobox").nth(2).selectOption("High");
await page.getByPlaceholder(/Describe the issue/).fill("E2E test: low water pressure on 3rd floor of Tower A.");
await shot(page, "08-issue-create");
await page.getByRole("button", { name: "Submit Issue" }).click();
const issueId = await page.locator("text=/^TT-0\\d\\d$/").first().innerText();
await page.getByLabel("Add a comment").fill("E2E test comment");
await page.getByLabel("Send comment").click();
await page.getByText("E2E test comment").waitFor();
await shot(page, "09-issue-detail");
await back();
step(`issue ${issueId} created + commented`);

// Booking
await page.getByRole("button", { name: "Book" }).click();
await page.getByText("Badminton Court 2").click();
await page.getByText("Available Slots").waitFor();
const tomorrow = page.locator('[aria-pressed]').nth(1);
await tomorrow.click();
await page.getByRole("button", { name: "18:00" }).click();
await shot(page, "10-booking-slots");
await page.getByRole("button", { name: "Confirm" }).click();
await page.getByText("Booking Confirmed!").waitFor();
await shot(page, "11-booking-confirmed");
await page.getByRole("button", { name: "Back to Facilities" }).click();
await page.getByText("My Bookings").waitFor();
await shot(page, "12-booking-list");
step("booking confirmed");

// Polls: vote on an active poll
await page.getByRole("button", { name: "Polls" }).click();
await page.getByText("CCTV Expansion — Basement 2").click();
await page.getByText("Cast your vote").waitFor();
await page.getByText("Yes, but defer to next quarter").click();
await page.getByText("✓ You voted").waitFor();
await shot(page, "13-poll-voted");
await back();
await shot(page, "14-polls");
step("poll vote");

// Members
await page.getByRole("button", { name: "Team" }).click();
await page.getByText("Suresh Narayanan").waitFor();
await shot(page, "15-members");
await page.getByText("Anitha Reddy").click();
await page.getByText("Responsibilities").waitFor();
await shot(page, "16-member-detail");
await back();
step("members");

// Home → Cultural, Policies, Notifications
await page.getByRole("button", { name: "Home" }).click();
await openCategory("Events");
await page.getByText("Monthly Community Meetup").click();
await page.getByRole("button", { name: "Register Interest" }).click();
await page.getByText(/Registered · Tap to withdraw/).waitFor();
await shot(page, "17-event-registered");
await back();
await page.getByRole("tab", { name: "Proposals" }).click();
await shot(page, "18-proposals");
await page.getByRole("tab", { name: "Gallery" }).click();
await shot(page, "19-gallery");
await back();
step("cultural");

await openCategory("Policies");
await page.getByText("Community Guidelines").waitFor();
await shot(page, "20-policies");
await page.getByText("Swimming Pool").click();
await shot(page, "21-policy-detail");
await back(); await back();
step("policies");

await page.getByLabel(/Notifications/).click();
await page.getByText("Booking Confirmed").waitFor();
await shot(page, "22-notifications");
await page.getByRole("button", { name: "Mark all read" }).click();
await page.getByText("All caught up").first().waitFor();
await back();
step("notifications");

await shot(page, "23-dashboard-after");

// Live updates (mock only): another resident writes, this screen updates without a reload
if (MOCK) {
  const { neighbour } = page.mock;
  const live = { timeout: 5000 };
  if (!neighbour.connected()) throw new Error("app did not open a Realtime socket");

  // A neighbour books the slot you're looking at
  await page.getByRole("button", { name: "Book" }).click();
  await page.getByText("Badminton Court 1").click();
  await page.getByText("Available Slots").waitFor();
  await page.locator("[aria-pressed]").nth(2).click();
  const d = new Date(); d.setDate(d.getDate() + 2);
  const date3 = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const slot = page.getByRole("button", { name: /^20:00/ });
  await slot.click(); // select it, as if about to confirm
  neighbour.book("f1", date3, "20:00");
  await page.getByRole("button", { name: /^20:00\s*Taken/ }).waitFor(live);
  await page.getByText("That slot was just booked by someone else.").waitFor(live);
  await shot(page, "25-live-slot-taken");
  step("live: neighbour's booking greys out the slot you selected");

  // A neighbour raises an issue while you're on the Issues list
  await page.getByRole("button", { name: "Issues" }).click();
  await page.getByText("TT-001").waitFor();
  const liveId = neighbour.raiseIssue("Live test: main gate barrier is stuck open.");
  await page.getByText(liveId).waitFor(live);
  await shot(page, "26-live-issue");
  step(`live: neighbour's issue ${liveId} appears`);

  // A neighbour votes while you're viewing results
  await page.getByRole("button", { name: "Polls" }).click();
  await page.getByText("CCTV Expansion — Basement 2").click();
  await page.getByText(/Results · 125 votes/).waitFor();
  neighbour.vote("pl2", 0);
  await page.getByText(/Results · 126 votes/).waitFor(live);
  step("live: poll results update");
  await back();
}

// Phone-sized viewport: frame gives way to full-screen
const mobile = await newPage({ width: 390, height: 844 }, auth.session);
await mobile.goto(BASE);
if (MOCK) {
  // Each mocked context starts from fresh seed data, so the profile is empty again
  await mobile.getByLabel("Full name").fill("Ravi Shankar");
  await mobile.getByRole("button", { name: "Tower A" }).click();
  await mobile.getByLabel("Flat number").fill("A-302");
  await mobile.getByRole("button", { name: /Save & Continue/ }).click();
}
await mobile.getByText(/Good (morning|afternoon|evening)/).waitFor();
await shot(mobile, "24-mobile-dashboard");
step("mobile viewport");

await browser.close();
console.log(errors.length ? `\nConsole errors:\n${errors.join("\n")}` : "\nNo console errors");
console.log("ISSUE_ID=" + issueId);
