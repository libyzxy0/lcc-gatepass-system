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
import { getLog } from '@/api/helpers/logs'
import { toast } from "sonner"


type ViewStudentDialogType = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewLogDialog({ id, open, onOpenChange }: ViewStudentDialogType) {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-log', id],
    queryFn: () => getLog(id)
  })
  
  if(isPending || !data) return null;
  
  if(error) return toast.error('Failed to get student info!');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
          <DialogDescription>
            Full information about the log.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4 grid md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <img 
              src={data.photo_url || '/avatar.png'} 
              className="rounded-lg w-44 h-44 object-cover border-2 border-gray-200" 
              alt="Student profile"
            />
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Logged at {new Date(data.created_at).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm font-medium text-gray-900">Log ID: {data.log_id}</p>
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
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</label>
                    <p className="mt-1 text-base text-gray-900">{data.log_type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                    <p className="mt-1 text-base text-gray-900">{data.phone_number}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">RFID Code</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.rfid_code}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Log ID</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.log_id}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.email}</p>
                  </div>
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