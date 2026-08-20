"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserProps } from "@/lib/types";
import { deleteUser, promoteUser } from "@/actions/users";
import { toast } from "sonner";

export default function Dialogs({
  selectedUser,
  deleteDialogOpen,
  setDeleteDialogOpen,
  promoteDialogOpen,
  setPromoteDialogOpen,
  setSelectedUser,
  fetchUsers,
}: {
  readonly selectedUser: UserProps | null;
  readonly deleteDialogOpen: boolean;
  readonly setDeleteDialogOpen: (isDeleteDialogOpen: boolean) => void;
  readonly promoteDialogOpen: boolean;
  readonly setPromoteDialogOpen: (isDeleteDialogOpen: boolean) => void;
  readonly setSelectedUser: (selectedUser: UserProps | null) => void;
  readonly fetchUsers: () => Promise<void>;
}) {
  const handleDelete = async () => {
    if (!selectedUser) return;

    const result = await deleteUser(selectedUser._id);
    if (result.success) {
      toast.success("User deleted successfully");
      setSelectedUser(null);
    } else {
      toast.error(result.error);
    }
    setDeleteDialogOpen(false);
    await fetchUsers();
  };

  const handlePromoteToAdmin = async () => {
    if (!selectedUser) return;

    const result = await promoteUser(selectedUser._id);
    if (result.success) {
      toast.success("User promoted successfully");
      setSelectedUser(null);
    } else {
      toast.error(result.error);
    }
    await fetchUsers();
    setPromoteDialogOpen(false);
  };
  return (
    <>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot; {selectedUser?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote to Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to promote{" "}
              <span className="font-medium">{selectedUser?.name}</span> to
              admin? This will give them full access to the admin panel.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPromoteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePromoteToAdmin}
              className={"bg-purple-600 hover:bg-purple-700"}
            >
              Promote to Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
