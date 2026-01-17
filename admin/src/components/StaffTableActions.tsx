import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Trash, Pencil, IdCard, Ellipsis } from 'lucide-react';
import { deleteStaff } from '@/api/helpers/staff'
import { toast } from "sonner"
import { useQueryClient } from '@tanstack/react-query';
import { ViewStaffDialog } from '@/components/ViewStaffDialog';
import { EditStaffDialog } from '@/components/EditStaffDialog';

export function StaffTableActions({ id }: { id: string; }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [viewModal, showViewModal] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const deleted = await deleteStaff(id);
    if (!deleted.success) {
      toast.error(deleted.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['get-all-gatepass'] });
    setLoading(false);
    toast.success(deleted.message);
    showDeleteModal(false);
  }

  return (
    <>
      <ViewStaffDialog id={id} open={viewModal} onOpenChange={showViewModal} />
      <EditStaffDialog id={id} open={editModal} onOpenChange={showEditModal} />
      <AlertDialog open={deleteModal} onOpenChange={showDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete student data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant={'destructive'} onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => showViewModal(true)}>
            <IdCard />
            View</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => showEditModal(true)}>
            <Pencil />
            Edit</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => showDeleteModal(true)}>
            <Trash />
            Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}