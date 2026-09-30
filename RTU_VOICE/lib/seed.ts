/**
 * lib/seed.ts
 * -----------------------------------------------------------------
 * DEMO DATA. These sample complaints fill the app so you can see how
 * every screen looks without a database. When the real backend is
 * connected, this file is no longer needed.
 *
 * Note: "category" is what the student chose when submitting.
 *       "department" is the department the admin assigned it to.
 *       They use the same six names (see types/complaint.ts), but they are
 *       still two separate fields: the admin may assign a complaint to a
 *       different department than the category the student chose.
 */
import type { Complaint } from "@/types/complaint";

// The demo student account (Juan Dela Cruz) that owns the first three complaints.
const STUDENT = "student@rtu.edu.ph";
// Shortcut: d(20) gives the date September 20, 2026 (used for submittedAt / assignedAt).
const d = (day: number) => `2026-09-${String(day).padStart(2, "0")}T08:00:00.000Z`;

/** Demo data. Replaced by real records when the backend is connected. */
export const SEED_COMPLAINTS: Complaint[] = [
  // --- 1) Juan's own complaints: they appear in his History and Track Status pages ---
  { id: "TRK-8F3K-92QD", title: "Water fountain drainage overflow in main hall", category: "Facilities & Infrastructure", description: "Main hall water fountain pressure is low, and drainage is partially blocked causing overflow onto the ground floor.", submittedAt: d(20), status: "In Progress", approved: true, priority: "Low", department: "Facilities & Infrastructure", assignedAt: d(21), ownerEmail: STUDENT },
  { id: "TRK-2M6D-71XA", title: "Late release of midterm grades", category: "Academic", description: "Midterm grades for two subjects have not been posted a month after the deadline.", submittedAt: d(12), status: "Resolved", approved: true, priority: "Mid", department: "Academic", assignedAt: d(13), ownerEmail: STUDENT },
  { id: "TRK-5R9T-30LB", title: "Long cafeteria queues at lunch", category: "Student Life", description: "Queues at the cafeteria take almost the whole lunch break.", submittedAt: d(3), status: "Rejected", approved: false, ownerEmail: STUDENT },

  // --- 2) Other students' approved complaints: they show on the Public Dashboard and in department portals ---
  { id: "TRK-4C7P-18ZE", title: "Aircon not working in Room 304", category: "Facilities & Infrastructure", description: "The aircon in Room 304 has not been working for two weeks and the room gets very hot during afternoon classes.", submittedAt: d(21), status: "Assigned", approved: true, priority: "Mid", department: "Facilities & Infrastructure", assignedAt: d(22), ownerEmail: "maria@rtu.edu.ph" },
  { id: "TRK-7N2Q-45WK", title: "Wi-Fi keeps dropping in the library", category: "Facilities & Infrastructure", description: "Wi-Fi in the library disconnects every few minutes, so we cannot finish online submissions.", submittedAt: d(20), status: "Assigned", approved: true, priority: "Mid", department: "Facilities & Infrastructure", assignedAt: d(21), ownerEmail: "ben@rtu.edu.ph" },
  { id: "TRK-9L4V-66HC", title: "Long queue at the registrar window", category: "Administrative", description: "Only one window is open at the registrar even during enrollment week.", submittedAt: d(15), status: "Assigned", approved: true, priority: "Low", department: "Administrative", assignedAt: d(16), ownerEmail: "carla@rtu.edu.ph" },
  { id: "TRK-3B8Y-12FN", title: "Overflowing trash bins near the oval", category: "Facilities & Infrastructure", description: "Trash bins near the oval are not emptied and the area smells bad.", submittedAt: d(14), status: "In Progress", approved: true, priority: "Mid", department: "Facilities & Infrastructure", assignedAt: d(15), ownerEmail: "dan@rtu.edu.ph" },
  { id: "TRK-6H5S-83MJ", title: "Broken chairs in Room 210", category: "Facilities & Infrastructure", description: "Several chairs in Room 210 are broken and unsafe to sit on.", submittedAt: d(10), status: "Resolved", approved: true, priority: "Low", department: "Facilities & Infrastructure", assignedAt: d(11), ownerEmail: "ella@rtu.edu.ph" },
  { id: "TRK-1D7W-29PR", title: "Projector missing in the engineering lab", category: "Academic", description: "The projector in the engineering lab was removed and never replaced.", submittedAt: d(8), status: "Resolved", approved: true, priority: "Low", department: "Academic", assignedAt: d(9), ownerEmail: "fred@rtu.edu.ph" },
  { id: "TRK-8Z3G-57TB", title: "Stagnant water behind the gym", category: "Facilities & Infrastructure", description: "Stagnant water behind the gym has become a mosquito breeding spot.", submittedAt: d(6), status: "In Progress", approved: true, priority: "Mid", department: "Facilities & Infrastructure", assignedAt: d(7), ownerEmail: "gina@rtu.edu.ph" },

  { id: "TRK-5W2N-40QP", title: "Need a quiet counseling room for students", category: "Student Welfare", description: "There is no private space for students who need to talk to a guidance counselor, so conversations happen in the hallway.", submittedAt: d(17), status: "Assigned", approved: true, priority: "Mid", department: "Student Welfare", assignedAt: d(18), ownerEmail: "kim@rtu.edu.ph" },
  { id: "TRK-7S4L-15VD", title: "Student org room schedule is unclear", category: "Student Life", description: "Student organizations cannot tell when the shared org room is free, so events keep overlapping.", submittedAt: d(13), status: "In Progress", approved: true, priority: "Low", department: "Student Life", assignedAt: d(14), ownerEmail: "leo@rtu.edu.ph" },
  { id: "TRK-9T6M-72HG", title: "Lost and found has no clear location", category: "Other", description: "Students do not know where to claim or report lost items on campus.", submittedAt: d(9), status: "Resolved", approved: true, priority: "Low", department: "Other", assignedAt: d(10), ownerEmail: "mia@rtu.edu.ph" },
  // --- 3) Waiting complaints: they show in the admin's "Pending Validation" list ---
  { id: "TRK-0A1B-20CD", title: "Facilities Service Request #2041", category: "Facilities & Infrastructure", description: "Main hall water fountain pressure is low, and drainage is partially blocked causing overflow onto the ground floor.", submittedAt: d(20), status: "Pending", approved: false, ownerEmail: "hugo@rtu.edu.ph" },
  { id: "TRK-0E2F-31GH", title: "Network Connectivity Outage – Block B", category: "Facilities & Infrastructure", description: "The network in Block B has been down since Monday morning and classes cannot use online tools.", submittedAt: d(19), status: "Pending", approved: false, ownerEmail: "ivy@rtu.edu.ph" },
  { id: "TRK-0J3K-42LM", title: "HVAC Temperature Calibration Request", category: "Facilities & Infrastructure", description: "The HVAC in the admin building is set far too cold and needs calibration.", submittedAt: d(18), status: "Pending", approved: false, ownerEmail: "jay@rtu.edu.ph" },
];
