import { Button } from "@/components/ui/button"
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
import { getGatepass } from '@/api/helpers/gatepass'
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

const statusBadges = {
  rejected: <Badge variant="default" className="bg-orange-400/20 border-orange-400/50 text-orange-400">Rejected</Badge>,
  expired: <Badge variant="default" className="bg-red-400/20 border-red-400/50 text-red-400">Expired</Badge>,
  approved: <Badge variant="default" className="bg-green-400/20 border-green-400/50 text-green-400">Approved</Badge>,
  pending: <Badge variant="default" className="bg-yellow-400/20 border-yellow-400/50 text-yellow-400">Pending</Badge>
}

const accBadges = {
  verified: <Badge variant="default" className="bg-green-400/20 border-green-400/50 text-green-400">Verified</Badge>,
  unverified: <Badge variant="default" className="bg-red-400/20 border-red-400/50 text-red-400">Unverified</Badge>,
  review: <Badge variant="default" className="bg-yellow-400/20 border-yellow-400/50 text-yellow-400">Review</Badge>
}

type ViewQRPassDialogType = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewQRPassDialog({ id, open, onOpenChange }: ViewQRPassDialogType) {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-gatepass', id],
    queryFn: () => getGatepass(id)
  })
  
  if(isPending) return null;
  
  if(error) return toast.error('Failed to get qrpass info!');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>QRPass Details</DialogTitle>
          <DialogDescription>
            Full information about the qrpass and visitor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4 grid md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <img 
              src={data.visitor.photo_url || '/avatar.png'} 
              className="rounded-lg w-44 h-44 object-cover border-2 border-gray-200" 
              alt="Student profile"
            />
            <img 
              src={data.visitor.valid_id_photo_url || '/avatar.png'} 
              className="rounded-lg w-44 h-28 object-cover border-2 border-gray-200" 
              alt="Visitor profile"
            />
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Created at {new Date(data.gatepass.created_at).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm font-medium text-gray-900">Visitor ID: {data.visitor.visitor_id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">General Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</label>
                    <p className="mt-1 text-base text-gray-900">{data.gatepass.purpose}</p>
                  </div>
                </div>
                
                 <div className="grid grid-cols-1">
                 <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
                    <p className="mt-1 text-base text-gray-900">{data.gatepass.description}</p>
                  </div>
                 </div>
                
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</label>
                    <p className="mt-1 text-base text-gray-900">{data.gatepass.schedule_date ? new Date(data.gatepass.schedule_date).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }) : "N/A"}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                    <p className="mt-1 text-base text-gray-900">{statusBadges[data.gatepass.status]}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Visitor Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</label>
                    <p className="mt-1 text-base text-gray-900">{data.visitor.firstname}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</label>
                    <p className="mt-1 text-base text-gray-900">{data.visitor.lastname}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Middle Name</label>
                    <p className="mt-1 text-base text-gray-900">{data.visitor.middle_name || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.visitor.verified ? accBadges['verified'] : data.visitor.valid_id_photo_url ? accBadges['review'] : accBadges['unverified']}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                    <p className={`mt-1 text-base font-mono text-gray-900 ${data.visitor.activated ? 'text-green-400' : 'text-red-400'}`}>{"0" + data.visitor.phone_number}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                    <p className={`mt-1 text-base font-mono text-gray-900`}>{data.visitor.email}</p>
                  </div>
                  
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</label>
                    <p className="mt-1 text-base text-gray-900">{data.visitor.address || 'N/A'}</p>
                  </div>
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
  )
}