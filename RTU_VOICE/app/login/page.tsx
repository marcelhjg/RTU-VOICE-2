"use client";
/**
 * app/login/page.tsx  (URL: /login)
 * -----------------------------------------------------------------
 * The LOGIN page. After a successful login, the user's role decides where
 * they go: student -> /dashboard, admin -> /admin, department -> /department.
 * MOCK: any password works (see lib/auth.tsx for the demo emails).
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import AuthLayout, { AuthCard } from "@/components/AuthLayout";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import { homeFor, useAuth } from "@/lib/auth";
import { hasErrors, validateLogin } from "@/lib/validation";
import type { FieldErrors, LoginFormValues } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  // What the user typed, and the error messages to show.
  const [values, setValues] = useState<LoginFormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<LoginFormValues>>({});

  // Runs when the Login button is pressed.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault(); // stop the browser from reloading the page
    const found = validateLogin(values);
    setErrors(found);
    if (hasErrors(found)) return; // stop here if something is wrong
    const user = login(values.email); // mock sign-in, role decides the landing page
    router.push(homeFor(user.role));
  };

  return (
    <AuthLayout active="login">
      <AuthCard title="Login" subtitle="Welcome back! Please enter your details." showLogo>
        <form onSubmit={onSubmit} noValidate>
          <Input id="email" type="email" label="University Email" placeholder="you@rtu.edu.ph" autoComplete="email" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} error={errors.email} />
          <PasswordInput id="password" label="Password" autoComplete="current-password" value={values.password} onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))} error={errors.password} />
          <div className="forgot">
            <Link href="/forgot">Forgot password?</Link>
          </div>
          <Button type="submit" block>
            Login
          </Button>
        </form>
        <p className="foot">
          <span className="only-desktop">Don&apos;t have an account yet?</span>
          <span className="only-mobile">No account yet?</span> <Link href="/register">Register</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
