"use client";
import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { NavbarProps } from "@/lib/types";
import MobileMenu from "./MobileMenu/page";
import AvatarMenu from "./AvatarMenu/page";
import axios from "axios";

export default function Navbar({ name, role }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/admin", requiresAuth: true },
    // { name: "Courses", href: "#courses" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative bg-white rounded-full p-1.5">
                <GraduationCap className="h-7 w-7 text-blue-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LearnHub
              </span>
              <span className="text-[12px] text-gray-500 -mt-1">
                Courses Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.requiresAuth && role !== "admin") return null;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Section - Auth Buttons / Avatar */}
          <div className="hidden md:flex items-center space-x-3">
            {name ? (
              <AvatarMenu name={name} role={role} handleLogout={handleLogout} />
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="lg" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu
          name={name}
          handleLogout={handleLogout}
          navLinks={navLinks}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          pathname={pathname}
          role={role}
        />
      )}
    </nav>
  );
}
