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
import { Trash, IdCard, Ellipsis } from 'lucide-react';
import { deleteVisitor } from '@/api/helpers/visitors'
import { toast } from "sonner"
import { useQueryClient } from '@tanstack/react-query';
import { ViewVisitorDialog } from '@/components/ViewVisitorDialog';

export function VisitorTableActions({ id }: { id: string; }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [viewModal, showViewModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const deleted = await deleteVisitor(id);
    if (!deleted.success) {
      toast.error(deleted.message);
      setLoading(false);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['get-all-visitors'] });
    setLoading(false);
    toast.success(deleted.message);
    showDeleteModal(false);
  }

  return (
    <>
      <ViewVisitorDialog id={id} open={viewModal} onOpenChange={showViewModal} />
      <AlertDialog open={deleteModal} onOpenChange={showDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete visitor data.
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
          <DropdownMenuItem variant="destructive" onSelect={() => showDeleteModal(true)}>
            <Trash />
            Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}