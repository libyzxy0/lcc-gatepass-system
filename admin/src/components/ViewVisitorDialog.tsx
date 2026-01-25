import { Button } from "@/components/ui/button"
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
import { getVisitor } from '@/api/helpers/visitors'
import { toast } from "sonner"

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

export function ViewVisitorDialog({ id, open, onOpenChange }: ViewStudentDialogType) {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-visitor', id],
    queryFn: () => getVisitor(id)
  })
  
  if(isPending || !data) return null;
  
  if(error) return toast.error('Failed to get student info!');
  
  return (
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
                  <Button className="bg-green-500">Approve</Button>
                  <Button variant={'destructive'}>Reject ID</Button>
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
  )
}