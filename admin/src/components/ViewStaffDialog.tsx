import React from 'react'
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
import { getStaff } from '@/api/helpers/staff'
import { toast } from "sonner"
import { Badge } from '@/components/ui/badge'
import { RFIDCode } from '@/components/RFIDCode'

type ViewStudentDialogType = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeBadges: Record<string,
  React.ReactNode> = {
  faculty: <Badge variant="default" className="bg-blue-400/20 border-blue-400/50 text-blue-400">Faculty</Badge>,
  guard: <Badge variant="default" className="bg-red-400/20 border-red-400/50 text-red-400">Security</Badge>,
  administrator: <Badge variant="default" className="bg-green-400/20 border-green-400/50 text-green-400">Admin</Badge>,
  canteen_vendors: <Badge variant="default" className="bg-yellow-400/20 border-yellow-400/50 text-yellow-400">Vendors</Badge>,
  other: <Badge variant="default" className="bg-gray-400/20 border-gray-400/50 text-gray-400">Other</Badge>
}

export function ViewStaffDialog({ id, open, onOpenChange }: ViewStudentDialogType) {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-staff', id],
    queryFn: () => getStaff(id)
  })
  
  if(isPending || !data) return null;
  
  if(error) return toast.error('Failed to get student info!');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Details</DialogTitle>
          <DialogDescription>
            Full information about the staff.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4 grid md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <img 
              src={data.photo_url || '/avatar.png'} 
              className="rounded-lg w-44 h-44 object-cover border-2 border-gray-200" 
              alt="Staff profile"
            />
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Added at {new Date(data.created_at).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm font-medium text-gray-900">Staff ID: {data.staff_id}</p>
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
                    <div>
                    {typeBadges[data.staff_type]}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                    <p className="mt-1 text-base text-gray-900">{data.phone_number}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">RFID Code</label>
                    <div>
                    <RFIDCode value={data.rfid_code} />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Staff ID</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.staff_id}</p>
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