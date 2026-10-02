"use client";
/**
 * app/register/page.tsx  (URL: /register)
 * -----------------------------------------------------------------
 * The REGISTER (Create Account) page. It checks the form, saves the
 * student's name, remembers the email for the next screen, then goes to
 * /verify to enter the 6-character code.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import AuthLayout, { AuthCard } from "@/components/AuthLayout";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/lib/auth";
import { savePendingEmail } from "@/lib/pendingEmail";
import { hasErrors, validateEmail, validateRegister } from "@/lib/validation";
import type { FieldErrors, RegisterFormValues } from "@/types/auth";

// Starting (empty) values of the form.
const empty: RegisterFormValues = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAuth();
  const [values, setValues] = useState<RegisterFormValues>(empty);
  const [errors, setErrors] = useState<FieldErrors<RegisterFormValues>>({});

  // Helper: update one field of the form while the user types.
  const set = (k: keyof RegisterFormValues) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  // Runs when "Create Account" is pressed.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateRegister(values);
    setErrors(found);
    if (hasErrors(found)) return;
    registerUser({ email: values.email, firstName: values.firstName, lastName: values.lastName });
    savePendingEmail(values.email); // mock only, no backend in Phase 1
    router.push("/verify");
  };

  return (
    <AuthLayout active="register">
      <AuthCard title="Create Account" subtitle={<span className="only-desktop">Enter your details to get started.</span>}>
        <form onSubmit={onSubmit} noValidate>
          <div className="row-2">
            <Input id="firstName" label="First Name" placeholder="Juan" autoComplete="given-name" value={values.firstName} onChange={set("firstName")} error={errors.firstName} />
            <Input id="lastName" label="Last Name" placeholder="Dela Cruz" autoComplete="family-name" value={values.lastName} onChange={set("lastName")} error={errors.lastName} />
          </div>
          <Input
            id="email"
            type="email"
            label="University Email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            // When the user leaves the email box, check it right away.
            onBlur={() => values.email && setErrors((er) => ({ ...er, email: validateEmail(values.email) }))}
            error={errors.email}
          />
          <PasswordInput id="password" label="Password" autoComplete="new-password" value={values.password} onChange={set("password")} error={errors.password} />
          <PasswordInput id="confirmPassword" label="Confirm Password" autoComplete="new-password" value={values.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />
          <Button type="submit" block className="mt-submit">
            Create Account
          </Button>
        </form>
        <p className="foot only-desktop">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
