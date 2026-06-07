import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsPageProps } from "@/lib/types";

export default function StatsGrid({ stats }: StatsPageProps) {
  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount ?? 0);
  };

  const formatNumber = (num?: number) => {
    if (num && num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num?.toString();
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Users */}
      <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Users
          </CardTitle>
          <Users className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(stats?.totalUsers)}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs text-green-600">
              +{stats?.newUsersThisMonth} this month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total Courses */}
      <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Courses
          </CardTitle>
          <BookOpen className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalCourses}</div>
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-700 mt-2"
          >
            Active
          </Badge>
        </CardContent>
      </Card>

      {/* Total Enrollments */}
      <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Enrollments
          </CardTitle>
          <GraduationCap className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(stats?.totalEnrollments)}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs text-green-600">
              +{stats?.newEnrollmentsThisMonth} this month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Revenue
          </CardTitle>
          <DollarSign className="h-5 w-5 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats?.totalRevenue)}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs text-green-600">
              +{stats?.revenueChange}% from last month
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
