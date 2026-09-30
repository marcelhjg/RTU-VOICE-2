/**
 * app/verify-code/page.tsx  (URL: /verify-code)
 * -----------------------------------------------------------------
 * Verification screen for FORGOT PASSWORD. It reuses the shared
 * CodeVerification component; when done it goes to /reset.
 */
import CodeVerification from "@/components/CodeVerification";

export default function VerifyCodePage() {
  return <CodeVerification title="Enter the code" submitLabel="Verify Code" nextRoute="/reset" />;
}
