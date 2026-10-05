import { addDays, isoDate } from "./format";
import type { CommunityData, Profile } from "./types";

export const DEMO_PROFILE: Profile = {
  id: "demo-resident",
  name: "Ravi Shankar",
  flat: "A-302",
  tower: "Tower A",
  phone: null,
  email: null,
  role: "resident",
};

export function createDemoData(): CommunityData {
  const today = isoDate();
  const timestamp = (minutesAgo: number) =>
    new Date(Date.now() - minutesAgo * 60_000).toISOString().slice(0, 16).replace("T", " ");

  return {
    coreMembers: [
      { id: "cm1", name: "Suresh Narayanan", role: "President", team: "Administration", tower: "Tower A", flat: "A-101", phone: "", email: "", responsibilities: ["RWA governance", "Legal matters"], avatar: "SN" },
      { id: "cm2", name: "Priya Venkatesh", role: "Secretary", team: "Administration", tower: "Tower B", flat: "B-201", phone: "", email: "", responsibilities: ["Meeting minutes", "Communication"], avatar: "PV" },
      { id: "cm3", name: "Kavitha Subramaniam", role: "Maintenance Head", team: "Maintenance", tower: "Tower A", flat: "A-801", phone: "", email: "", responsibilities: ["Lifts", "Lights", "CCTV"], avatar: "KS" },
      { id: "cm4", name: "Anitha Reddy", role: "Cultural Committee Head", team: "Cultural", tower: "Tower B", flat: "B-304", phone: "", email: "", responsibilities: ["Event planning", "Festival coordination"], avatar: "AR" },
    ],
    maintenanceItems: [
      { id: "m1", category: "Tower A", subcategory: "Lift", name: "Tower A Lift", status: "Fair", lastInspected: addDays(today, -4), nextCheck: addDays(today, 7), assignedTo: "Kavitha Subramaniam", warrantyExpiry: null, notes: "Minor vibration on floor 7. Service due soon.", history: [{ date: addDays(today, -4), status: "Fair", note: "Vibration noted on floor 7", inspector: "Kavitha Subramaniam" }] },
      { id: "m2", category: "Common Areas", subcategory: "Water Supply", name: "Water Supply System", status: "Good", lastInspected: addDays(today, -2), nextCheck: addDays(today, 12), assignedTo: "Srinivas Rao", warrantyExpiry: null, notes: "Overhead tank cleaned. Motor serviced.", history: [{ date: addDays(today, -2), status: "Good", note: "Tank cleaning completed", inspector: "Srinivas Rao" }] },
      { id: "m3", category: "Clubhouse", subcategory: "Gym Equipment", name: "Gym Equipment", status: "Poor", lastInspected: addDays(today, -1), nextCheck: addDays(today, 2), assignedTo: "Srinivas Rao", warrantyExpiry: null, notes: "Treadmill 2 is out of service. Vendor repair is scheduled.", history: [{ date: addDays(today, -1), status: "Poor", note: "Vendor notified for warranty repair", inspector: "Srinivas Rao" }] },
    ],
    issues: [
      { id: "TT-001", category: "Maintenance", subcategory: "Lift", priority: "High", status: "In Progress", raisedById: null, raisedBy: "Arun Kumar", flat: "A-507", assignedTo: "Kavitha Subramaniam", area: "Tower A", created: timestamp(180), updated: timestamp(90), description: "Lift paused between floors 5 and 6. The technician has been contacted.", sla: addDays(today, 1), comments: [{ by: "Kavitha Subramaniam", time: timestamp(90), text: "Technician is on the way." }] },
      { id: "TT-002", category: "Water", subcategory: "Water Leakage", priority: "High", status: "Open", raisedById: "demo-resident", raisedBy: "Ravi Shankar", flat: "A-302", assignedTo: "Srinivas Rao", area: "Parking", created: timestamp(60), updated: timestamp(60), description: "Water is pooling near parking bay B1-23. Please inspect the area.", sla: addDays(today, 1), comments: [] },
      { id: "TT-003", category: "Cleanliness", subcategory: "Common Area", priority: "Low", status: "Resolved", raisedById: null, raisedBy: "Meena Patel", flat: "B-601", assignedTo: "Srinivas Rao", area: "Tower B", created: timestamp(1440), updated: timestamp(300), description: "The sixth-floor corridor needed cleaning. This has now been completed.", sla: null, comments: [{ by: "Srinivas Rao", time: timestamp(300), text: "Cleaning completed this afternoon." }] },
    ],
    events: [
      { id: "e1", name: "Community Meet-up", date: addDays(today, 3), time: "11:00 AM", location: "Club House Banquet Hall", organizer: "Priya Venkatesh", description: "Meet neighbours and discuss upcoming community updates.", registered: 45, capacity: 100, status: "upcoming", category: "Community", registeredByMe: false },
      { id: "e2", name: "Festival on the Lawn", date: addDays(today, 12), time: "6:00 PM onwards", location: "Club House Lawn", organizer: "Anitha Reddy", description: "An evening of food, music, and cultural performances for residents.", registered: 87, capacity: 200, status: "upcoming", category: "Festival", registeredByMe: false },
      { id: "e3", name: "Diwali Celebration", date: addDays(today, 24), time: "7:00 PM onwards", location: "Club House Lawn", organizer: "Anitha Reddy", description: "Community celebration with rangoli, dinner, and performances.", registered: 0, capacity: 250, status: "planning", category: "Festival", registeredByMe: false },
    ],
    proposals: [
      { id: "p1", name: "Children's Annual Day", proposedBy: "Priti Joshi", flat: "B-404", description: "A community event with art activities, games, and performances for children.", budget: 25000, proposedDate: addDays(today, 30), status: "under_review", approvedBy: null, votes: { yes: 28, no: 5 } },
      { id: "p2", name: "Movie Night Under the Stars", proposedBy: "Vijay Kumar", flat: "B-905", description: "A family-friendly outdoor screening on the clubhouse lawn.", budget: 8000, proposedDate: addDays(today, 20), status: "pending", approvedBy: null, votes: { yes: 41, no: 3 } },
    ],
    albums: [
      { name: "Community Celebrations", photoCount: 24, dateLabel: "Recent", emoji: "🌸", hue: 45 },
      { name: "Sports Day", photoCount: 29, dateLabel: "This year", emoji: "🏅", hue: 30 },
    ],
    facilities: [
      { id: "f1", name: "Badminton Court 1", icon: "🏸", slots: 30, maxDuration: 60, buffer: 15, charges: "Free", rules: ["Max 60 min per booking", "Court shoes mandatory"] },
      { id: "f2", name: "Lawn Area", icon: "🌿", slots: 8, maxDuration: 180, buffer: 30, charges: "₹500 for events", rules: ["Max 3 hours per booking", "No loud music after 10 PM"] },
      { id: "f3", name: "Banquet Hall", icon: "🏛️", slots: 4, maxDuration: 360, buffer: 60, charges: "₹2000/day", rules: ["Advance booking required", "Max 150 guests"] },
    ],
    myBookings: [
      { id: "DEMO-BK-01", facilityId: "f1", facility: "Badminton Court 1", date: addDays(today, 1), startTime: "10:00", endTime: "11:00", status: "confirmed" },
    ],
    policies: [
      { id: "pol1", category: "Swimming Pool", icon: "🏊", rules: ["Children below 12 must be accompanied by an adult.", "Proper swimwear is required.", "No food or drinks inside the pool area."] },
      { id: "pol2", category: "Clubhouse", icon: "🏛️", rules: ["Clubhouse timings are 6:00 AM to 10:00 PM.", "Prior booking is required for courts and event spaces.", "Keep noise low after 9:00 PM."] },
      { id: "pol3", category: "Parking", icon: "🅿️", rules: ["Use only your allotted parking space.", "Keep fire lanes and emergency pathways clear.", "The parking speed limit is 10 km/h."] },
    ],
    polls: [
      { id: "pl1", title: "CCTV Expansion — Basement 2", description: "Should we install four additional cameras in Basement 2?", startDate: addDays(today, -1), endDate: addDays(today, 6), eligibleVoters: "All Residents", options: ["Yes, proceed", "Defer to next quarter", "No"], votes: [89, 23, 12], totalEligible: 240, status: "active", userVoted: null },
      { id: "pl2", title: "Pet Policy — Common Areas", description: "Should pets be allowed in residential lifts and common areas with leash rules?", startDate: addDays(today, -2), endDate: addDays(today, 5), eligibleVoters: "All Residents", options: ["Yes, with conditions", "Yes, without restrictions", "No"], votes: [45, 18, 9], totalEligible: 240, status: "active", userVoted: null },
      { id: "pl3", title: "Maintenance Representative", description: "Choose a representative for Tower A maintenance updates.", startDate: addDays(today, 8), endDate: addDays(today, 15), eligibleVoters: "Tower A Residents", options: ["Kavitha Subramaniam", "Ramesh Babu", "Anand Krishnan"], votes: [0, 0, 0], totalEligible: 120, status: "upcoming", userVoted: null },
    ],
    notifications: [
      { id: "n1", type: "issue", title: "Your ticket TT-002 is open", message: "Your water leakage report has been received.", time: "Just now", read: false },
      { id: "n2", type: "maintenance", title: "Maintenance alert: Tower A Lift", message: "The lift is due for service soon.", time: "Today", read: false },
      { id: "n3", type: "event", title: "New community meet-up", message: "Join neighbours at the clubhouse this week.", time: "Yesterday", read: true },
    ],
  };
}