import { ArrowUpRightIcon, Hammer } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyDashboard() {
  return (
    <div className="h-[80vh] flex items-center">
    <Empty>
      <EmptyHeader>
        <EmptyMedia className="bg-transparent" variant="icon">
          <Hammer className="size-16 mb-10" />
        </EmptyMedia>
        <EmptyTitle>No Content Yet</EmptyTitle>
        <EmptyDescription>
          This dashboard page dosent have any content yet this is under construction.
        </EmptyDescription>
      </EmptyHeader>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="https://github.com/libyzxy0">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
     </div>
  )
}
