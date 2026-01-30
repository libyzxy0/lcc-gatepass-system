import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge'
import { Ticket } from 'lucide-react'
import { copyToClipboard } from '@/utils/copy-text'
import { useState } from 'react'

export function RFIDCode({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge onClick={handleCopy} className="cursor-pointer">
          <Ticket className="mr-1 h-4 w-4" />
          <span>{value}</span>
        </Badge>
      </TooltipTrigger>

      <TooltipContent>
        <p>{copied ? "Copied!" : "Click to copy"}</p>
      </TooltipContent>
    </Tooltip>
  )
}
