/**
 * types/complaint.ts
 * -----------------------------------------------------------------
 * Shared "shapes" (TypeScript types) and fixed lists used everywhere
 * in the app: the complaint categories, the departments, the status
 * values, and the structure of one complaint record.
 * If you want to add or rename a category or department, do it HERE
 * and the dropdowns / filters across the site update automatically.
 */

// The categories a student can pick when submitting a complaint.
// These also appear in the Category filter on the Public Dashboard
// AND are the departments the admin can assign (see DEPARTMENTS below).
// "as const" makes TypeScript treat each one as an exact text value,
// not just any string.
export const CATEGORIES = [
  "Academic",
  "Facilities & Infrastructure",
  "Administrative",
  "Student Welfare",
  "Student Life",
  "Other",
] as const;

// A category is any one of the values listed in CATEGORIES above.
export type Category = (typeof CATEGORIES)[number];

// The departments that can be assigned to handle a complaint
// (used in the admin's "Assign Department" and "Reassign" pop-ups).
// They are the SAME six names as the categories above, so a complaint filed
// under "Academic" goes to the "Academic" department. Because this points to
// CATEGORIES, editing that one list updates both the categories and departments.
export const DEPARTMENTS = CATEGORIES;
export type Department = Category;

// The life cycle of a complaint:
// Pending (waiting for admin) -> Assigned -> In Progress -> Resolved,
// or Rejected if the admin does not approve it.
export type ComplaintStatus = "Pending" | "Assigned" | "In Progress" | "Resolved" | "Rejected";

// How urgent a complaint is. Set by the admin's approval step
// (later this will come from the AI priority detection).
export type Priority = "Low" | "Mid" | "High";

// Only these statuses are shown to the public, and they are the
// options in the Status filter on the Public Dashboard.
export const PUBLIC_STATUSES = ["Assigned", "In Progress", "Resolved"] as const;
export type WorkStatus = (typeof PUBLIC_STATUSES)[number];

// The file a student attaches as proof (only its name and size are kept
// because there is no backend to upload it to yet).
export interface EvidenceFile {
  name: string;
  size: number;
}

// One complaint record, exactly as it is stored.
export interface Complaint {
  /** Tracking ID, e.g. TRK-8F3K-92QD */
  id: string;
  title: string;
  category: Category;
  description: string;
  submittedAt: string; // date and time as ISO text
  status: ComplaintStatus;
  /** Administrator validated the complaint (priority is assigned at this point). */
  approved: boolean;
  priority?: Priority; // "?" means optional: it does not exist until the admin approves
  department?: Department; // set when the admin assigns it
  assignedAt?: string; // ISO
  evidence?: EvidenceFile;
  ownerEmail: string; // the student who submitted it
  reassignReason?: string; // filled in when the admin reassigns it
}

// What the Submit form sends when a student files a new complaint.
// The rest of the Complaint fields (id, status, etc.) are added automatically.
export interface NewComplaintInput {
  title: string;
  category: Category;
  description: string;
  evidence?: EvidenceFile;
  ownerEmail: string;
}
