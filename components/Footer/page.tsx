import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { FooterLinks } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur opacity-70 group-hover:opacity-100 transition"></div>
                <div className="relative bg-white rounded-full p-1.5">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LearnHub
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering learners worldwide with quality education.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/courses">All Courses</FooterLink>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>

          {/* Column 4 - Contact & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-gray-300 text-sm">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>123 Education St, Digital City</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300 text-sm">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <a href="mailto:info@learnhub.com">info@learnhub.com</a>
                </li>
                <li className="flex items-center space-x-3 text-gray-300 text-sm">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <a href="tel:+1234567890">+1 (234) 567-890</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2026 LearnHub. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: FooterLinks) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-300 hover:text-white text-sm transition hover:translate-x-1 inline-block"
      >
        {children}
      </Link>
    </li>
  );
}
