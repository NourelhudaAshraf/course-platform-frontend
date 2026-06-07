/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Calendar, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StatsGrid from "./StatsGrid/page";
import QuickLinks from "./QuickLinks/page";
import RecentUsers from "./RecentUsers/page";
import { useEffect, useState } from "react";
import { getLatestUsers, getStatistics } from "@/actions/stats";
import { toast } from "sonner";
import { StatsProps, UserProps } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOverview() {
  const [stats, setStats] = useState<StatsProps>();
  const [users, setUsers] = useState<UserProps[]>();
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    async function getStatics() {
      try {
        setLoadingStats(true);
        const statics = await getStatistics();
        setStats(statics);
      } catch (error: any) {
        console.log(error);
        toast.error("Fetching failed", {
          description: error.message as string,
        });
      } finally {
        setLoadingStats(false);
      }
    }
    async function getLatestUsersData() {
      try {
        setLoadingUsers(true);
        const users = await getLatestUsers();
        setUsers(users);
      } catch (error: any) {
        console.log(error);
        toast.error("Fetching failed", {
          description: error.message as string,
        });
      } finally {
        setLoadingUsers(false);
      }
    }
    getStatics();
    getLatestUsersData();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 pt-8 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                <Badge className="bg-linear-to-r from-yellow-500 to-orange-500 text-white">
                  Admin Panel
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, Administrator</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Badge>
            </div>
          </div>
        </div>

        {loadingStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 min-h-50">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex w-fit items-center gap-4">
                <Skeleton className="size-16 shrink-0 rounded-full" />
                <div className="grid gap-2">
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-5 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        )}
        {stats && <StatsGrid stats={stats} />}

        {/* Quick Links */}
        <QuickLinks />

        {/* Recent Users Activity */}
        <RecentUsers users={users} loading={loadingUsers} />
      </div>
    </div>
  );
}
