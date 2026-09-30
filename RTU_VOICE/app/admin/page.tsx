"use client";
/**
 * app/admin/page.tsx  (URL: /admin)
 * -----------------------------------------------------------------
 * The ADMIN console (only the admin role can open it). Two tabs:
 *   1) Pending Validation -> new complaints: Approve / Reject / Assign Dept.
 *   2) Master Tracking    -> assigned complaints: Reassign
 * Also has statistic cards, a title search, and a newest/oldest sort.
 */
import { useState } from "react";
import Button from "@/components/Button";
import ConsoleHeader from "@/components/console/ConsoleHeader";
import { AssignDepartmentModal, ComplaintDetailsModal, ReassignModal } from "@/components/console/ConsoleModals";
import { SearchIcon } from "@/components/Icons";
import RequireRole from "@/components/RequireRole";
import Select from "@/components/Select";
import StatCard from "@/components/StatCard";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadge";
import { useComplaints } from "@/lib/complaints";
import { shortDate } from "@/lib/format";
import type { Complaint } from "@/types/complaint";

// The two tabs and the two sort choices.
type Tab = "pending" | "master";
type Sort = "newest" | "oldest";

// The actual admin page (protected by RequireRole at the bottom of this file).
function AdminConsole() {
  const { complaints, approve, reject, assign, reassign } = useComplaints();
  // Page state: current tab, search text, sort order, and which pop-up (if any) is open.
  const [tab, setTab] = useState<Tab>("pending");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [reassignId, setReassignId] = useState<string | null>(null);

  // Counts for the statistic cards and the two tab lists.
  const count = (s: Complaint["status"]) => complaints.filter((c) => c.status === s).length;
  const pending = complaints.filter((c) => c.status === "Pending");
  const master = complaints.filter((c) => c.status === "Assigned" || c.status === "In Progress" || c.status === "Resolved");

  // Which date to show/sort by: Master Tracking uses the assigned date.
  const rowDate = (c: Complaint) => (tab === "master" ? c.assignedAt ?? c.submittedAt : c.submittedAt);
  // Rows to display = the current tab's list, filtered by the search text, then sorted.
  const q = query.trim().toLowerCase();
  const rows = (tab === "pending" ? pending : master)
    .filter((c) => c.title.toLowerCase().includes(q))
    .sort((a, b) => {
      const diff = new Date(rowDate(b)).getTime() - new Date(rowDate(a)).getTime();
      return sort === "newest" ? diff : -diff;
    });

  // Find the complaint that a pop-up should show.
  const byId = (id: string | null) => complaints.find((c) => c.id === id);
  const details = byId(detailsId);
  const reassigning = byId(reassignId);

  // The Approve / Reject / Assign Dept. buttons (reused by table rows and phone cards).
  const pendingActions = (c: Complaint) => (
    <div className="actions">
      <Button small variant="approve" disabled={c.approved} onClick={() => approve(c.id)}>
        {c.approved ? "Approved" : "Approve"}
      </Button>
      <Button small variant="reject" onClick={() => reject(c.id)}>
        Reject
      </Button>
      <Button small variant="assign" onClick={() => setAssignId(c.id)}>
        Assign Dept.
      </Button>
    </div>
  );

  return (
    <div className="page">
      <ConsoleHeader label="Central Admin Console" shortLabel="Admin Console" />
      <main className="app-main console-main">
        {/* Statistic cards at the top */}
        <h1 className="section-title">Complaint Statistics</h1>
        <div className="stats stats-4">
          <StatCard label="Total Complaints" value={complaints.length} tone="total" />
          <StatCard label="Assigned" value={count("Assigned")} tone="assigned" />
          <StatCard label="In Progress" value={count("In Progress")} tone="progress" />
          <StatCard label="Resolved" value={count("Resolved")} tone="resolved" />
        </div>

        {/* Tabs on the left; search and sort on the right */}
        <div className="toolbar">
          <div className="tabs" role="tablist" aria-label="Complaint views">
            <button type="button" role="tab" id="tab-pending" aria-selected={tab === "pending"} aria-controls="panel-admin" className="tab" onClick={() => setTab("pending")}>
              Pending Validation ({pending.length})
            </button>
            <button type="button" role="tab" id="tab-master" aria-selected={tab === "master"} aria-controls="panel-admin" className="tab" onClick={() => setTab("master")}>
              Master Tracking ({master.length})
            </button>
          </div>
          <div className="tools">
            <div className="search-field">
              <SearchIcon />
              <input className="input" aria-label="Search title" placeholder="Search Title" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Select id="sort" aria-label="Sort" variant="compact" options={[{ value: "newest", label: "Sort: Newest" }, { value: "oldest", label: "Sort: Oldest" }]} value={sort} onChange={(e) => setSort(e.target.value as Sort)} />
          </div>
        </div>

        {/* The list for the selected tab: table on wide screens, cards on phones */}
        <div id="panel-admin" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          {rows.length === 0 ? (
            <p className="empty-note">{tab === "pending" ? "No complaints are waiting for validation." : "No tracked complaints match your search."}</p>
          ) : tab === "pending" ? (
            <>
              <div className="tbl-wrap tbl-lg">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((c) => (
                      <tr key={c.id}>
                        <td className="nowrap">{shortDate(c.submittedAt)}</td>
                        <td>
                          <button type="button" className="row-link" onClick={() => setDetailsId(c.id)}>
                            {c.title}
                          </button>
                        </td>
                        <td>{c.category}</td>
                        <td>
                          <StatusBadge status={c.status} />
                        </td>
                        <td>{pendingActions(c)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="mlist cards-lg">
                {rows.map((c) => (
                  <li key={c.id} className="card mcard">
                    <div className="mcard-top">
                      <button type="button" className="row-link mcard-title" onClick={() => setDetailsId(c.id)}>
                        {c.title}
                      </button>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="mcard-meta">
                      {c.category} • {shortDate(c.submittedAt)}
                    </p>
                    {pendingActions(c)}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div className="tbl-wrap tbl-lg">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Title</th>
                      <th>Priority Level</th>
                      <th>Category</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((c) => (
                      <tr key={c.id}>
                        <td className="nowrap">{shortDate(rowDate(c))}</td>
                        <td>
                          <button type="button" className="row-link" onClick={() => setDetailsId(c.id)}>
                            {c.title}
                          </button>
                        </td>
                        <td>
                          <PriorityBadge priority={c.priority} />
                        </td>
                        <td>{c.category}</td>
                        <td>{c.department ?? "—"}</td>
                        <td>
                          <StatusBadge status={c.status} />
                        </td>
                        <td>
                          <Button small variant="assign" onClick={() => setReassignId(c.id)}>
                            Reassign
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="mlist cards-lg">
                {rows.map((c) => (
                  <li key={c.id} className="card mcard">
                    <div className="mcard-top">
                      <button type="button" className="row-link mcard-title" onClick={() => setDetailsId(c.id)}>
                        {c.title}
                      </button>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="mcard-meta">
                      {c.category} • {shortDate(rowDate(c))}
                      {c.department ? ` • ${c.department}` : ""}
                    </p>
                    <div className="mcard-foot">
                      <span className="prio">
                        Priority: <PriorityBadge priority={c.priority} />
                      </span>
                      <Button small variant="assign" onClick={() => setReassignId(c.id)}>
                        Reassign
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>

      {/* Pop-ups: only one is open at a time */}
      {details && <ComplaintDetailsModal complaint={details} onClose={() => setDetailsId(null)} />}
      {assignId && (
        <AssignDepartmentModal
          onClose={() => setAssignId(null)}
          onConfirm={(d) => {
            assign(assignId, d);
            setAssignId(null);
          }}
        />
      )}
      {reassigning && (
        <ReassignModal
          complaint={reassigning}
          onClose={() => setReassignId(null)}
          onConfirm={(d, reason) => {
            reassign(reassigning.id, d, reason);
            setReassignId(null);
          }}
        />
      )}
    </div>
  );
}

// Only users with the "admin" role can see this page.
export default function AdminPage() {
  return (
    <RequireRole role="admin">
      <AdminConsole />
    </RequireRole>
  );
}
