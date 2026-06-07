import { getCurrentUser } from "@/actions/auth";
import Footer from "@/components/Footer/page";
import Navbar from "@/components/Navbar/page";
import { UserProps } from "@/lib/types";
import { redirect } from "next/navigation";

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
      <Navbar name={user?.name} role={user?.role} />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
