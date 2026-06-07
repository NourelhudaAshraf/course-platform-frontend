import { redirect } from "next/navigation";

export default function PaymentRedirectPage() {
  redirect("/admin/payments");
}
