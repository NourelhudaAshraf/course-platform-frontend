import dynamic from "next/dynamic";

const PaymentsPage = dynamic(
  () => import("@/components/payments/PaymentsPage"),
  { loading: () => <div className="py-12 text-center text-gray-500">Loading payments...</div> },
);

export default function AdminPaymentsPage() {
  return <PaymentsPage />;
}
