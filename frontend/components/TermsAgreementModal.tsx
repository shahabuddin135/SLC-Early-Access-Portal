"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { agreeToTermsAction } from "@/app/actions/terms";

export default function TermsAgreementModal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAgree() {
    setLoading(true);
    setError(null);
    const result = await agreeToTermsAction();
    if (result.ok) {
      router.refresh(); // re-runs server component; modal unmounts when has_agreed_terms=true
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleDisagree() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card fade-in">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span className="ww-badge">WeWise Labs</span>
          <h2 style={{ marginTop: 14, marginBottom: 6, fontSize: "1.25rem" }}>
            Confidential Access Agreement
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>
            You must read and agree to these terms before accessing the SLC dashboard.
          </p>
        </div>

        {/* ── Terms body ─────────────────────────────────────────────────── */}
        <div className="terms-body">

          <div className="terms-section">
            <h4>© 2026 WeWise Labs — All Rights Reserved</h4>
            <p>
              The SLC (Structured Language &amp; Compiler) framework and programming
              language are the exclusive intellectual property of{" "}
              <strong style={{ color: "var(--color-text)" }}>WeWise Labs</strong>.
              WeWise Labs is a research &amp; development company specialising in
              AI SaaS products and advanced language tooling. All designs, source
              code, documentation, and associated materials are proprietary and
              strictly confidential.
            </p>
          </div>

          <div className="terms-section">
            <h4>About WeWise Labs</h4>
            <p>
              WeWise Labs builds cutting-edge AI SaaS products and conducts
              deep R&amp;D in programming language design, compiler engineering,
              and developer tooling. The SLC framework is a flagship internal
              research project. Participants in this early-access programme play
              a direct role in shaping its future.
            </p>
          </div>

          <div className="terms-section">
            <h4>Confidential Pre-Release Access</h4>
            <p>
              You have been granted{" "}
              <strong style={{ color: "var(--color-primary)" }}>
                confidential, personal, non-transferable early access
              </strong>{" "}
              to test and provide feedback on the SLC framework. This access
              is provided solely for evaluation and improvement purposes within
              the WeWise Labs closed research programme.
            </p>
          </div>

          <div className="terms-section">
            <h4>Non-Disclosure &amp; Non-Distribution Obligations</h4>
            <p>
              By clicking <em>I Agree</em> below, you explicitly and irrevocably
              agree that you will <strong style={{ color: "var(--color-error)" }}>NOT</strong>:
            </p>
            <ul>
              <li>
                Upload, push, or commit any SLC framework files, source code,
                or documentation to any repository — including GitHub, GitLab,
                Bitbucket, or any other version-control platform (public or private).
              </li>
              <li>
                Share, distribute, forward, or transmit any part of the SLC
                framework with any individual or organisation not explicitly
                authorised by WeWise Labs.
              </li>
              <li>
                Reproduce, copy, publish, or sublicense any portion of the
                framework without prior written consent from WeWise Labs.
              </li>
              <li>
                Use the SLC framework or its derivatives for any commercial
                purpose without a separate written agreement.
              </li>
            </ul>
          </div>

          <div className="terms-section">
            <h4>Enforcement</h4>
            <p>
              Any breach of these obligations constitutes a violation of WeWise
              Labs&apos; intellectual property rights and may result in immediate
              access revocation and legal action. Unauthorised distribution to
              public repositories will be reported to the relevant platforms
              immediately and pursued to the fullest extent of the law.
            </p>
          </div>

          <div className="terms-section">
            <h4>Contact</h4>
            <p>
              For questions, issues, or to obtain your download key, contact
              WeWise Labs at{" "}
              <a href="mailto:wewiselabs@gmail.com">wewiselabs@gmail.com</a>.
            </p>
          </div>

        </div>

        {/* ── Audit notice ───────────────────────────────────────────────── */}
        <p style={{
          fontSize: "0.75rem",
          color: "var(--color-muted)",
          marginTop: 16,
          marginBottom: 4,
          textAlign: "center",
          lineHeight: 1.5,
        }}>
          Your agreement will be recorded with a timestamp for audit and
          compliance purposes.
        </p>

        {error && (
          <p className="error-text" style={{ textAlign: "center", marginBottom: 8 }}>
            {error}
          </p>
        )}

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          <button
            className="btn-primary"
            onClick={handleAgree}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Recording Agreement…</>
            ) : (
              "✓  I Have Read &amp; Agree to the Terms"
            )}
          </button>
          <button
            className="btn-danger"
            onClick={handleDisagree}
            disabled={loading}
          >
            I Disagree — Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
