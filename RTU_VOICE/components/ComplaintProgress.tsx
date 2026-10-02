import type { ComplaintStatus } from "@/types/complaint";
import { StatusBadge } from "@/components/StatusBadge";

const STEPS = [
  { status: "Pending", label: "Pending review" },
  { status: "Assigned", label: "Assigned" },
  { status: "In Progress", label: "In progress" },
  { status: "Resolved", label: "Resolved" },
] as const;

export default function ComplaintProgress({ status }: { status: ComplaintStatus }) {
  if (status === "Rejected") {
    return (
      <div className="progress-rejected" role="status">
        <StatusBadge status={status} />
        <p>This report was not approved during review.</p>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.status === status);

  return (
    <ol className="complaint-progress" aria-label={`Complaint progress: ${status}`}>
      {STEPS.map((step, index) => {
        const complete = index < currentIndex;
        const current = index === currentIndex;
        return (
          <li
            key={step.status}
            className={`progress-step ${complete ? "is-complete" : current ? "is-current" : "is-upcoming"}`}
            aria-current={current ? "step" : undefined}
          >
            <span className="progress-marker">{complete ? "✓" : index + 1}</span>
            <span className="progress-label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}