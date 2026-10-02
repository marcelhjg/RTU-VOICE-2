"use client";
/**
 * components/CodeVerification.tsx
 * -----------------------------------------------------------------
 * The shared screen for entering the 6-character verification code. It is used
 * by BOTH the register verification (/verify) and the forgot-password
 * verification (/verify-code). Only the title, extra line, button text and
 * next page differ. MOCK: any complete 6-character code is accepted.
 */
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import AuthLayout, { AuthCard } from "./AuthLayout";
import Button from "./Button";
import VerificationCodeInput from "./VerificationCodeInput";
import { useCountdown } from "@/lib/useCountdown";
import { usePendingEmail } from "@/lib/pendingEmail";
import { CODE_LENGTH, type VerificationCode } from "@/types/auth";

// Settings that make each use of this screen different.
interface Props {
  title: string;
  extraLine?: string;
  submitLabel: string;
  nextRoute: string; // the page to open after a correct code
}

export default function CodeVerification({ title, extraLine, submitLabel, nextRoute }: Props) {
  const router = useRouter();
  const email = usePendingEmail(); // the email typed on the previous screen
  const [code, setCode] = useState<VerificationCode>("");
  const [error, setError] = useState<string>();
  const { remaining, restart } = useCountdown(60); // 60-second wait before "Resend code" works

  // When the form is submitted: make sure all 6 characters are filled, then go to the next page.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (code.length < CODE_LENGTH) {
      setError("Enter the 6-character code");
      return;
    }
    router.push(nextRoute); // mock verification, no backend in Phase 1
  };

  // The text under the title, including the email the code was "sent" to.
  const subtitle: ReactNode = (
    <>
      We sent you a 6-character code to <strong className="accent">{email}</strong>
      {extraLine && (
        <>
          <br />
          {extraLine}
        </>
      )}
    </>
  );

  return (
    <AuthLayout active="login">
      <AuthCard title={title} subtitle={subtitle}>
        <form onSubmit={onSubmit} noValidate>
          {/* The 6 small boxes for the digits */}
          <VerificationCodeInput
            value={code}
            onChange={(c) => {
              setCode(c);
              setError(undefined);
            }}
          />
          {error && (
            <p className="field-error code-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" block>
            {submitLabel}
          </Button>
        </form>
        <p className="foot">
          Didn&apos;t get it?{" "}
          {/* While the timer is running show the seconds; when it reaches 0 show a clickable link */}
          {remaining > 0 ? (
            <strong className="accent">Resend code ({remaining}s)</strong>
          ) : (
            <button type="button" className="link-btn" onClick={restart}>
              Resend code
            </button>
          )}
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
