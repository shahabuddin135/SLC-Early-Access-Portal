import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

interface RegisterPageProps {
  searchParams: Promise<{ next?: string }>;
}

// Only same-origin paths survive the round-trip through registration.
function safeNext(next?: string): string | undefined {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const next = safeNext(params.next);

  return (
    <div className="page-center">
      <div className="container">
        <div className="card">
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <h1 style={{ marginBottom: 8 }}>SLC Early Access</h1>
            <p style={{ fontSize: "0.9375rem" }}>
              Register to get early access to the SLC language&nbsp;&amp;&nbsp;framework
            </p>
          </div>

          <RegisterForm next={next} />

          <div className="divider" />

          <p style={{ textAlign: "center", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
