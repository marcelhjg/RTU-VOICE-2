import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  role?: "status" | "alert";
}

export default function EmptyState({ icon, title, description, action, role = "status" }: EmptyStateProps) {
  return (
    <div className="empty-state" role={role}>
      <span className="empty-state-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="empty-state-copy">
        <h2 className="empty-state-title">{title}</h2>
        <p>{description}</p>
      </div>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}