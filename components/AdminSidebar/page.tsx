"use client";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { AdminSidebarProps } from "@/lib/types";
import axios from "axios";
import { toast } from "sonner";
import NavLinks from "./NavLinks/page";
import NavFooter from "./NavFooter/page";
import MobileSidebar from "./MobileSidebar/page";

export function AdminSidebar({ userName }: AdminSidebarProps) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");
      if (res.status !== 200) throw new Error(res.data.message);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (e: unknown) {
      console.log(e);
      toast.error("Logout failed");
    } finally {
      router.refresh();
    }
  };

  return (
    <>
      <MobileSidebar userName={userName} handleLogout={handleLogout} />

      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LearnHub
          </span>
        </div>
        <div className="flex-1 px-3 py-4">
          <NavLinks />
        </div>
        <NavFooter userName={userName} handleLogout={handleLogout} />
      </aside>
    </>
  );
}
