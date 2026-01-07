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

type ViewStudentDialogType = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function ViewStudentDialog({ id, open, onOpenChange }: ViewStudentDialogType) {
  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>View Student</DialogTitle>
            <DialogDescription>
              {id}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </form>
    </Dialog>
  )
}
