import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { getDashboard, listAdminKeys } from "@/lib/api";
import AdminDashboard from "@/components/AdminDashboard";

// Admin emails — loaded from ADMIN_EMAILS env var (server-side only, never NEXT_PUBLIC_)
function getAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return new Set(raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));
}

export default async function AdminPage() {
  // 1. Must be authenticated
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 2. Must have a valid session
  const user = await getDashboard(token);
  if (!user) redirect("/login");

  // 3. Must be an admin — non-admins are redirected, not shown a 403
  if (!getAdminEmails().has(user.email.toLowerCase())) redirect("/dashboard");

  // 4. Load initial key data server-side
  const keysData = await listAdminKeys(token);
  if (!keysData) redirect("/dashboard");

  return (
    <div
      className="page-center"
      style={{ justifyContent: "flex-start", paddingTop: 48 }}
    >
      <div className="container" style={{ maxWidth: 900 }}>
        <AdminDashboard initialData={keysData} />
      </div>
    </div>
  );
}
