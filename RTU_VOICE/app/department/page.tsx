"use client";
/**
 * app/department/page.tsx  (URL: /department)
 * -----------------------------------------------------------------
 * The DEPARTMENT portal (only department accounts can open it). It shows
 * only the complaints assigned to the logged-in department, with statistic
 * cards, a tracking-ID search, a status filter, and a dropdown to update
 * each complaint's status (Assigned / In Progress / Resolved).
 */
import { useState } from "react";
import { ComplaintDetailsModal } from "@/components/console/ConsoleModals";
import ConsoleHeader from "@/components/console/ConsoleHeader";
import { SearchIcon } from "@/components/Icons";
import RequireRole from "@/components/RequireRole";
import Select from "@/components/Select";
import StatCard from "@/components/StatCard";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth";
import { useComplaints } from "@/lib/complaints";
import { byNewest } from "@/lib/complaintUtils";
import { excerpt, shortDate, shortId } from "@/lib/format";
import { PUBLIC_STATUSES } from "@/types/complaint";
import type { Complaint, WorkStatus } from "@/types/complaint";

// The actual page (protected by RequireRole at the bottom of this file).
function DepartmentPortal() {
  const { user } = useAuth();
  const { complaints, setStatus } = useComplaints();
  // Search text and status filter.
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const dept = user?.department; // which department this account belongs to (one of the six in types/complaint.ts)
  // Only complaints assigned to THIS department and already in progress of work.
  const mine = complaints.filter((c) => c.department === dept && (PUBLIC_STATUSES as readonly string[]).includes(c.status));
  const count = (s: WorkStatus) => mine.filter((c) => c.status === s).length;

  // Apply the tracking-ID search and status filter, newest assignment first.
  const q = query.trim().toLowerCase();
  const rows = mine
    .filter((c) => c.id.toLowerCase().includes(q) && (!filter || c.status === filter))
    .sort((a, b) => byNewest(a.assignedAt ?? a.submittedAt, b.assignedAt ?? b.submittedAt));
  const details = mine.find((c) => c.id === detailsId);

  // The status dropdown used to update a complaint (reused by rows and cards).
  const updater = (c: Complaint, id: string) => (
    <Select
      id={id}
      aria-label={`Update status for ${shortId(c.id)}`}
      variant="compact"
      options={PUBLIC_STATUSES}
      value={c.status}
      onChange={(e) => setStatus(c.id, e.target.value as WorkStatus)}
    />
  );

  return (
    <div className="page">
      <ConsoleHeader label={`${dept ?? ""} Department`} shortLabel={`${dept ?? ""} Dept.`} />
      <main className="app-main console-main">
        <div className="console-page-intro">
          <h1 className="section-title">Department Overview</h1>
          <p className="page-sub">Review complaints assigned to your department.</p>
        </div>
        {/* Statistic cards */}
        <div className="stats stats-3">
          <StatCard label="Assigned" value={count("Assigned")} tone="assigned" />
          <StatCard label="In Progress" value={count("In Progress")} tone="progress" />
          <StatCard label="Resolved" value={count("Resolved")} tone="resolved" />
        </div>

        {/* Search and filter */}
        <div className="tools tools-wide">
          <div className="search-field grow">
            <SearchIcon />
            <input className="input" aria-label="Search tracking ID" placeholder="Tracking ID" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
          </div>
          <Select id="status-filter" aria-label="Status filter" variant="compact" placeholder="Status filter" options={PUBLIC_STATUSES} value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>

        {/* No results -> message. Otherwise a table (wide) and cards (phones). */}
        {rows.length === 0 ? (
          <p className="empty-note">No complaints assigned to this department match your search.</p>
        ) : (
          <>
            <div className="tbl-wrap tbl-lg">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Priority Level</th>
                    <th>Title</th>
                    <th>Summary</th>
                    <th>Assigned</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id}>
                      <td className="strong nowrap">{shortId(c.id)}</td>
                      <td>
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td>
                        <button type="button" className="row-link" onClick={() => setDetailsId(c.id)}>
                          {c.title}
                        </button>
                      </td>
                      <td className="muted">{excerpt(c.description, 48)}</td>
                      <td className="nowrap">{shortDate(c.assignedAt ?? c.submittedAt)}</td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td>{updater(c, `u-${c.id}`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mlist cards-lg">
              {rows.map((c) => (
                <li key={c.id} className="card mcard">
                  <div className="mcard-top">
                    <h2 className="mcard-title">{shortId(c.id)}</h2>
                    <StatusBadge status={c.status} />
                  </div>
                  <button type="button" className="row-link mcard-title" onClick={() => setDetailsId(c.id)}>
                    {c.title}
                  </button>
                  <p className="mcard-meta">{excerpt(c.description, 90)}</p>
                  <p className="prio">
                    Priority: <PriorityBadge priority={c.priority} /> <span className="muted">• Assigned {shortDate(c.assignedAt ?? c.submittedAt)}</span>
                  </p>
                  {updater(c, `m-${c.id}`)}
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
      {details && <ComplaintDetailsModal complaint={details} onClose={() => setDetailsId(null)} />}
    </div>
  );
}

// Only users with the "department" role can see this page.
export default function DepartmentPage() {
  return (
    <RequireRole role="department">
      <DepartmentPortal />
    </RequireRole>
  );
}
