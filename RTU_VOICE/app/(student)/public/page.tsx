"use client";
/**
 * app/(student)/public/page.tsx  (URL: /public)
 * -----------------------------------------------------------------
 * PUBLIC DASHBOARD: shows validated complaints of everyone (no names) so
 * the campus can see what is being reported and its progress.
 * Filters: Status and Category dropdowns.
 */
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { ChevronLeftIcon, ChevronRightIcon, FolderSearchIcon } from "@/components/Icons";
import Select from "@/components/Select";
import { StatusBadge } from "@/components/StatusBadge";
import { useComplaints } from "@/lib/complaints";
import { byNewest, isPublic } from "@/lib/complaintUtils";
import { excerpt } from "@/lib/format";
import { CATEGORIES, PUBLIC_STATUSES } from "@/types/complaint";
import type { ComplaintStatus } from "@/types/complaint";

const PAGE_SIZE = 4; // cards per page

export default function PublicDashboardPage() {
  const { complaints } = useComplaints();
  // The current filter choices (empty text = no filter) and the current page number.
  const [status, setStatus] = useState<ComplaintStatus | "">("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  // 1) keep only public complaints  2) apply the filters  3) newest first
  const visible = complaints
    .filter(isPublic)
    .filter((c) => (!status || c.status === status) && (!category || c.category === category))
    .sort((a, b) => byNewest(a.submittedAt, b.submittedAt));

  // Pagination math: how many pages, which page we are on, and which cards to show.
  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // Changing a filter always goes back to page 1.
  const setFilter = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };
  // The "Clear" button: remove all filters.
  const clear = () => {
    setStatus("");
    setCategory("");
    setPage(1);
  };

  return (
    <>
      <h1 className="page-title">Public Dashboard</h1>
      <p className="page-sub">A transparent view of concerns raised across campus.</p>

      {/* Filter bar: Status + Category dropdowns and a Clear button */}
      <div className="filters">
        <span className="filter-label">Filter:</span>
        <Select id="f-status" aria-label="Filter by status" variant="compact" placeholder="Status" options={PUBLIC_STATUSES} value={status} onChange={(e) => setFilter(setStatus)(e.target.value as ComplaintStatus | "")} />
        <Select id="f-category" aria-label="Filter by category" variant="compact" placeholder="Category" options={CATEGORIES} value={category} onChange={(e) => setFilter(setCategory)(e.target.value)} />
        <button type="button" className="link-btn" onClick={clear}>
          Clear
        </button>
      </div>

      {/* Nothing matches -> message. Otherwise -> the complaint cards */}
      {shown.length === 0 ? (
        <EmptyState
          icon={<FolderSearchIcon />}
          title="No public reports found"
          description="No complaints match these filters."
          action={<button type="button" className="link-btn" onClick={clear}>Clear filters</button>}
        />
      ) : (
        <ul className="pgrid">
          {shown.map((c) => (
            <li key={c.id} className="card pcard strip" data-status={c.status}>
              <div className="pcard-top">
                <span className="pcard-cat">{c.category}</span>
                <StatusBadge status={c.status} />
              </div>
              <h2 className="pcard-title">{c.title}</h2>
              <p className="pcard-text">{excerpt(c.description, 110)}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Page numbers, only when there is more than one page */}
      {pages > 1 && (
        <nav className="pager" aria-label="Pagination">
          <button type="button" aria-label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)}>
            <ChevronLeftIcon />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" className={n === current ? "on" : ""} aria-current={n === current ? "page" : undefined} onClick={() => setPage(n)}>
              {n}
            </button>
          ))}
          <button type="button" aria-label="Next page" disabled={current === pages} onClick={() => setPage(current + 1)}>
            <ChevronRightIcon />
          </button>
        </nav>
      )}
    </>
  );
}
