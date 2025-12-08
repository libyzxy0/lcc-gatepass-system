import { ArrowUpRightIcon, FileXCorner } from "lucide-react"
import { Link } from 'react-router'
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="mb-10 bg-transparent">
          <FileXCorner className="size-20" />
        </EmptyMedia>
        <EmptyTitle>404 Page Not Found</EmptyTitle>
        <EmptyDescription>
          The page you want to visit seems that dosent exist in our website, please go home baby.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild className="py-5">
            <Link to="/">Go Home With Me</Link>
          </Button>
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <Link to="https://github.com/libyzxy0">
          Learn More <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
    </div>
  )
}