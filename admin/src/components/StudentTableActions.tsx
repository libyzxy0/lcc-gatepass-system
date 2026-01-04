import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash, Pencil, IdCard, Ellipsis } from 'lucide-react';
import { deleteStudent } from '@/api/helpers/student'
import { toast } from "sonner"
import { useQueryClient } from '@tanstack/react-query';

export function StudentTableActions({ id }: { id: string; }) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const deleted = await deleteStudent(id);
    if (!deleted.success) {
      toast.error(deleted.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['get-students'] });
    toast.success(deleted.message);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <IdCard />
          View</DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil />
          Edit</DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger>
            <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
              <Trash />
              Delete</DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete student data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}