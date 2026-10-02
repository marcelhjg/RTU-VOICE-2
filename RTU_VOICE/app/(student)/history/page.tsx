"use client";
import { useState } from "react";
/**
 * app/(student)/history/page.tsx  (URL: /history)
 * -----------------------------------------------------------------
 * MY COMPLAINT HISTORY
 */
import Button from "@/components/Button";
import { ComplaintDetailsModal } from "@/components/console/ConsoleModals";
import EmptyState from "@/components/EmptyState";
import { EmptyFolderIcon } from "@/components/Icons";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth";
import { useComplaints } from "@/lib/complaints";
import { byNewest } from "@/lib/complaintUtils";
import { shortDate } from "@/lib/format";

export default function HistoryPage() {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const [detailsId, setDetailsId] = useState<string | null>(null);
  // Keep only this student's complaints (matched by email) and sort newest first.
  const mine = complaints.filter((c) => c.ownerEmail === user?.email).sort((a, b) => byNewest(a.submittedAt, b.submittedAt));
  const details = mine.find((complaint) => complaint.id === detailsId);

  return (
    <>
      <h1 className="page-title">My Complaint History</h1>
      <p className="page-sub">All complaints you have submitted.</p>

      {/* Has complaints -> show them. No complaints -> show a friendly empty message. */}
      {mine.length > 0 ? (
        <>
          {/* Table version (wide screens) */}
          <div className="tbl-wrap tbl-md">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Complaint Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mine.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <button type="button" className="row-link" onClick={() => setDetailsId(c.id)}>
                        {c.title}
                      </button>
                    </td>
                    <td>{c.category}</td>
                    <td>{shortDate(c.submittedAt)}</td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Card version (phones); CSS shows only one of the two versions at a time */}
          <ul className="mlist cards-md">
            {mine.map((c) => (
              <li key={c.id} className="card mcard strip" data-status={c.status}>
                <div className="mcard-top">
                  <button type="button" className="row-link mcard-title" onClick={() => setDetailsId(c.id)}>
                    {c.title}
                  </button>
                  <StatusBadge status={c.status} />
                </div>
                <p className="mcard-meta">
                  {c.category} • {shortDate(c.submittedAt)}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <EmptyState
          icon={<EmptyFolderIcon />}
          title="No complaints yet"
          description="You have not submitted any complaints yet."
          action={<Button href="/submit" variant="outline">Submit a complaint</Button>}
        />
      )}
      {details && <ComplaintDetailsModal complaint={details} onClose={() => setDetailsId(null)} />}
    </>
  );
}
