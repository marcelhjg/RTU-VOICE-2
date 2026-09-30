/**
 * components/StatusBadge.tsx
 * -----------------------------------------------------------------
 * Small colored labels (pills):
 *   StatusBadge   -> Pending / Assigned / In Progress / Resolved / Rejected
 *   PriorityBadge -> Low / Mid / High
 * The colors themselves are set in styles/app.css using the class names below.
 */
import type { ComplaintStatus, Priority } from "@/types/complaint";

// Which CSS class gives each status its color.
const STATUS_CLASS: Record<ComplaintStatus, string> = {
  Pending: "st-pending",
  Assigned: "st-assigned",
  "In Progress": "st-progress",
  Resolved: "st-resolved",
  Rejected: "st-rejected",
};
// Which CSS class gives each priority its color.
const PRIORITY_CLASS: Record<Priority, string> = { Low: "pr-low", Mid: "pr-mid", High: "pr-high" };

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return <span className={`badge ${STATUS_CLASS[status]}`}>{status}</span>;
}

// If there is no priority yet (not approved), show a dash.
export function PriorityBadge({ priority }: { priority?: Priority }) {
  if (!priority) return <span className="muted">—</span>;
  return <span className={`badge ${PRIORITY_CLASS[priority]}`}>{priority}</span>;
}
