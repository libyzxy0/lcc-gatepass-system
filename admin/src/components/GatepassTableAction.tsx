import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Trash, IdCard, Ellipsis, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { approve, reject, deletePass } from '@/api/helpers/gatepass'
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { ViewQRPassDialog } from '@/components/ViewQRPassDialog'

type ActionType = 'approve' | 'reject';

export function GatepassTableAction({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [approveModal, showApproveModal] = useState(false);
  const [rejectModal, showRejectModal] = useState(false);
  const [viewModal, showViewModal] = useState(false);
  
  const handleApproveReject = async (action: ActionType) => {

    if (action === 'approve') {
      const result = await approve(id);
      if (!result.success) return toast.error(result.message);
      await queryClient.invalidateQueries({ queryKey: ['get-all-gatepass'] });
      toast.success(result.message);
    } else if (action === 'reject') {
      const result = await reject(id);
      if (!result.success) return toast.error(result.message);
      await queryClient.invalidateQueries({ queryKey: ['get-all-gatepass'] });
      toast.success(result.message);
    }
  }
  
  const handleDelete = async () => {
    setDeleting(true);
    const deleted = await deletePass(id);
    if (!deleted.success) {
      toast.error(deleted.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['get-all-gatepass'] });
    setDeleting(false);
    toast.success(deleted.message);
    showDeleteModal(false);
  }
  
  const handleApprove = async () => {
    setApproving(true);
    await handleApproveReject('approve');
    setApproving(false);
    showApproveModal(false);
  }
  
  const handleReject = async () => {
    setRejecting(true);
    await handleApproveReject('reject');
    setRejecting(false);
    showRejectModal(false);
  }
  
  return (
    <>
    <ViewQRPassDialog id={id} open={viewModal} onOpenChange={showViewModal} />
    
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
            <Button variant={'destructive'} onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={approveModal} onOpenChange={showApproveModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve gatepass?</AlertDialogTitle>
            <AlertDialogDescription>
              This will approve the visitor's qrpass and allow them to enter the school.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button className="bg-green-400" onClick={handleApprove} disabled={approving}>{approving ? 'Approving...' : 'Approve'}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={rejectModal} onOpenChange={showRejectModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject gatepass?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reject the visitor's qrpass and not allow them to enter the school.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button className="bg-orange-400" onClick={handleReject} disabled={rejecting}>{rejecting ? 'Rejecting...' : 'Reject'}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => showApproveModal(true)} className="text-green-400 focus:text-green-400 hover:text-green-400 focus:bg-green-400/20 hover:focus:bg-green-400/20">
          <ThumbsUp className="text-green-400" />
          Approve
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => showRejectModal(true)} className="text-orange-400 focus:text-orange-400 hover:text-orange-400 focus:bg-orange-400/20 hover:focus:bg-orange-400/20">
          <ThumbsDown className="text-orange-400" />
          Reject
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => showViewModal(true)}>
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
  )
}