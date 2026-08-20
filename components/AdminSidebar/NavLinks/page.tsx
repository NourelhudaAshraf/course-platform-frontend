"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Webcam,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NavLinks({
  onItemClick,
}: {
  readonly onItemClick?: () => void;
}) {
  const navItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Courses", href: "/admin/courses", icon: BookOpen },
    { title: "Payments", href: "/admin/payments", icon: CreditCard },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Main Website", href: "/", icon: Webcam },
  ];
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
