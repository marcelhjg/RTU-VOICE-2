"use client";
/**
 * app/forgot/page.tsx  (URL: /forgot)
 * -----------------------------------------------------------------
 * FORGOT PASSWORD page: the user types their university email, then we
 * "send" a code and go to /verify-code. (MOCK: no email is really sent.)
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import AuthLayout, { AuthCard } from "@/components/AuthLayout";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { savePendingEmail } from "@/lib/pendingEmail";
import { hasErrors, validateForgot } from "@/lib/validation";
import type { FieldErrors, ForgotFormValues } from "@/types/auth";

export default function ForgotPage() {
  const router = useRouter();
  const [values, setValues] = useState<ForgotFormValues>({ email: "" });
  const [errors, setErrors] = useState<FieldErrors<ForgotFormValues>>({});

  // Runs when "Send Code" is pressed.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateForgot(values);
    setErrors(found);
    if (hasErrors(found)) return;
    savePendingEmail(values.email); // remember the email for the next screen
    router.push("/verify-code");
  };

  return (
    <AuthLayout active="login">
      <AuthCard title="Forgot your password?" subtitle="Enter your university email. We will send a verification code to it.">
        <form onSubmit={onSubmit} noValidate>
          <Input id="email" type="email" label="University Email" placeholder="you@rtu.edu.ph" autoComplete="email" value={values.email} onChange={(e) => setValues({ email: e.target.value })} error={errors.email} />
          <Button type="submit" block className="mt-submit">
            Send Code
          </Button>
        </form>
        <p className="foot">
          Remembered it? <Link href="/login">Back to login</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
