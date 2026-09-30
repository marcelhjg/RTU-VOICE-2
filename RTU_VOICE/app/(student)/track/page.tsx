"use client";
/**
 * app/(student)/track/page.tsx  (URL: /track)
 * -----------------------------------------------------------------
 * TRACK STATUS page: the student pastes a tracking ID (like TRK-8F3K-92QD)
 * and sees the complaint's title, category, date and status.
 * You can also open it with ?id=TRK-... in the URL.
 */
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/Button";
import { SearchIcon } from "@/components/Icons";
import { StatusBadge } from "@/components/StatusBadge";
import { useComplaints } from "@/lib/complaints";
import { longDate } from "@/lib/format";

// The real page content (wrapped by TrackPage below because it reads the URL).
function TrackInner() {
  const params = useSearchParams();
  // If the URL has ?id=..., use it as the starting value.
  const initial = params.get("id") ?? "";
  const { findById, loaded } = useComplaints();
  const [input, setInput] = useState(initial); // what is typed in the box
  const [queried, setQueried] = useState(initial); // the ID that was actually searched (set when Track is pressed)

  // Look for the complaint with that ID (undefined = not found).
  const result = queried ? findById(queried) : undefined;

  // Runs when the Track button is pressed.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setQueried(input.trim());
  };

  return (
    <div className="track">
      <h1 className="form-title center">Track your Complaint</h1>
      <p className="page-sub center">Enter your tracking ID to view the latest status.</p>

      <form className="track-form" onSubmit={onSubmit} role="search">
        <div className="search-field">
          <SearchIcon />
          <input className="input" aria-label="Tracking ID" placeholder="Paste Tracking ID" value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" />
        </div>
        <Button type="submit">Track</Button>
      </form>

      {/* Found: show the complaint's status card */}
      {result && (
        <section className="card track-result" aria-live="polite">
          <p className="track-kicker">Current Status</p>
          <div className="track-row">
            <div>
              <h2 className="track-title">{result.title}</h2>
              <p className="track-meta">
                {result.category} • {longDate(result.submittedAt)}
              </p>
            </div>
            <StatusBadge status={result.status} />
          </div>
        </section>
      )}
      {/* Not found: show an error message */}
      {queried && !result && loaded && (
        <p className="field-error center-row" role="alert">
          No complaint found for that tracking ID. Check the ID and try again.
        </p>
      )}
    </div>
  );
}

// Suspense is required by Next.js when a page reads the URL (useSearchParams).
export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackInner />
    </Suspense>
  );
}
