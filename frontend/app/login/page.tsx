import Link from "next/link";
import LoginForm from "@/components/LoginForm";

interface LoginPageProps {
  searchParams: Promise<{ registered?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const justRegistered = params.registered === "1";

  return (
    <div className="page-center">
      <div className="container">
        <div className="card">
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <h1 style={{ marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: "0.9375rem" }}>
              Sign in to your SLC Early Access account
            </p>
          </div>

          {justRegistered && (
            <p className="success-text" style={{ marginBottom: 20, textAlign: "center" }}>
              Account created! Please log in below.
            </p>
          )}

          <LoginForm />

          <div className="divider" />

          <p style={{ textAlign: "center", fontSize: "0.875rem" }}>
            Don&apos;t have an account?{" "}
            <Link href="/">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
