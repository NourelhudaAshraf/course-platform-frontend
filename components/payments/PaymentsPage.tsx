"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SharedTable } from "@/components/shared/SharedTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { getEnrollments } from "@/actions/payments/getEnrollments";
import { Column, PaymentProps } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PaginationC } from "@/components/Pagination/page";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await getEnrollments(page);
        setPayments(data.data ?? []);
        setTotalPages(data.totalPages ?? 1);
      } catch {
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [page]);

  const columns: Column<PaymentProps>[] = [
    {
      key: "user",
      title: "User",
      minWidth: 150,
      render: (payment) => (
        <span className="font-medium">{payment.user.name}</span>
      ),
    },
    {
      key: "course",
      title: "Course",
      render: (payment) => (
        <span className="font-medium truncate">{payment.course.title}</span>
      ),
    },
    {
      key: "price",
      title: "Price",
      render: (payment) => formatCurrency(payment.price),
    },
    {
      key: "createdAt",
      title: "Payment Date",
      minWidth: 150,
      render: (payment) => formatDate(payment.createdAt),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 mt-5 md:mt-0">
      <PageHeader
        title="Manage Payments"
        description="View all course enrollments and payments"
      />
      <SharedTable
        title="Enrollment Payments"
        description="Recent payment transactions"
        columns={columns}
        data={payments}
        keyExtractor={(payment) => payment._id}
        loading={loading}
        emptyMessage="No payments found yet"
        skeletonRows={5}
        skeletonColumns={4}
      />
      {totalPages > 1 && (
        <PaginationC
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
