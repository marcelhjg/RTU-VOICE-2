/**
 * lib/complaints.tsx
 * -----------------------------------------------------------------
 * The "brain" for all complaint data. It keeps the list of complaints
 * in memory, saves it to the browser (localStorage), and gives every
 * page ready-made actions: submit, approve, reject, assign, reassign,
 * change status, and find by tracking ID.
 *
 * Any page can use it like this:   const { complaints, submit } = useComplaints();
 *
 * BACKEND NOTE: when the real database is ready, replace the actions
 * below with API / Supabase calls. The pages will not need to change.
 */
"use client"; // this file runs in the browser (it uses React state and localStorage)
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CATEGORIES } from "@/types/complaint";
import type { Complaint, ComplaintStatus, Department, NewComplaintInput, Priority } from "@/types/complaint";
import { generateTrackingId } from "./format";
import { saveEvidence } from "./evidenceStorage";
import { mockPriority } from "./priority";
import { SEED_COMPLAINTS } from "./seed";
import { readJSON, writeJSON } from "./storage";

// The name the data is saved under in the browser's localStorage.
// v3 = the new categories AND departments. Changing this number makes the browser
// ignore old saved data, so old category / department names do not show up anymore.
const KEY = "rtuvoice:complaints:v3";
const STATUSES: readonly ComplaintStatus[] = ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"];
const PRIORITIES: readonly Priority[] = ["Low", "Mid", "High"];

function isComplaintRecord(value: unknown): value is Complaint {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  const evidence = record.evidence;
  const evidenceRecord =
    typeof evidence === "object" && evidence !== null && !Array.isArray(evidence)
      ? (evidence as Record<string, unknown>)
      : null;
  const evidenceIsValid =
    evidence === undefined ||
    (evidenceRecord !== null &&
      typeof evidenceRecord.name === "string" &&
      typeof evidenceRecord.size === "number" &&
      Number.isFinite(evidenceRecord.size) &&
      evidenceRecord.size >= 0);
  const assignedAtIsValid =
    record.assignedAt === undefined ||
    (typeof record.assignedAt === "string" && Number.isFinite(Date.parse(record.assignedAt)));

  return (
    typeof record.id === "string" && record.id.trim().length > 0 &&
    typeof record.title === "string" &&
    CATEGORIES.some((category) => category === record.category) &&
    typeof record.description === "string" &&
    typeof record.submittedAt === "string" &&
    Number.isFinite(Date.parse(record.submittedAt)) &&
    assignedAtIsValid &&
    STATUSES.includes(record.status as ComplaintStatus) &&
    typeof record.approved === "boolean" &&
    (record.priority === undefined || PRIORITIES.includes(record.priority as Priority)) &&
    (record.department === undefined || CATEGORIES.some((department) => department === record.department)) &&
    evidenceIsValid &&
    typeof record.ownerEmail === "string" &&
    (record.reassignReason === undefined || typeof record.reassignReason === "string")
  );
}

function isComplaintList(value: unknown): value is Complaint[] {
  return Array.isArray(value) && value.every(isComplaintRecord);
}

// Everything the rest of the app is allowed to use from this file.
interface ComplaintsContextValue {
  complaints: Complaint[];
  /** False until the stored data has been read on the client. */
  loaded: boolean;
  submit: (input: NewComplaintInput, attachment?: File) => Promise<Complaint>; // student files a new complaint
  approve: (id: string) => void; // admin validates a complaint
  reject: (id: string) => void; // admin rejects a complaint
  assign: (id: string, department: Department) => void; // admin sends it to a department
  reassign: (id: string, department: Department, reason: string) => void; // admin moves it to another department
  setStatus: (id: string, status: ComplaintStatus) => void; // department updates the progress
  findById: (id: string) => Complaint | undefined; // used by the Track Status page
}

// The "shared box" that holds the values above so any page can reach them.
const ComplaintsContext = createContext<ComplaintsContextValue | null>(null);

// Wraps the whole app (see components/AppProviders.tsx) so every page can use the data.
export function ComplaintProvider({ children }: { children: ReactNode }) {
  // Start with the demo (seed) data so the first screen is never empty.
  const [complaints, setComplaints] = useState<Complaint[]>(SEED_COMPLAINTS);
  const [loaded, setLoaded] = useState(false);

  // When the page opens: load the saved complaints from the browser, if there are any.
  useEffect(() => {
    const stored = readJSON<unknown>(KEY, null);
    if (isComplaintList(stored)) setComplaints(stored);
    setLoaded(true);
  }, []);

  // Every time the list changes: save it back to the browser.
  // (We wait until "loaded" so the demo data does not overwrite saved data.)
  useEffect(() => {
    if (loaded) writeJSON(KEY, complaints);
  }, [complaints, loaded]);

  // Helper: change ONE complaint (found by id) and leave the others untouched.
  const patch = useCallback((id: string, fn: (c: Complaint) => Complaint) => {
    setComplaints((list) => list.map((c) => (c.id === id ? fn(c) : c)));
  }, []);

  // Student submits a new complaint: it starts as "Pending" and not yet approved.
  const submit = useCallback(
    async (input: NewComplaintInput, attachment?: File): Promise<Complaint> => {
      const created: Complaint = {
        id: generateTrackingId(new Set(complaints.map((c) => c.id))), // unique tracking ID
        title: input.title,
        category: input.category,
        description: input.description,
        submittedAt: new Date().toISOString(),
        status: "Pending",
        approved: false,
        evidence: input.evidence,
        ownerEmail: input.ownerEmail,
      };
      if (attachment) await saveEvidence(created.id, attachment);
      setComplaints((list) => [created, ...list]); // newest goes to the top
      return created;
    },
    [complaints],
  );

  // Admin approves: mark it approved and give it a priority (Low / Mid / High).
  const approve = useCallback(
    (id: string) =>
      patch(id, (c) => ({ ...c, approved: true, priority: c.priority ?? mockPriority(`${c.title} ${c.description}`) })),
    [patch],
  );

  // Admin rejects: status becomes "Rejected" (it will never appear on the public page).
  const reject = useCallback((id: string) => patch(id, (c) => ({ ...c, status: "Rejected", approved: false })), [patch]);

  // Admin assigns a department: also approves it (if not yet), sets priority, and status "Assigned".
  const assign = useCallback(
    (id: string, department: Department) =>
      patch(id, (c) => ({
        ...c,
        approved: true,
        priority: c.priority ?? mockPriority(`${c.title} ${c.description}`),
        department,
        status: "Assigned",
        assignedAt: new Date().toISOString(),
      })),
    [patch],
  );

  // Admin moves the complaint to a different department and records why.
  const reassign = useCallback(
    (id: string, department: Department, reason: string) =>
      patch(id, (c) => ({ ...c, department, status: "Assigned", assignedAt: new Date().toISOString(), reassignReason: reason })),
    [patch],
  );

  // Department changes the progress (e.g. Assigned -> In Progress -> Resolved).
  const setStatus = useCallback((id: string, status: ComplaintStatus) => patch(id, (c) => ({ ...c, status })), [patch]);

  // Look up one complaint by its tracking ID (ignores capital letters and extra spaces).
  const findById = useCallback(
    (id: string) => complaints.find((c) => c.id.toLowerCase() === id.trim().toLowerCase()),
    [complaints],
  );

  // Bundle everything into one object. useMemo keeps it stable so pages do not re-render needlessly.
  const value = useMemo(
    () => ({ complaints, loaded, submit, approve, reject, assign, reassign, setStatus, findById }),
    [complaints, loaded, submit, approve, reject, assign, reassign, setStatus, findById],
  );

  return <ComplaintsContext.Provider value={value}>{children}</ComplaintsContext.Provider>;
}

// The hook pages call to get the data and actions.
export function useComplaints(): ComplaintsContextValue {
  const ctx = useContext(ComplaintsContext);
  if (!ctx) throw new Error("useComplaints must be used inside <ComplaintProvider>");
  return ctx;
}
