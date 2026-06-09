"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { verifyEmailAction } from "@/app/actions/account";

type State = "verifying" | "success" | "error";

export default function VerifyEmailClient({ token }: { token: string }) {
  const [state, setState] = useState<State>(token ? "verifying" : "error");
  const [message, setMessage] = useState<string>(
    token ? "" : "Missing verification token. Please use the link from your email."
  );
  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true; // guard against React StrictMode double-invoke
    (async () => {
      const result = await verifyEmailAction(token);
      if (result.ok) {
        setState("success");
        setMessage(result.message);
      } else {
        setState("error");
        setMessage(result.error);
      }
    })();
  }, [token]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "2rem", marginBottom: 12 }}>
        {state === "verifying" ? "⏳" : state === "success" ? "✅" : "⚠️"}
      </div>
      <h1 style={{ marginBottom: 10 }}>
        {state === "verifying"
          ? "Verifying your email…"
          : state === "success"
          ? "Email verified"
          : "Verification failed"}
      </h1>
      <p style={{ fontSize: "0.9375rem", color: "var(--color-muted)", marginBottom: 24 }}>
        {state === "verifying" ? "Hang tight while we confirm your address." : message}
      </p>

      {state !== "verifying" && (
        <Link href="/dashboard" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
          Go to dashboard
        </Link>
      )}
    </div>
  );
}
