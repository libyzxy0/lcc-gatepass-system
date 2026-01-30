import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  useQuery,
} from '@tanstack/react-query'
import { getVisitor, approve, reject } from '@/api/helpers/visitors'
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
import { useQueryClient } from '@tanstack/react-query';

type ViewStudentDialogType = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusBadges = {
  verified: <Badge variant="default" className="bg-green-400/20 border-green-400/50 text-green-400">Verified</Badge>,
  unverified: <Badge variant="default" className="bg-red-400/20 border-red-400/50 text-red-400">Unverified</Badge>,
  review: <Badge variant="default" className="bg-yellow-400/20 border-yellow-400/50 text-yellow-400">Review</Badge>
}

type ActionType = 'approve' | 'reject';

export function ViewVisitorDialog({ id, open, onOpenChange }: ViewStudentDialogType) {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-visitor', id],
    queryFn: () => getVisitor(id)
  })
  const queryClient = useQueryClient();
  const [reason, setReason] = useState<string>("");
  const [approveModal, showApproveModal] = useState(false);
  const [rejectModal, showRejectModal] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const handleApproveReject = async (action: ActionType, reason?: string | null) => {

    if (action === 'approve') {
      const result = await approve(id);
      if (!result.success) return toast.error(result.message);
      await queryClient.invalidateQueries({ queryKey: ['get-all-visitors'] });
      toast.success(result.message);
    } else if (action === 'reject') {
      const result = await reject(id, reason ? reason : null);
      if (!result.success) return toast.error(result.message);
      await queryClient.invalidateQueries({ queryKey: ['get-all-visitors'] });
      setReason("");
      toast.success(result.message);
    }
  }
  
  const handleApprove = async () => {
    setApproving(true);
    await handleApproveReject('approve');
    setApproving(false);
    showApproveModal(false);
  }

  const handleReject = async () => {
    setRejecting(true);
    await handleApproveReject('reject', reason);
    setRejecting(false);
    showRejectModal(false);
  }
  
  if(isPending || !data) return null;
  
  if(error) return toast.error('Failed to get student info!');
  
  return (
    <>
    <AlertDialog open={approveModal} onOpenChange={showApproveModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will set the visitor's account status to verified and automatically approve gatepass requests without waiting for admin approvals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button className="bg-green-400" onClick={handleApprove} disabled={approving}>{approving ? 'Verifying...' : 'Verify'}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={rejectModal} onOpenChange={showRejectModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject ID?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reject the visitor's valid id and not automatically approve their gatepass requests.
            </AlertDialogDescription>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rejection Reason</label>
            <Input onChange={(e) => setReason(e.target.value)} value={reason} aria-invalid={!reason} placeholder={'Lack of necessary details.'}/>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button className="bg-orange-400" onClick={handleReject} disabled={rejecting || !reason}>{rejecting ? 'Rejecting...' : 'Reject'}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visitor Details</DialogTitle>
          <DialogDescription>
            Full information about the visitor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4 grid md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <img 
              src={data.photo_url || '/avatar.png'} 
              className="rounded-lg w-44 h-44 object-cover border-2 border-gray-200" 
              alt="Visitor profile"
            />
            <img 
              src={data.valid_id_photo_url || '/banner.png'} 
              className="rounded-lg w-44 h-28 object-cover border-2 border-gray-200" 
              alt="Visitor ID"
            />
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Registered at {new Date(data.created_at).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm font-medium text-gray-900">Visitor ID: {data.visitor_id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">General Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</label>
                    <p className="mt-1 text-base text-gray-900">{data.firstname}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</label>
                    <p className="mt-1 text-base text-gray-900">{data.lastname}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Middle Name</label>
                    <p className="mt-1 text-base text-gray-900">{data.middle_name || "N/A"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor ID</label>
                    <p className="mt-1 text-base text-gray-900">{data.visitor_id}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                    <p className={`mt-1 text-base ${data.activated ? 'text-green-400' : 'text-red-500'}`}>{data.phone_number}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.verified ? statusBadges['verified'] : data
                    .valid_id_photo_url ? statusBadges['review'] : statusBadges['unverified']}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.address || 'No address provided'}</p>
                  </div>
                </div>
                {data.verified === false && data.valid_id_photo_url && (
                  <>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Account Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant={'outline'} className="bg-green-500/20 border-green-300 text-green-400" onClick={() => showApproveModal(true)}>Verify</Button>
                  <Button className="bg-red-500/20 border-red-300 text-red-400" variant={'outline'} onClick={() => showRejectModal(true)}>Reject ID</Button>
                </div>
                </>
                )}
                
              </div>
            </div>

            
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}