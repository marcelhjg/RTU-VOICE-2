/**
 * types/user.ts
 * -----------------------------------------------------------------
 * What a logged-in user looks like. The "role" decides which pages
 * the user can open (student, admin, or department).
 */
import type { Department } from "./complaint";

export type Role = "student" | "admin" | "department";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  department?: Department; // only department accounts have this
}

// Name saved when a student registers.
export interface RegisteredName {
  firstName: string;
  lastName: string;
}
