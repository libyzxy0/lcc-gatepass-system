import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash, Pencil, IdCard, Ellipsis, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { approve, reject } from '@/api/helpers/gatepass'
import { toast } from "sonner"

type ActionType = 'approve' | 'reject';

export function GatepassTableAction({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const handleApproveReject = async (action: ActionType) => {
        
        if(action === 'approve') {
          const result = await approve(id);
          if(!result.success) return toast.error(result.message);
          await queryClient.invalidateQueries({ queryKey: ['get-all-gatepass'] });
          toast.success(result.message);
        } else if(action === 'reject') {
          const result = await reject(id);
          if(!result.success) return toast.error(result.message);
          await queryClient.invalidateQueries({ queryKey: ['get-all-gatepass'] });
          toast.success(result.message);
        }
      }
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleApproveReject('approve')} className="text-green-400 focus:text-green-400 hover:text-green-400 focus:bg-green-400/20 hover:focus:bg-green-400/20">
            <ThumbsUp className="text-green-400" />
            Approve
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleApproveReject('reject')} className="text-orange-400 focus:text-orange-400 hover:text-orange-400 focus:bg-orange-400/20 hover:focus:bg-orange-400/20">
            <ThumbsDown className="text-orange-400" />
            Reject
          </DropdownMenuItem>

          <DropdownMenuItem>
            <IdCard />
            View
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Pencil />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem variant="destructive">
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}