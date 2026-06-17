/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { getCurrentUser, updateCurrentUserData } from "@/actions/auth";
import { Spinner } from "../ui/spinner";
import ChangePasswordForm from "./ChangePasswordForm/page";
import ProfileForm from "./ProfileForm/page";
import { ProfileFormData } from "@/lib/schemas/profile";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type ProfileTab = "account" | "security";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState<ProfileTab>("account");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getCurrentUser();
      if (data) {
        setName(data.name || "");
        setEmail(data.email || "");
      } else {
        toast.error("Failed to load profile", {
          description: "Please login to view your profile",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const saveData = async (data: ProfileFormData) => {
    const result = await updateCurrentUserData(data);
    if (result.success) {
      toast.success("Profile updated successfully!");
      setName(data.name);
      setEmail(data.email);
      router.refresh();
      return data;
    }
    toast.error("Failed to update profile", {
      description: result.error,
    });
    router.refresh();
    return data;
  };

  const getInitials = () => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "account", label: "Account" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 min-h-screen">
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                <AvatarImage src="" />
                <AvatarFallback className="bg-linear-to-r from-blue-600 to-purple-600 text-lg text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="truncate text-xl">
                  {name || "My Profile"}
                </CardTitle>
                <CardDescription className="truncate">{email}</CardDescription>
              </div>
            </div>

            <div className="mt-4 flex gap-1 rounded-lg bg-gray-100 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            {activeTab === "account" ? (
              <ProfileForm name={name} email={email} saveData={saveData} />
            ) : (
              <ChangePasswordForm />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
