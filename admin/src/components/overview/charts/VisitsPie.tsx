import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  useQuery,
} from '@tanstack/react-query'
import { getOverviewCounts } from '@/api/helpers/overview'
import { getPeopleTypeWithHighestValue } from '@/utils/get-highest'
import { Skeleton } from '@/components/ui/skeleton'

export const description = "A pie chart with a label list"

const chartConfig = {
  count: {
    label: "Visitors",
  },
  students: {
    label: "Students",
    color: "#74eb72",
  },
  visitors: {
    label: "Visitors",
    color: "#72a2eb",
  },
  staff: {
    label: "Staff",
    color: "#d85050",
  },
  other: {
    label: "Other",
    color: "#8f8f8f",
  },
} satisfies ChartConfig

export function VisitsPie() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-counts'],
    queryFn: getOverviewCounts,
    refetchInterval: 500,
    refetchOnWindowFocus: true
  })
  
  if(isPending) return <Skeleton className="w-full h-[280px]" />
  
  if(error) return 'An error occurred ' + error
  
  const chartData = [
  { type: "students", count: data.students_today, fill: "#3add79" },
  { type: "visitors", count: data.visitors_today, fill: "#3a71dd" },
    { type: "staff", count: data.staffs_today, fill: "#dd3a3a" },
  { type: "other", count: data.other_people, fill: "#8f8f8f" }
]
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>People Inside the Campus</CardTitle>
        <CardDescription>Shows most people type that are inside the campus today.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="count" />
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2">
        <p className="leading-none font-medium">
          <span className="capitalize font-medium">{getPeopleTypeWithHighestValue(data).join(", ")}</span> are the Most
          </p>
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none text-center">
          Data are calculated based on today's gate logs.
        </div>
      </CardFooter>
    </Card>
  )
}