"use client";
/**
 * app/(student)/dashboard/page.tsx  (URL: /dashboard)
 * -----------------------------------------------------------------
 * The student HOME page: a welcome message -
 * "Submit a New Complaint" and "Track an Old Complaint".
 */
import Link from "next/link";
import Button from "@/components/Button";
import ComplaintProgress from "@/components/ComplaintProgress";
import EmptyState from "@/components/EmptyState";
import { EmptyFolderIcon, PencilIcon, SearchIcon } from "@/components/Icons";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth";
import { useComplaints } from "@/lib/complaints";
import { byNewest } from "@/lib/complaintUtils";
import { shortDate } from "@/lib/format";

export default function DashboardPage() {
  const { user } = useAuth(); // the logged-in student (for the name)
  const { complaints, loaded } = useComplaints();
  const recent = complaints
    .filter((complaint) => complaint.ownerEmail === user?.email)
    .sort((a, b) => byNewest(a.submittedAt, b.submittedAt))
    .slice(0, 3);

  return (
    <>
      <h1 className="page-title">Welcome, {user?.firstName}</h1>
      <p className="page-sub">What would you like to do today?</p>

      {/* The two big cards side by side */}
      <div className="action-grid">
        <section className="card action-card">
          <span className="tile tile-gold">
            <PencilIcon />
          </span>
          <h2 className="action-title">Submit a New Complaint</h2>
          <p className="action-text">Report a new issue or concern to the RTU Voice system. Our team will review and respond promptly.</p>
          <Button href="/submit" variant="gold">
            Submit
          </Button>
        </section>
        <section className="card action-card">
          <span className="tile tile-blue">
            <SearchIcon />
          </span>
          <h2 className="action-title">Track an Old Complaint</h2>
          <p className="action-text">Check the status of your previously submitted complaints and view any updates from the administration.</p>
          <Button href="/track" variant="outline">
            Track
          </Button>
        </section>
      </div>

      <section className="recent-reports" aria-labelledby="recent-reports-title">
        <div className="recent-reports-head">
          <div>
            <h2 id="recent-reports-title" className="section-title">Your recent reports</h2>
            <p className="page-sub">Quick access to your latest submissions.</p>
          </div>
          {recent.length > 0 && (
            <Button href="/history" variant="outline" small>
              View history
            </Button>
          )}
        </div>
        {!loaded ? (
          <p className="recent-loading" role="status">Loading reports...</p>
        ) : recent.length > 0 ? (
          <ul className="recent-report-list">
            {recent.map((complaint) => (
              <li key={complaint.id} className="recent-report">
                <div className="recent-report-copy">
                  <h3>{complaint.title}</h3>
                  <p>{complaint.category} · {shortDate(complaint.submittedAt)}</p>
                </div>
                <StatusBadge status={complaint.status} />
                <Button href={`/track?id=${encodeURIComponent(complaint.id)}`} variant="outline" small>
                  Track
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<EmptyFolderIcon />}
            title="No reports yet"
            description="Your submitted complaints will appear here."
            action={<Button href="/submit" variant="gold">Submit a complaint</Button>}
          />
        )}
      </section>

      <p className="see-more">
        See what others are reporting → <Link href="/public">Public Dashboard</Link>
      </p>
    </>
  );
}
