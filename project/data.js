// ============================================================
// TWIN TOWERS BY NAMISHREE — Sample Data
// ============================================================

const DATA = {

  currentUser: {
    id: "u1", name: "Ravi Shankar", flat: "A-302", tower: "Tower A",
    phone: "9876543210", email: "ravi.s@email.com", role: "resident",
    avatar: null
  },

  coreMembers: [
    { id: "cm1", name: "Suresh Narayanan", role: "President", team: "Administration", tower: "Tower A", flat: "A-101", phone: "9845012345", email: "suresh.n@twintowers.in", responsibilities: ["RWA governance", "Legal matters", "Finance oversight"], avatar: "SN" },
    { id: "cm2", name: "Priya Venkatesh", role: "Secretary", team: "Administration", tower: "Tower B", flat: "B-201", phone: "9845023456", email: "priya.v@twintowers.in", responsibilities: ["Meeting minutes", "Communication", "Document management"], avatar: "PV" },
    { id: "cm3", name: "Ramesh Iyer", role: "Treasurer", team: "Finance", tower: "Tower A", flat: "A-502", phone: "9845034567", email: "ramesh.i@twintowers.in", responsibilities: ["Budget management", "Maintenance fees", "Vendor payments"], avatar: "RI" },
    { id: "cm4", name: "Kavitha Subramaniam", role: "Tower A Maintenance Head", team: "Tower A Maintenance", tower: "Tower A", flat: "A-801", phone: "9845045678", email: "kavitha.s@twintowers.in", responsibilities: ["Tower A lifts", "Lights", "CCTV", "Staircase"], avatar: "KS" },
    { id: "cm5", name: "Mohan Krishnamurthy", role: "Tower B Maintenance Head", team: "Tower B Maintenance", tower: "Tower B", flat: "B-1102", phone: "9845056789", email: "mohan.k@twintowers.in", responsibilities: ["Tower B lifts", "Lights", "CCTV", "Staircase"], avatar: "MK" },
    { id: "cm6", name: "Anitha Reddy", role: "Cultural Committee Head", team: "Cultural", tower: "Tower B", flat: "B-304", phone: "9845067890", email: "anitha.r@twintowers.in", responsibilities: ["Event planning", "Festival coordination", "Gallery updates"], avatar: "AR" },
    { id: "cm7", name: "Srinivas Rao", role: "Clubhouse & Common Areas", team: "Common Areas", tower: "Tower A", flat: "A-604", phone: "9845078901", email: "srinivas.r@twintowers.in", responsibilities: ["Clubhouse facilities", "Pool maintenance", "Gym", "Gardens"], avatar: "SR" },
    { id: "cm8", name: "Deepa Murthy", role: "Security Coordinator", team: "Security", tower: "Tower B", flat: "B-702", phone: "9845089012", email: "deepa.m@twintowers.in", responsibilities: ["Security personnel", "CCTV monitoring", "Visitor management", "Gate access"], avatar: "DM" },
  ],

  maintenanceItems: [
    // Tower A
    { id: "m1", category: "Tower A", subcategory: "Lift", name: "Tower A Lift", status: "Fair", lastInspected: "2026-04-18", nextCheck: "2026-05-01", assignedTo: "Kavitha Subramaniam", warrantyExpiry: "2026-07-15", notes: "Minor vibration on floor 7. Service due soon.", photos: [], history: [
      { date: "2026-04-18", status: "Fair", note: "Vibration noted at 7th floor", inspector: "Kavitha Subramaniam" },
      { date: "2026-03-20", status: "Good", note: "Annual service completed", inspector: "Kavitha Subramaniam" },
    ]},
    { id: "m2", category: "Tower A", subcategory: "Lights", name: "Tower A Corridor Lights", status: "Good", lastInspected: "2026-04-22", nextCheck: "2026-05-22", assignedTo: "Kavitha Subramaniam", warrantyExpiry: null, notes: "All lights functional. LED replacement done.", photos: [], history: [
      { date: "2026-04-22", status: "Good", note: "3 LED bulbs replaced in B-block corridor", inspector: "Kavitha Subramaniam" },
    ]},
    { id: "m3", category: "Tower A", subcategory: "CCTV", name: "Tower A Security Cameras", status: "Good", lastInspected: "2026-04-20", nextCheck: "2026-05-20", assignedTo: "Deepa Murthy", warrantyExpiry: "2027-01-10", notes: "All 12 cameras operational.", photos: [], history: [
      { date: "2026-04-20", status: "Good", note: "All cameras checked, DVR cleaned", inspector: "Deepa Murthy" },
    ]},
    // Tower B
    { id: "m4", category: "Tower B", subcategory: "Lift", name: "Tower B Lift", status: "Good", lastInspected: "2026-04-25", nextCheck: "2026-05-25", assignedTo: "Mohan Krishnamurthy", warrantyExpiry: "2026-09-30", notes: "Operating normally post recent service.", photos: [], history: [
      { date: "2026-04-25", status: "Good", note: "Quarterly service completed by vendor", inspector: "Mohan Krishnamurthy" },
    ]},
    { id: "m5", category: "Tower B", subcategory: "Staircase", name: "Tower B Staircase", status: "Fair", lastInspected: "2026-04-19", nextCheck: "2026-04-30", assignedTo: "Mohan Krishnamurthy", warrantyExpiry: null, notes: "Handrail loose on 9th floor. Repair scheduled.", photos: [], history: [
      { date: "2026-04-19", status: "Fair", note: "Handrail loose on 9th floor — repair order placed", inspector: "Mohan Krishnamurthy" },
    ]},
    // Common Areas
    { id: "m6", category: "Common Areas", subcategory: "Water Supply", name: "Water Supply System", status: "Good", lastInspected: "2026-04-26", nextCheck: "2026-05-10", assignedTo: "Srinivas Rao", warrantyExpiry: null, notes: "Overhead tank cleaned. Motor serviced.", photos: [], history: [
      { date: "2026-04-26", status: "Good", note: "Tank cleaning completed", inspector: "Srinivas Rao" },
    ]},
    { id: "m7", category: "Common Areas", subcategory: "Play Area", name: "Children's Play Area", status: "Fair", lastInspected: "2026-04-21", nextCheck: "2026-05-05", assignedTo: "Srinivas Rao", warrantyExpiry: null, notes: "Swing chain needs replacement. Slide in good condition.", photos: [], history: [
      { date: "2026-04-21", status: "Fair", note: "Swing chain worn out, replacement ordered", inspector: "Srinivas Rao" },
    ]},
    // Clubhouse
    { id: "m8", category: "Clubhouse", subcategory: "Swimming Pool", name: "Swimming Pool", status: "Good", lastInspected: "2026-04-24", nextCheck: "2026-04-28", assignedTo: "Srinivas Rao", warrantyExpiry: null, notes: "Chlorine levels normal. Pump operational. Last cleaned 3 days ago.", photos: [], history: [
      { date: "2026-04-24", status: "Good", note: "Chlorine check: 2.1ppm ✓, pH: 7.4 ✓, Pump OK", inspector: "Srinivas Rao" },
      { date: "2026-04-21", status: "Good", note: "Full pool cleaning completed", inspector: "Srinivas Rao" },
    ]},
    { id: "m9", category: "Clubhouse", subcategory: "Gym Equipment", name: "Gym Equipment", status: "Poor", lastInspected: "2026-04-23", nextCheck: "2026-04-28", assignedTo: "Srinivas Rao", warrantyExpiry: "2026-06-01", notes: "Treadmill #2 out of service. Warranty claim raised with vendor.", photos: [], history: [
      { date: "2026-04-23", status: "Poor", note: "Treadmill #2 belt snapped. Vendor notified for warranty repair", inspector: "Srinivas Rao" },
    ]},
    // Parking
    { id: "m10", category: "Parking", subcategory: "Basement 2", name: "Basement 2 Lights", status: "Poor", lastInspected: "2026-04-22", nextCheck: "2026-04-29", assignedTo: "Kavitha Subramaniam", warrantyExpiry: null, notes: "6 tube lights not working in B2-North zone. Electrician scheduled.", photos: [], history: [
      { date: "2026-04-22", status: "Poor", note: "6 tube lights non-functional in B2-North. Electrician booked for Apr 29", inspector: "Kavitha Subramaniam" },
    ]},
  ],

  issues: [
    { id: "TT-001", category: "Maintenance", subcategory: "Lift", priority: "High", status: "In Progress", raisedBy: "Arun Kumar", flat: "A-507", assignedTo: "Kavitha Subramaniam", area: "Tower A", created: "2026-04-25 09:15", updated: "2026-04-25 11:30", description: "Lift stuck between 5th and 6th floor for 20 mins. Passengers had to be evacuated.", sla: "2026-04-26", comments: [
      { by: "Kavitha Subramaniam", time: "2026-04-25 11:30", text: "Elevator technician contacted. Will be on-site by 2 PM." },
    ]},
    { id: "TT-002", category: "Water", subcategory: "Water Leakage", priority: "High", status: "Open", raisedBy: "Meena Patel", flat: "A-302", assignedTo: "Srinivas Rao", area: "Parking", created: "2026-04-26 07:45", updated: "2026-04-26 07:45", description: "Water leakage near parking spot B1-23 in Basement 1. Floor wet and slippery. Safety hazard.", sla: "2026-04-27", comments: []},
    { id: "TT-003", category: "Maintenance", subcategory: "Gym Equipment", priority: "Medium", status: "In Progress", raisedBy: "Ravi Shankar", flat: "A-302", assignedTo: "Srinivas Rao", area: "Clubhouse", created: "2026-04-23 18:20", updated: "2026-04-24 10:00", description: "Treadmill #2 in gym not working. Belt seems to have snapped. Please repair urgently.", sla: "2026-04-28", comments: [
      { by: "Srinivas Rao", time: "2026-04-24 10:00", text: "Warranty claim raised with vendor. Expected resolution in 3-5 days." },
    ]},
    { id: "TT-004", category: "Noise", subcategory: "Residential Noise", priority: "Medium", status: "Open", raisedBy: "Sunita Sharma", flat: "B-503", assignedTo: "Deepa Murthy", area: "Tower B", created: "2026-04-24 23:45", updated: "2026-04-24 23:45", description: "Loud music and noise from flat B-504 after 11 PM. Has been happening for 3 days in a row.", sla: "2026-04-25", comments: []},
    { id: "TT-005", category: "Security", subcategory: "CCTV", priority: "High", status: "Resolved", raisedBy: "Deepa Murthy", flat: "B-702", assignedTo: "Deepa Murthy", area: "Common Area", created: "2026-04-20 14:00", updated: "2026-04-22 16:00", description: "Camera C-07 near east gate not recording since Apr 18. Blind spot in security coverage.", sla: "2026-04-22", comments: [
      { by: "Deepa Murthy", time: "2026-04-22 16:00", text: "Camera replaced and tested. Recording resumed." },
    ]},
    { id: "TT-006", category: "Cleanliness", subcategory: "Garbage", priority: "Low", status: "Resolved", raisedBy: "Rekha Nair", flat: "A-204", assignedTo: "Srinivas Rao", area: "Common Area", created: "2026-04-21 08:30", updated: "2026-04-21 15:00", description: "Garbage overflow near dustbin at Tower A entrance. Bins not emptied since Saturday.", sla: "2026-04-22", comments: []},
    { id: "TT-007", category: "Parking", subcategory: "Parking Dispute", priority: "Medium", status: "On Hold", raisedBy: "Vijay Kumar", flat: "B-905", assignedTo: "Deepa Murthy", area: "Parking", created: "2026-04-23 19:00", updated: "2026-04-24 09:00", description: "Unknown vehicle parked in my assigned spot B2-47 repeatedly. Third time this week.", sla: "2026-04-25", comments: [
      { by: "Deepa Murthy", time: "2026-04-24 09:00", text: "Vehicle identified. Owner contacted. Awaiting response." },
    ]},
    { id: "TT-008", category: "Water", subcategory: "Water Shortage", priority: "High", status: "Resolved", raisedBy: "Lakshmi Reddy", flat: "A-1001", assignedTo: "Srinivas Rao", area: "Tower A", created: "2026-04-19 07:00", updated: "2026-04-19 14:00", description: "No water supply to floors 9-12 in Tower A since morning. Please check overhead tank pump.", sla: "2026-04-19", comments: [
      { by: "Srinivas Rao", time: "2026-04-19 14:00", text: "Motor fault fixed. Water supply restored." },
    ]},
    { id: "TT-009", category: "Maintenance", subcategory: "Play Equipment", priority: "Low", status: "In Progress", raisedBy: "Priti Joshi", flat: "B-404", assignedTo: "Srinivas Rao", area: "Common Area", created: "2026-04-22 17:30", updated: "2026-04-23 09:00", description: "Swing chain broken in children's play area. Risk of injury to kids.", sla: "2026-04-27", comments: [
      { by: "Srinivas Rao", time: "2026-04-23 09:00", text: "New chain ordered. Installation scheduled for Apr 29." },
    ]},
    { id: "TT-010", category: "Cleanliness", subcategory: "Common Area", priority: "Low", status: "Open", raisedBy: "Manoj Singh", flat: "B-607", assignedTo: "Srinivas Rao", area: "Common Area", created: "2026-04-26 10:00", updated: "2026-04-26 10:00", description: "Corridor on 6th floor of Tower B has not been cleaned for 3 days. Bad smell.", sla: "2026-04-28", comments: []},
  ],

  events: [
    { id: "e1", name: "Ganesh Chaturthi Celebration", date: "2026-08-27", time: "6:00 PM onwards", location: "Club House Lawn", organizer: "Anitha Reddy", description: "Annual Ganesh Chaturthi celebration with pooja, prasad, and cultural programs. All residents invited.", registered: 87, capacity: 200, status: "upcoming", category: "Festival" },
    { id: "e2", name: "Independence Day Flag Hoisting", date: "2026-08-15", time: "8:00 AM", location: "Main Entrance", organizer: "Suresh Narayanan", description: "Flag hoisting ceremony followed by breakfast for all residents.", registered: 120, capacity: 300, status: "upcoming", category: "National" },
    { id: "e3", name: "Monthly Community Meetup", date: "2026-05-04", time: "11:00 AM", location: "Club House Banquet Hall", organizer: "Priya Venkatesh", description: "Monthly RWA open house meeting. Discuss pending issues, upcoming events and maintenance updates.", registered: 45, capacity: 100, status: "upcoming", category: "Community" },
    { id: "e4", name: "Summer Sports Day", date: "2026-05-18", time: "7:00 AM – 12:00 PM", location: "Badminton Courts & Lawn", organizer: "Anitha Reddy", description: "Summer sports festival with badminton, chess, and fun games for kids and adults.", registered: 62, capacity: 150, status: "upcoming", category: "Sports" },
    { id: "e5", name: "Diwali Night", date: "2026-10-20", time: "7:00 PM onwards", location: "Club House Lawn", organizer: "Anitha Reddy", description: "Grand Diwali celebration with rangoli, fireworks, dinner, and cultural performances.", registered: 0, capacity: 250, status: "planning", category: "Festival" },
  ],

  proposals: [
    { id: "p1", name: "Onam Celebration 2026", proposedBy: "Rekha Nair", flat: "A-204", description: "Organize an Onam celebration with traditional Kerala feast (Onam Sadya), pookalam (flower rangoli) competition, and cultural performances.", budget: 45000, proposedDate: "2026-09-06", status: "approved", approvedBy: "Anitha Reddy", votes: { yes: 34, no: 2 } },
    { id: "p2", name: "Children's Annual Day", proposedBy: "Priti Joshi", flat: "B-404", description: "A dedicated children's annual day event with drawing competition, fancy dress, and mini-sports for kids aged 3-14.", budget: 25000, proposedDate: "2026-06-01", status: "under_review", approvedBy: null, votes: { yes: 28, no: 5 } },
    { id: "p3", name: "Movie Night Under Stars", proposedBy: "Vijay Kumar", flat: "B-905", description: "Monthly outdoor movie screening on the club house lawn. Family-friendly movies, popcorn and beverages.", budget: 8000, proposedDate: "2026-05-15", status: "pending", approvedBy: null, votes: { yes: 41, no: 3 } },
  ],

  bookings: [
    { id: "b1", facility: "Badminton Court 1", date: "2026-04-27", startTime: "07:00", endTime: "08:00", bookedBy: "Ravi Shankar", flat: "A-302", status: "confirmed" },
    { id: "b2", facility: "Badminton Court 2", date: "2026-04-27", startTime: "19:00", endTime: "20:00", bookedBy: "Arun Kumar", flat: "A-507", status: "confirmed" },
    { id: "b3", facility: "Lawn Area", date: "2026-04-27", startTime: "10:00", endTime: "13:00", bookedBy: "Sunita Sharma", flat: "B-503", status: "confirmed", purpose: "Birthday Party" },
    { id: "b4", facility: "Banquet Hall", date: "2026-10-20", startTime: "17:00", endTime: "23:00", bookedBy: "Anitha Reddy", flat: "B-304", status: "blocked", purpose: "Diwali Night (Community Event)" },
    { id: "b5", facility: "Badminton Court 1", date: "2026-04-28", startTime: "07:00", endTime: "08:00", bookedBy: "Meena Patel", flat: "B-601", status: "confirmed" },
    { id: "b6", facility: "Badminton Court 1", date: "2026-04-27", startTime: "18:00", endTime: "19:00", bookedBy: "Mohan Krishnamurthy", flat: "B-1102", status: "confirmed" },
  ],

  facilities: [
    { id: "f1", name: "Badminton Court 1", icon: "🏸", slots: 30, maxDuration: 60, buffer: 15, charges: "Free", rules: ["Max 60 min per booking", "Max 2 active bookings per flat", "Bring your own racket", "Court shoes mandatory"] },
    { id: "f2", name: "Badminton Court 2", icon: "🏸", slots: 30, maxDuration: 60, buffer: 15, charges: "Free", rules: ["Max 60 min per booking", "Max 2 active bookings per flat", "Bring your own racket", "Court shoes mandatory"] },
    { id: "f3", name: "Lawn Area", icon: "🌿", slots: 8, maxDuration: 180, buffer: 30, charges: "₹500 for events", rules: ["Max 3 hours per booking", "Advance notice of 48 hrs for events", "No loud music after 10 PM", "Clean up after use"] },
    { id: "f4", name: "Banquet Hall", icon: "🏛️", slots: 4, maxDuration: 360, buffer: 60, charges: "₹2000/day", rules: ["Advance booking 7 days prior", "Max 150 guests", "Catering vendor list provided", "Deposit of ₹5000 required"] },
    { id: "f5", name: "Club House Room", icon: "🪑", slots: 12, maxDuration: 120, buffer: 15, charges: "Free", rules: ["Max 2 hours per booking", "For meetings or small gatherings only", "Max 20 people"] },
  ],

  policies: [
    { id: "pol1", category: "Swimming Pool", icon: "🏊", rules: [
      "Pool timings: 6:00 AM – 9:00 AM and 4:00 PM – 8:00 PM daily.",
      "Children below 12 years must be accompanied by an adult at all times.",
      "Proper swimwear mandatory. No street clothes or jeans in the pool.",
      "No food or drinks inside the pool area.",
      "Shower before entering the pool.",
      "No diving, running, or rough play in the pool area.",
      "Persons with infectious diseases or open wounds must not use the pool.",
      "Pool will be closed on maintenance days (notified in advance)."
    ]},
    { id: "pol2", category: "Clubhouse", icon: "🏛️", rules: [
      "Clubhouse timings: 6:00 AM – 10:00 PM daily.",
      "No loud music or noise after 9:00 PM.",
      "Prior booking required for banquet hall, courts, and lawn.",
      "Residents are responsible for guests' behavior.",
      "Maximum 2 guests per flat allowed in gym without special permission.",
      "No smoking or alcohol consumption in common clubhouse areas.",
      "Pets are not allowed inside the clubhouse.",
      "Food and drinks allowed only in designated dining areas."
    ]},
    { id: "pol3", category: "Parking", icon: "🅿️", rules: [
      "Each flat is assigned a designated parking slot. Use only your allotted space.",
      "Visitor parking is available in designated bays near the main gate only.",
      "Do not block fire exit lanes or emergency vehicle pathways at any time.",
      "No vehicle repairs or washing in basement parking.",
      "Speed limit inside parking: 10 km/h.",
      "Two-wheelers must use designated two-wheeler parking zones.",
      "Vehicles left unattended for more than 30 days without notice may be towed.",
      "Flats with multiple vehicles must register all vehicles with security."
    ]},
    { id: "pol4", category: "Common Areas", icon: "🌳", rules: [
      "No littering in common areas. Use designated dustbins.",
      "Children's play area timings: 7:00 AM – 7:30 PM.",
      "Do not damage plants, garden, or community property.",
      "No commercial activity or solicitation in common areas.",
      "Domestic staff must carry valid ID and be registered with security.",
      "Noise levels must be kept low in corridors, especially after 10 PM.",
      "Common area furniture must not be taken inside flats.",
      "Residents must not hang laundry from balconies facing common areas."
    ]},
    { id: "pol5", category: "Noise & Nuisance", icon: "🔇", rules: [
      "Silence hours: 10:00 PM – 6:00 AM. No loud music, drilling, or construction noise.",
      "Parties or gatherings with amplified music require prior written permission from RWA.",
      "Drilling/renovation work allowed: 9:00 AM – 6:00 PM on weekdays only.",
      "Residents are liable for disturbances caused by their guests.",
      "Disputes must be escalated to the Core Committee, not resolved physically.",
      "Repeated violations may result in monetary penalties as per by-laws."
    ]},
  ],

  polls: [
    { id: "pl1", title: "Election of Tower A Maintenance Task Member", description: "Elect the resident representative who will oversee maintenance activities in Tower A for the term 2026-27.", startDate: "2026-04-20", endDate: "2026-04-30", eligibleVoters: "Tower A Residents", options: ["Kavitha Subramaniam", "Ramesh Babu", "Anand Krishnan"], votes: [52, 31, 17], totalEligible: 120, status: "active", userVoted: null },
    { id: "pl2", title: "CCTV Expansion — Basement 2", description: "Should we install 4 additional CCTV cameras in Basement 2 at an estimated cost of ₹24,000 (to be covered by maintenance fund)?", startDate: "2026-04-22", endDate: "2026-04-29", eligibleVoters: "All Residents", options: ["Yes, proceed immediately", "Yes, but defer to next quarter", "No, not required"], votes: [89, 23, 12], totalEligible: 240, status: "active", userVoted: 0 },
    { id: "pl3", title: "Diwali 2026 Celebration Budget", description: "Choose the preferred budget range for the Diwali 2026 grand celebration at Twin Towers.", startDate: "2026-04-15", endDate: "2026-04-25", eligibleVoters: "All Residents", options: ["₹50,000 – ₹75,000", "₹75,000 – ₹1,00,000", "₹1,00,000 – ₹1,50,000"], votes: [45, 98, 62], totalEligible: 240, status: "closed", userVoted: 1 },
    { id: "pl4", title: "Pet Policy — Lifts & Common Areas", description: "Should pets be allowed in residential lifts and common areas, subject to the owner maintaining hygiene and leash rules?", startDate: "2026-05-01", endDate: "2026-05-10", eligibleVoters: "All Residents", options: ["Yes, allowed with conditions", "Yes, allowed without restrictions", "No, pets must use service elevator only"], votes: [0, 0, 0], totalEligible: 240, status: "upcoming", userVoted: null },
  ],

  notifications: [
    { id: "n1", type: "issue", title: "Your ticket TT-003 updated", message: "Srinivas Rao added a comment: 'Warranty claim raised with vendor.'", time: "2026-04-24 10:05", read: false },
    { id: "n2", type: "maintenance", title: "Maintenance Alert: Tower A Lift", message: "Tower A Lift status changed from Good to Fair. Service due in 10 days.", time: "2026-04-18 14:30", read: false },
    { id: "n3", type: "booking", title: "Booking Confirmed", message: "Badminton Court 1 booked for Apr 27, 7:00–8:00 AM. Booking ID: B-2847.", time: "2026-04-25 20:10", read: true },
    { id: "n4", type: "poll", title: "New Poll: CCTV Expansion", message: "A new community poll has been launched. Cast your vote before Apr 29.", time: "2026-04-22 09:00", read: true },
    { id: "n5", type: "event", title: "New Event: Monthly Community Meetup", message: "Monthly RWA meetup on May 4 at 11 AM in Banquet Hall. Register your interest.", time: "2026-04-21 11:00", read: true },
    { id: "n6", type: "poll", title: "Poll Closed: Diwali Budget", message: "The Diwali 2026 budget poll has ended. Winning option: ₹75k–1L. See results.", time: "2026-04-25 23:59", read: true },
  ],
};

// Make globally available
window.APP_DATA = DATA;
