/**
 * lib/validation.ts
 * -----------------------------------------------------------------
 * The rules for the forms (login, register, forgot password, reset
 * password). Each function checks the values and returns an object of
 * error messages. An empty object means "no errors, all good".
 */
import type {
  FieldErrors,
  ForgotFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetFormValues,
} from "@/types/auth";

export const UNIVERSITY_DOMAIN = "rtu.edu.ph"; // only emails ending in this are accepted
export const EMAIL_ERROR = "Only official university emails allowed";
export const PASSWORD_HINT = "Use at least 8 characters.";

// True if the email ends with @rtu.edu.ph (capital letters and spaces are ignored).
export function isUniversityEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(`@${UNIVERSITY_DOMAIN}`);
}

// Returns an error message for a bad email, or undefined if the email is fine.
export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Enter your university email";
  if (!isUniversityEmail(email)) return EMAIL_ERROR;
  return undefined;
}

// Register form: names required, valid email, password 8+ characters, and both passwords must match.
export function validateRegister(v: RegisterFormValues): FieldErrors<RegisterFormValues> {
  const e: FieldErrors<RegisterFormValues> = {};
  if (!v.firstName.trim()) e.firstName = "Enter your first name";
  if (!v.lastName.trim()) e.lastName = "Enter your last name";
  const emailError = validateEmail(v.email);
  if (emailError) e.email = emailError;
  if (v.password.length < 8) e.password = PASSWORD_HINT;
  if (v.confirmPassword !== v.password) e.confirmPassword = "Passwords do not match";
  return e;
}

// Login form: valid email and a password that is not empty.
export function validateLogin(v: LoginFormValues): FieldErrors<LoginFormValues> {
  const e: FieldErrors<LoginFormValues> = {};
  const emailError = validateEmail(v.email);
  if (emailError) e.email = emailError;
  if (!v.password) e.password = "Enter your password";
  return e;
}

// Forgot password form: only needs a valid university email.
export function validateForgot(v: ForgotFormValues): FieldErrors<ForgotFormValues> {
  const e: FieldErrors<ForgotFormValues> = {};
  const emailError = validateEmail(v.email);
  if (emailError) e.email = emailError;
  return e;
}

// Reset password form: new password 8+ characters and both must match.
export function validateReset(v: ResetFormValues): FieldErrors<ResetFormValues> {
  const e: FieldErrors<ResetFormValues> = {};
  if (v.password.length < 8) e.password = PASSWORD_HINT;
  if (v.confirmPassword !== v.password) e.confirmPassword = "Passwords do not match";
  return e;
}

// True if the errors object has at least one error.
export const hasErrors = (e: object): boolean => Object.keys(e).length > 0;
