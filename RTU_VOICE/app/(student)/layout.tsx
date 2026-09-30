/**
 * app/(student)/layout.tsx
 * -----------------------------------------------------------------
 * Wraps every student page (dashboard, submit, track, public, history)
 * with the student header + side menu (StudentShell).
 * The folder name "(student)" has parentheses, so it does NOT appear in the URL.
 */
import StudentShell from "@/components/StudentShell";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}
