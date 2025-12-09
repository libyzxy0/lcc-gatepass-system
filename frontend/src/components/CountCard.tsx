import { cn } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { type LucideIcon } from "lucide-react"

type CountCardType = {
  name: string;
  icon: LucideIcon;
  count: number;
  className?: string;
}

export function CountCard({ name, icon: Icon, count, className }: CountCardType) {
    return (
      <Card className={cn('bg-gray-100 border-gray-400', className)}>
          <CardContent>
            <CardTitle className="text-3xl font-medium mb-2 flex flex-row gap-2 items-center relative">
              <h1>{count.toLocaleString()}</h1>
              {Icon && <Icon className="size-8 absolute right-0" />}
            </CardTitle>
            <CardDescription>
              <p>{name}</p>
            </CardDescription>
          </CardContent>
        </Card>
    )
}