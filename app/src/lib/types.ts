export type Tower = "Tower A" | "Tower B";

export interface Profile {
  id: string;
  name: string | null;
  flat: string | null;
  tower: Tower | null;
  phone: string | null;
  email: string | null;
  role: "resident" | "committee" | "admin";
}

export interface CoreMember {
  id: string;
  name: string;
  role: string;
  team: string;
  tower: string;
  flat: string;
  phone: string;
  email: string;
  responsibilities: string[];
  avatar: string;
}

export type AssetStatus = "Good" | "Fair" | "Poor" | "Out of service";

export interface MaintenanceHistory {
  date: string;
  status: AssetStatus;
  note: string;
  inspector: string;
}

export interface MaintenanceItem {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  status: AssetStatus;
  lastInspected: string;
  nextCheck: string;
  assignedTo: string;
  warrantyExpiry: string | null;
  notes: string;
  history: MaintenanceHistory[];
}

export type IssueStatus = "Open" | "In Progress" | "Resolved" | "On Hold" | "Closed";
export type Priority = "High" | "Medium" | "Low";

export interface IssueComment {
  by: string;
  time: string;
  text: string;
}

export interface Issue {
  id: string;
  category: string;
  subcategory: string;
  priority: Priority;
  status: IssueStatus;
  raisedById: string | null;
  raisedBy: string;
  flat: string;
  assignedTo: string;
  area: string;
  created: string;
  updated: string;
  description: string;
  sla: string | null;
  comments: IssueComment[];
}

export interface CommunityEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  registered: number;
  capacity: number;
  status: "upcoming" | "planning" | "past";
  category: string;
  registeredByMe: boolean;
}

export interface Proposal {
  id: string;
  name: string;
  proposedBy: string;
  flat: string;
  description: string;
  budget: number | null;
  proposedDate: string | null;
  status: "approved" | "under_review" | "pending";
  approvedBy: string | null;
  votes: { yes: number; no: number };
}

export interface Album {
  name: string;
  photoCount: number;
  dateLabel: string;
  emoji: string;
  hue: number;
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
  slots: number;
  maxDuration: number;
  buffer: number;
  charges: string;
  rules: string[];
}

export interface Booking {
  id: string;
  facilityId: string;
  facility: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "blocked" | "cancelled";
}

export interface CommunityPolicy {
  id: string;
  category: string;
  icon: string;
  rules: string[];
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eligibleVoters: string;
  options: string[];
  votes: number[];
  totalEligible: number;
  status: "active" | "upcoming" | "closed";
  userVoted: number | null;
}

export type NotificationType = "issue" | "maintenance" | "booking" | "poll" | "event" | "alert";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface CommunityData {
  coreMembers: CoreMember[];
  maintenanceItems: MaintenanceItem[];
  issues: Issue[];
  events: CommunityEvent[];
  proposals: Proposal[];
  albums: Album[];
  facilities: Facility[];
  myBookings: Booking[];
  policies: CommunityPolicy[];
  polls: Poll[];
  notifications: AppNotification[];
}
