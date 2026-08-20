import Link from "next/link";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NavFooter({
  userName,
  handleLogout,
}: {
  readonly userName: string;
  readonly handleLogout: () => void;
}) {
  return (
    <div className="border-t border-gray-200 p-4">
      <Link href={"/admin/profile"}>
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-linear-to-r from-blue-500 to-purple-500 text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </Link>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-red-600 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
