import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useState } from 'react'
import { toast } from "sonner"
import { useQueryClient } from '@tanstack/react-query';
import { deleteAdmin } from '@/api/helpers/admin'
import { useAuthStore } from "@/stores/useAuthStore";
import { Badge } from '@/components/ui/badge'

type AdminCardType = {
  id: string;
  name: string;
  email: string;
  role: string;
  is_super_admin: boolean;
}

export function AdminCard({ id, name, email, role, is_super_admin }: AdminCardType) {
  const { admin } = useAuthStore();
  const [deleteModal, showDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleDelete = async () => {
    setLoading(true);
    const deleted = await deleteAdmin(id);
    if (!deleted.success) {
      toast.error(deleted.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['get-all-admins'] });
    setLoading(false);
    toast.success(deleted.message);
    showDeleteModal(false);
  }
  
  if(!admin) return null;
  
  return (
    <>
    <AlertDialog open={deleteModal} onOpenChange={showDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete admin account '{email}'.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant={'destructive'} onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="text-xs text-muted-foreground mt-1 capitalize">{role}</p>
      </div>
      {(admin.id !== id && !is_super_admin) ? (
        <Button onClick={() => showDeleteModal(true)} variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      ) : (
        <>
        {admin.id === id && <Badge>You</Badge>}
        </>
      )}
    </div>
    </>
  )
}