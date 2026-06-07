import Link from "next/link";
import { ArrowRight, UserPlus, BookPlus, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your platform content</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/courses" className="block">
            <Button
              variant="outline"
              className="w-full justify-between hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <span className="flex items-center gap-2">
                <BookPlus className="h-4 w-4 text-blue-600" />
                Manage Courses
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Button>
          </Link>

          <Link href="/admin/users" className="block">
            <Button
              variant="outline"
              className="w-full justify-between hover:bg-purple-50 hover:border-purple-300 transition-all"
            >
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-purple-600" />
                Manage Users
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Button>
          </Link>

          <Link href="/admin/payments" className="block">
            <Button
              variant="outline"
              className="w-full justify-between hover:bg-green-50 hover:border-green-300 transition-all"
            >
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                View Payments
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
