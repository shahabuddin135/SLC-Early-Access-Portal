import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="page-center">
      <div className="container">
        <div className="card">
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <h1 style={{ marginBottom: 8 }}>Reset your password</h1>
            <p style={{ fontSize: "0.9375rem" }}>
              Enter your account email and we&apos;ll send you a reset link.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}