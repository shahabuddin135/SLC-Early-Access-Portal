import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { getDashboard } from "@/lib/api";
import ProfileHeader from "@/components/ProfileHeader";
import DownloadSection from "@/components/DownloadSection";
import ReviewForm from "@/components/ReviewForm";
import TermsAgreementModal from "@/components/TermsAgreementModal";

export default async function DashboardPage() {
  const token = await getAuthToken();

  if (!token) {
    redirect("/login");
  }

  const data = await getDashboard(token);

  if (!data) {
    redirect("/login");
  }

  return (
    <div className="page-center" style={{ justifyContent: "flex-start", paddingTop: 48 }}>
      {/* Blocking modal — shown until user agrees to WeWise Labs terms */}
      {!data.has_agreed_terms && <TermsAgreementModal />}

      <div className="container" style={{ maxWidth: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.25rem", flex: 1 }}>
            SLC Early Access Dashboard
          </h1>
          <span className="ww-badge" style={{ fontSize: "0.6875rem" }}>WeWise Labs</span>
        </div>

        <ProfileHeader user={data} />

        <DownloadSection hasDownloaded={data.has_downloaded} />

        {data.has_downloaded && (
          <div className="fade-in" style={{ marginTop: 24 }}>
            <ReviewForm />
          </div>
        )}
      </div>
    </div>
  );
}
