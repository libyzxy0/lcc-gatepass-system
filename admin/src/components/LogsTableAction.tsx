import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Trash, IdCard, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteLog } from "@/api/helpers/logs";
import { toast } from "sonner"
import { useQueryClient } from '@tanstack/react-query'

type LogsTableActionType = {
    id: string;
}

export function LogsTableActions({ id }: LogsTableActionType) {
  const [loading, setLoading] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setLoading(true);
    const data = await deleteLog(id);
    if(!data.success) {
      toast.error(data.message);
      setLoading(false);
      return;
    }
    toast.success(data.message);
    setLoading(false);
    showDeleteModal(false);
     await queryClient.invalidateQueries({ queryKey: ['get-all-logs'] });
  }

  return (
    <>
    <AlertDialog open={deleteModal} onOpenChange={showDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete log data.
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
        <DropdownMenuItem>
          <IdCard />
          View
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => showDeleteModal(true)}>
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
}
