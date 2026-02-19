import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { getDashboard, listAdminKeys } from "@/lib/api";
import AdminDashboard from "@/components/AdminDashboard";

// Admin emails — must match the backend constants.py list
const ADMIN_EMAILS = new Set([
  "voyagersvrs135@gmail.com",
  "aleemabeera@gmail.com",
  "sarfarazsaba11@gmail.com",
  "darakhshanimranid@gmail.com",
  "myscienceworld135@gmail.com",
]);

export default async function AdminPage() {
  // 1. Must be authenticated
  const token = await getAuthToken();
  if (!token) redirect("/login");

  // 2. Must have a valid session
  const user = await getDashboard(token);
  if (!user) redirect("/login");

  // 3. Must be an admin — non-admins are redirected, not shown a 403
  if (!ADMIN_EMAILS.has(user.email)) redirect("/dashboard");

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
