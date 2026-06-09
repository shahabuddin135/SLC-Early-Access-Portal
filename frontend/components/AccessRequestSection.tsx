"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestAccessAction } from "@/app/actions/account";
import { capture } from "@/lib/analytics";
import DownloadSection from "@/components/DownloadSection";
import AccessKeyCard from "@/components/AccessKeyCard";
import type { AccessRequestStatus } from "@/lib/api";

interface AccessRequestSectionProps {
  emailVerified: boolean;
  accessRequestStatus: AccessRequestStatus | null;
  hasDownloaded: boolean;
  accessKey: string | null;
}

function InfoCard({
  title,
  children,
  accent = "var(--color-primary)",
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="card" style={{ borderLeft: `4px solid ${accent}` }}>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <div style={{ fontSize: "0.875rem", color: "var(--color-muted)", lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}

export default function AccessRequestSection({
  emailVerified,
  accessRequestStatus,
  hasDownloaded,
  accessKey,
}: AccessRequestSectionProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest() {
    setSubmitting(true);
    setError(null);
    const result = await requestAccessAction();
    if (result.ok) {
      capture("access_requested");
      router.refresh();
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  }

  // Already downloaded, or approved → let the user enter their key / re-download.
  if (hasDownloaded || accessRequestStatus === "granted") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {accessRequestStatus === "granted" && !hasDownloaded && (
          <InfoCard title="Access approved 🧡" accent="#22c55e">
            Welcome aboard! Your personal key is ready below — reveal it, copy it,
            and paste it into the download box. We also emailed you a copy. It&apos;s
            tied to your account, so only you can use it.
          </InfoCard>
        )}
        {accessKey && !hasDownloaded && (
          <AccessKeyCard
            keyValue={accessKey}
            caption="Hidden for your privacy — tap the eye to reveal, or Copy to grab it without revealing."
          />
        )}
        <DownloadSection hasDownloaded={hasDownloaded} />
      </div>
    );
  }

  if (accessRequestStatus === "pending") {
    return (
      <InfoCard title="Request pending review ⏳">
        Thanks! Your access request has been received. You&apos;ll get a unique
        download key by email once it&apos;s approved. No need to request again.
      </InfoCard>
    );
  }

  // No active request (none or previously denied).
  const denied = accessRequestStatus === "denied";

  if (!emailVerified) {
    return (
      <InfoCard title="Request framework access">
        Verify your email using the banner above, then you can request a download key
        for the SLC language &amp; framework.
      </InfoCard>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 8 }}>Request framework access</h3>
      <p style={{ fontSize: "0.875rem", color: "var(--color-muted)", marginBottom: 16, lineHeight: 1.6 }}>
        {denied
          ? "Your previous request wasn't approved. You can submit a new request below."
          : "Request a unique download key for the SLC language & framework. Once approved, your key is emailed to you and can only be redeemed by your account."}
      </p>

      {error && (
        <p className="error-text" style={{ marginBottom: 12 }}>
          {error}
        </p>
      )}

      <button className="btn-primary" onClick={handleRequest} disabled={submitting}>
        {submitting ? (
          <>
            <span className="spinner" /> Submitting…
          </>
        ) : (
          "Request Access"
        )}
      </button>
    </div>
  );
}
