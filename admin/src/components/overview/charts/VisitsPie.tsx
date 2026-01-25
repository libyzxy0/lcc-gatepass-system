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

type MostType = {
  students: number;
  visitors: number;
  staffs: number;
  other: number;
}

type VisitsPieType = {
  data: MostType | null;
}

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

export function VisitsPie({ data }: VisitsPieType) {
  
  const chartData = [
  { type: "students", count: data?.students ?? 0, fill: "#3add79" },
  { type: "visitors", count: data?.visitors ?? 0, fill: "#3a71dd" },
    { type: "staff", count: data?.staffs ?? 0, fill: "#dd3a3a" },
  { type: "other", count: data?.other ?? 0, fill: "#8f8f8f" }
]
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>People Inside the Campus</CardTitle>
        <CardDescription>Shows most people type that are inside the campus today.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {!data ? (
          <div className="h-full grid place-items-center">
          <p className="text-center mx-6 text-muted-foreground leading-none">Failed to show chart, theres no people inside the campus today yet.</p>
          </div>
          ) : (
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
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none text-center">
          Data are calculated based on todays gate logs.
        </div>
      </CardFooter>
    </Card>
  )
}