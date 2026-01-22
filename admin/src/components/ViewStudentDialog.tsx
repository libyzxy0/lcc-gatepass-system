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
import { getStudent } from '@/api/helpers/student'
import { toast } from "sonner"


type ViewStudentDialogType = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewStudentDialog({ id, open, onOpenChange }: ViewStudentDialogType) {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-student', id],
    queryFn: () => getStudent(id)
  })
  
  if(isPending) return null;
  
  if(error) return toast.error('Failed to get student info!');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>
            Full information about the student and their guardian.
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
                Enrolled at {new Date(data.created_at).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm font-medium text-gray-900">Student ID: {data.student_id}</p>
              <p className="text-sm font-medium text-gray-900">Student QRKey: {data.enrollment_secret}</p>
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
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Section</label>
                    <p className="mt-1 text-base text-gray-900">{data.section}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Level</label>
                    <p className="mt-1 text-base text-gray-900">{data.grade_level}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">RFID Code</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.rfid_code}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Guardian Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</label>
                    <p className="mt-1 text-base text-gray-900">{data.guardian.firstname}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</label>
                    <p className="mt-1 text-base text-gray-900">{data.guardian.lastname}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Middle Name</label>
                    <p className="mt-1 text-base text-gray-900">{data.guardian.middle_name || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.guardian.relationship}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.guardian.phone_number}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">RFID Code</label>
                    <p className="mt-1 text-base font-mono text-gray-900">{data.guardian.rfid_code}</p>
                  </div>
                  
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</label>
                    <p className="mt-1 text-base text-gray-900">{data.address}</p>
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