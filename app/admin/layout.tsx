import { getCurrentUser } from "@/actions/auth";
import { AdminSidebar } from "@/components/AdminSidebar/page";
import { UserProps } from "@/lib/types";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  let user: UserProps | null = null;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.log(error);
  }
  return (
    <div>
      <AdminSidebar userName={user?.name || ""} />
      <main className={`lg:ml-64`}>{children}</main>
    </div>
  );
}
