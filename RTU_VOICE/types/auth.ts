/**
 * types/auth.ts
 * -----------------------------------------------------------------
 * The shapes of the login / register / forgot / reset form values.
 */
export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface LoginFormValues {
  email: string;
  password: string;
}
export interface ForgotFormValues {
  email: string;
}
export interface ResetFormValues {
  password: string;
  confirmPassword: string;
}
// For any form: an optional error message for each field.
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Digits entered so far (0–6 characters, digits only). */
export type VerificationCode = string;
export const CODE_LENGTH = 6; // the verification code has 6 digits
