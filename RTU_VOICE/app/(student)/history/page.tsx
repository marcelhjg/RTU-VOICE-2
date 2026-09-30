"use client";
/**
 * app/(student)/history/page.tsx  (URL: /history)
 * -----------------------------------------------------------------
 * MY COMPLAINT HISTORY
 */
import Button from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth";
import { useComplaints } from "@/lib/complaints";
import { byNewest } from "@/lib/complaintUtils";
import { shortDate } from "@/lib/format";

export default function HistoryPage() {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  // Keep only this student's complaints (matched by email) and sort newest first.
  const mine = complaints.filter((c) => c.ownerEmail === user?.email).sort((a, b) => byNewest(a.submittedAt, b.submittedAt));

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
                    <td className="strong">{c.title}</td>
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
                  <h2 className="mcard-title">{c.title}</h2>
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
        <div className="empty">
          <p>You have not submitted any complaints yet.</p>
          <Button href="/submit" variant="outline">
            Submit a Complaint
          </Button>
        </div>
      )}
    </>
  );
}
