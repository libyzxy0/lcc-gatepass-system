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
import { deleteGate } from '@/api/helpers/gate'

export function GateCard({ id, gate_id, status, name, type }) {
  const [deleteModal, showDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleDelete = async () => {
    setLoading(true);
    const deleted = await deleteGate(id);
    if (!deleted.success) {
      toast.error(deleted.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['get-all-gates'] });
    setLoading(false);
    toast.success(deleted.message);
    showDeleteModal(false);
  }
  return (
    <>
    <AlertDialog open={deleteModal} onOpenChange={showDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the gate '{name}'.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant={'destructive'} onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    <div className={`flex items-center justify-between p-4 border rounded-lg ${status === 'online' ? 'bg-green-400/10 border-green-200' : ''}`}>
      <div>
        <p className={`font-medium ${status === 'online' ? 'text-green-400' : ''}`}>{name}</p>
        <p className="text-sm text-muted-foreground">{gate_id}</p>
        <div className="flex gap-3 mt-1">
          <p className="text-xs text-muted-foreground capitalize">Type: {type}</p>
          <p className={`text-xs font-medium capitalize ${status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
            {status}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => showDeleteModal(true)} variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
    </>
  )
}