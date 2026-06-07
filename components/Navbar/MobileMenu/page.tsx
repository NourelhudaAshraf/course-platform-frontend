import { MobileMenuProps } from "@/lib/types";
import Link from "next/link";

export default function MobileMenu({
  navLinks,
  setIsMobileMenuOpen,
  pathname,
  name,
  handleLogout,
  role,
}: MobileMenuProps) {
  return (
    <div className="md:hidden bg-white border-b border-gray-200 shadow-lg animate-in slide-in-from-top-5 z-50">
      <div className="px-4 py-3 space-y-1">
        {navLinks.map((link) => {
          if (link.requiresAuth && role !== "admin") return null;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
        <div className="pt-4 mt-2 border-t border-gray-200">
          {name ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium bg-linear-to-r from-blue-600 to-purple-600 text-white text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
