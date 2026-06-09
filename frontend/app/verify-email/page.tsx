import VerifyEmailClient from "@/components/VerifyEmailClient";

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <div className="page-center">
      <div className="container">
        <div className="card">
          <VerifyEmailClient token={token} />
        </div>
      </div>
    </div>
  );
}
