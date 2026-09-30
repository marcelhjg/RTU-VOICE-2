"use client";
/**
 * app/reset/page.tsx  (URL: /reset)
 * -----------------------------------------------------------------
 * RESET PASSWORD page: the user types a new password twice. When valid,
 * they go back to /login. (MOCK: the password is not really saved.)
 */
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import AuthLayout, { AuthCard } from "@/components/AuthLayout";
import Button from "@/components/Button";
import PasswordInput from "@/components/PasswordInput";
import { hasErrors, validateReset } from "@/lib/validation";
import type { FieldErrors, ResetFormValues } from "@/types/auth";

export default function ResetPage() {
  const router = useRouter();
  const [values, setValues] = useState<ResetFormValues>({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FieldErrors<ResetFormValues>>({});

  // Runs when "Reset Password" is pressed.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateReset(values);
    setErrors(found);
    if (hasErrors(found)) return;
    router.push("/login");
  };

  return (
    <AuthLayout active="login">
      <AuthCard title="Set a new password">
        <form onSubmit={onSubmit} noValidate>
          <PasswordInput id="password" label="New Password" autoComplete="new-password" value={values.password} onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))} error={errors.password} />
          <PasswordInput id="confirmPassword" label="Confirm New Password" autoComplete="new-password" value={values.confirmPassword} onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))} error={errors.confirmPassword} />
          <Button type="submit" block className="mt-submit">
            Reset Password
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
