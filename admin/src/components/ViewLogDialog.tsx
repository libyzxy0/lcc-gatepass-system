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
import { useQuery } from '@tanstack/react-query'
import { getLog } from '@/api/helpers/logs'
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { toPHTime } from '@/utils/convert-time'
import { ViewStudentDialog } from '@/components/ViewStudentDialog';
import { useState } from 'react'

type ViewStudentDialogType = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeBadges = {
  student: <Badge variant="default" className="bg-blue-400/20 border-blue-400/50 text-blue-400">Student</Badge>,
  visitor: <Badge variant="default" className="bg-orange-400/20 border-orange-400/50 text-orange-400">Visitor</Badge>,
  staff: <Badge variant="default" className="bg-green-400/20 border-green-400/50 text-green-400">Staff</Badge>,
  guardian: <Badge variant="default" className="bg-yellow-400/20 border-yellow-400/50 text-yellow-400">Guardian</Badge>,
}
const entryTypeBadges = {
  rfid: <Badge variant="default" className="bg-sky-400/20 border-sky-400/50 text-sky-400">RFID</Badge>,
  qr: <Badge variant="default" className="bg-pink-400/20 border-pink-400/50 text-pink-400">QRC</Badge>,
}

export function ViewLogDialog({ id, open, onOpenChange }: ViewStudentDialogType) {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-log', id],
    queryFn: () => getLog(id)
  })
  const [studentModal, showStudentModal] = useState(false);

  if (isPending || !data) return null;

  if (error) return toast.error('Failed to get student info!');

  return (
    <>
      <ViewStudentDialog id={data.entity_id} open={studentModal} onOpenChange={showStudentModal} />
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
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</label>
                      <p className="mt-1 text-base text-gray-900">{data.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</label>
                      <p className="mt-1 text-base text-gray-900">{typeBadges[data.type]}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</label>
                      <p className="mt-1 text-base text-gray-900">{toPHTime(data.time_in)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</label>
                      <p className="mt-1 text-base text-gray-900">{toPHTime(data.time_out)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Used</label>
                      <p className="mt-1 text-base font-mono text-gray-900">{entryTypeBadges[data.entry_type]}</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    {data.type === 'student' && (
                      <p className="text-xs">See more detailed information about {data.type} <b className="text-green-400 underline" onClick={() => showStudentModal(true)}>{data.name}</b>.</p>
                    )}

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
    </>
  )
}