/**
 * components/AppProviders.tsx
 * -----------------------------------------------------------------
 * Wraps the whole app with the two shared "data boxes":
 *   - AuthProvider       -> who is logged in
 *   - ComplaintProvider  -> the complaints list and actions
 * Because they wrap everything, any page can use useAuth() and useComplaints().
 */
"use client";
import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import { ComplaintProvider } from "@/lib/complaints";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ComplaintProvider>{children}</ComplaintProvider>
    </AuthProvider>
  );
}
