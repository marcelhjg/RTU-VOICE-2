"use client";
/**
 * app/(student)/dashboard/page.tsx  (URL: /dashboard)
 * -----------------------------------------------------------------
 * The student HOME page: a welcome message -
 * "Submit a New Complaint" and "Track an Old Complaint".
 */
import Link from "next/link";
import Button from "@/components/Button";
import { PencilIcon, SearchIcon } from "@/components/Icons";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { user } = useAuth(); // the logged-in student (for the name)
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

      <p className="see-more">
        See what others are reporting → <Link href="/public">Public Dashboard</Link>
      </p>
    </>
  );
}
