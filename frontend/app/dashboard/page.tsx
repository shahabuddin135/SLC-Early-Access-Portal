import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { getDashboard } from "@/lib/api";
import ProfileHeader from "@/components/ProfileHeader";
import DownloadSection from "@/components/DownloadSection";
import ReviewForm from "@/components/ReviewForm";

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
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 style={{ marginBottom: 24, fontSize: "1.25rem" }}>
          SLC Early Access Dashboard
        </h1>

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
