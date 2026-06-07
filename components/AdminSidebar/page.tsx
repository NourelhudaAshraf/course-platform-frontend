"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Menu,
  GraduationCap,
  Webcam,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebarProps } from "@/lib/types";
import axios from "axios";
import { toast } from "sonner";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Courses", href: "/admin/courses", icon: BookOpen },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Main Website", href: "/", icon: Webcam },
];

function NavLinks({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  if (!pathname.startsWith("/admin")) return <></>;
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4",
                isActive ? "text-blue-700" : "text-gray-500",
              )}
            />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

const getInitials = (userName: string) => {
  return userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const Footer = (userName: string, handleLogout: () => void) => {
  return (
    <div className="border-t border-gray-200 p-4">
      <Link href={"/admin/profile"}>
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-linear-to-r from-blue-500 to-purple-500 text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </Link>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-red-600 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};
export function AdminSidebar({ userName }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,
        { withCredentials: true },
      );
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
      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon-lg"
              className="bg-white shadow-md"
            >
              <Menu className="h-10 w-10" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center gap-2 border-b px-6">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LearnHub
                </span>
              </div>
              <div className="flex-1 px-3 py-4">
                <NavLinks onItemClick={() => setOpen(false)} />
              </div>
              {Footer(userName, handleLogout)}
            </div>
          </SheetContent>
        </Sheet>
      </div>

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
        {Footer(userName, handleLogout)}
      </aside>
    </>
  );
}
