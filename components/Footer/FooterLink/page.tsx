import Link from "next/link";
import { FooterLinks } from "@/lib/types";

export default function FooterLink({ href, children }: FooterLinks) {
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
