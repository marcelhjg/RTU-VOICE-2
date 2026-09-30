/**
 * components/StatCard.tsx
 * -----------------------------------------------------------------
 * One colored number card (e.g. "Total Complaints: 12") shown at the
 * top of the Admin and Department pages. `tone` picks the card color.
 */
export type StatTone = "total" | "assigned" | "progress" | "resolved";

export default function StatCard({ label, value, tone }: { label: string; value: number; tone: StatTone }) {
  return (
    <div className={`stat stat-${tone}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-num">{value}</p>
    </div>
  );
}
