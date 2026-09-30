/**
 * lib/auth.tsx
 * -----------------------------------------------------------------
 * Handles login, logout and "who is logged in right now".
 * MOCK ONLY: there is no real password check. The EMAIL decides the
 * role (student / admin / department) and where the user lands.
 *
 * Pages use it like this:   const { user, login, logout } = useAuth();
 *
 * BACKEND NOTE: replace login / logout / registerUser with Supabase Auth.
 */
"use client"; // runs in the browser
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Department } from "@/types/complaint";
import type { RegisteredName, Role, User } from "@/types/user";
import { readJSON, removeKey, writeJSON } from "./storage";

// v2: an older saved login may hold an old department name, so we start a fresh session key.
const SESSION_KEY = "rtuvoice:session:v2"; // where the logged-in user is remembered
const USERS_KEY = "rtuvoice:users"; // where newly registered students are remembered

// Registered students, saved by email.
type StoredUsers = Record<string, RegisteredName>;

/**
 * MOCK ACCOUNTS (no backend). Any other @rtu.edu.ph address signs in as a student.
 *   student@rtu.edu.ph        -> Juan Dela Cruz (has demo history)
 *   admin@rtu.edu.ph          -> Central Admin Console
 *   One department account per department:
 *   academic@rtu.edu.ph       -> Academic
 *   facilities@rtu.edu.ph     -> Facilities & Infrastructure
 *   administrative@rtu.edu.ph -> Administrative
 *   welfare@rtu.edu.ph        -> Student Welfare
 *   studentlife@rtu.edu.ph    -> Student Life
 *   other@rtu.edu.ph          -> Other
 */
const STAFF: Record<string, { role: Role; department?: Department; firstName: string }> = {
  "admin@rtu.edu.ph": { role: "admin", firstName: "Admin" },
  "academic@rtu.edu.ph": { role: "department", department: "Academic", firstName: "Academic" },
  "facilities@rtu.edu.ph": { role: "department", department: "Facilities & Infrastructure", firstName: "Facilities" },
  "administrative@rtu.edu.ph": { role: "department", department: "Administrative", firstName: "Administrative" },
  "welfare@rtu.edu.ph": { role: "department", department: "Student Welfare", firstName: "Welfare" },
  "studentlife@rtu.edu.ph": { role: "department", department: "Student Life", firstName: "Student Life" },
  "other@rtu.edu.ph": { role: "department", department: "Other", firstName: "Other" },
};

// Makes the first letter a capital letter ("juan" -> "Juan").
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Turns an email into a User object. This is where the role is decided.
function resolveUser(rawEmail: string, users: StoredUsers): User {
  const email = rawEmail.trim().toLowerCase();
  // 1) Staff email (admin or department)?
  const staff = STAFF[email];
  if (staff) return { email, firstName: staff.firstName, lastName: "", role: staff.role, department: staff.department };
  // 2) The demo student?
  if (email === "student@rtu.edu.ph") return { email, firstName: "Juan", lastName: "Dela Cruz", role: "student" };
  // 3) A student who registered earlier?
  const registered = users[email];
  if (registered) return { email, ...registered, role: "student" };
  // 4) Anyone else with an @rtu.edu.ph email becomes a student named after their email.
  const local = email.split("@")[0] ?? "";
  return { email, firstName: cap(local.split(/[._-]/)[0] ?? ""), lastName: "", role: "student" };
}

// The first page each role sees after logging in.
export function homeFor(role: Role): string {
  return role === "admin" ? "/admin" : role === "department" ? "/department" : "/dashboard";
}

// Everything the rest of the app can use from this file.
interface AuthContextValue {
  user: User | null; // null = nobody is logged in
  /** False until the stored session has been read on the client. */
  ready: boolean;
  login: (email: string) => User;
  logout: () => void;
  registerUser: (info: RegisteredName & { email: string }) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Wraps the whole app (see components/AppProviders.tsx).
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // When the page opens: restore the saved login (so refreshing does not log you out).
  useEffect(() => {
    setUser(readJSON<User | null>(SESSION_KEY, null));
    setReady(true);
  }, []);

  // Log in: figure out the user from the email, save the session, and remember them.
  const login = useCallback((email: string) => {
    const next = resolveUser(email, readJSON<StoredUsers>(USERS_KEY, {}));
    writeJSON(SESSION_KEY, next);
    setUser(next);
    return next;
  }, []);

  // Log out: delete the saved session.
  const logout = useCallback(() => {
    removeKey(SESSION_KEY);
    setUser(null);
  }, []);

  // Save a new student's name so login can use it later.
  const registerUser = useCallback((info: RegisteredName & { email: string }) => {
    const users = readJSON<StoredUsers>(USERS_KEY, {});
    users[info.email.trim().toLowerCase()] = { firstName: info.firstName.trim(), lastName: info.lastName.trim() };
    writeJSON(USERS_KEY, users);
  }, []);

  const value = useMemo(() => ({ user, ready, login, logout, registerUser }), [user, ready, login, logout, registerUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The hook pages call to get the current user and login/logout actions.
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
