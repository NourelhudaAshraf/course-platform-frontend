/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Shield, ShieldAlert, Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SharedTable } from "../SharedTable/page";
import { Column, UserProps } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { PaginationC } from "../Pagination/page";
import { getAllUsers } from "@/actions/users";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { PageHeader } from "../PageHeader/page";
import Dialogs from "./Dialogs/page";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getAllUsers(page);
    if (result.success) {
      setTotalPages(result.data.totalPages);
      setUsers(result.data.data);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const columns: Column<UserProps>[] = [
    {
      key: "name",
      title: "Username",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            <Avatar className="w-10 h-10 rounded-lg">
              <AvatarFallback className="bg-linear-to-r from-blue-500 to-purple-500 text-white text-xs">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="font-medium text-gray-900 line-clamp-1">
              {user.name}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      render: (user) => (
        <span className="font-semibold text-gray-900">{user.email}</span>
      ),
    },
    {
      key: "role",
      title: "Role",
      render: (user) => (
        <Badge
          variant="outline"
          className={
            user.role === "admin"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
          }
        >
          {user.role === "admin" ? (
            <>
              <ShieldAlert className="h-3 w-3 mr-1" />
              Admin
            </>
          ) : (
            <>
              <Shield className="h-3 w-3 mr-1" />
              User
            </>
          )}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: () => (
        <Badge
          variant="outline"
          className={"bg-green-50 text-green-700 border-green-200"}
        >
          Active
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Created",
      minWidth: 150,
      render: (user) => (
        <span className="text-gray-500">{formatDate(user.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      className: "text-right",
      render: (user) => (
        <div className="flex items-center justify-end gap-2">
          {user.role === "user" && (
            <Button
              variant="ghost"
              size="sm"
              title="Promote to Admin"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(user);
                setPromoteDialogOpen(true);
              }}
            >
              <UserCog className="h-4 w-4 text-purple-600" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            title="Delete User"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(user);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 pt-8 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <PageHeader
            title="Manage Users"
            description={`You can manage all users in the platform`}
          />
        </div>
        <SharedTable
          title="All users"
          description="Manage users"
          columns={columns}
          data={users}
          keyExtractor={(user) => user._id}
          loading={loading}
          emptyMessage="No users found."
          skeletonRows={5}
          skeletonColumns={6}
        />
        {totalPages > 1 && (
          <PaginationC
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <Dialogs
          selectedUser={selectedUser}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          promoteDialogOpen={promoteDialogOpen}
          setPromoteDialogOpen={setPromoteDialogOpen}
          fetchUsers={fetchUsers}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
}
