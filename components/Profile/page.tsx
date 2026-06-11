/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { getCurrentUser, updateCurrentUserData } from "@/actions/auth";
import { Spinner } from "../ui/spinner";
import ProfileForm from "./ProfileForm/page";
import { ProfileFormData } from "@/lib/schemas/profile";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
      router.refresh();
      return data;
    }
    toast.error("Failed to update profile", {
      description: result.error,
    });
    router.refresh();
    return data;
  };

  // Get initials for avatar
  const getInitials = () => {
    const nameInit = name || "";
    if (!nameInit) return "U";
    return nameInit
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white shadow-lg">
            <AvatarImage src="" />
            <AvatarFallback className="bg-linear-to-r from-blue-600 to-purple-600 text-white text-2xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">Update your personal information</p>
        </div>

        <ProfileForm name={name} email={email} saveData={saveData} />
      </div>
    </div>
  );
}
