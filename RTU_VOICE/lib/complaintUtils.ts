/**
 * lib/complaintUtils.ts
 * -----------------------------------------------------------------
 * Small helpers for working with lists of complaints.
 */
import type { Complaint } from "@/types/complaint";

/** Only validated complaints are public: pending and rejected ones are never exposed. */
export function isPublic(c: Complaint): boolean {
  return c.approved && c.status !== "Pending" && c.status !== "Rejected";
}

// Sorting rule: newest date first (use it with .sort()).
export function byNewest(a: string, b: string): number {
  return new Date(b).getTime() - new Date(a).getTime();
}
