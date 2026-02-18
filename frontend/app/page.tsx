import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

export default function HomePage() {
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

          <RegisterForm />

          <div className="divider" />

          <p style={{ textAlign: "center", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}