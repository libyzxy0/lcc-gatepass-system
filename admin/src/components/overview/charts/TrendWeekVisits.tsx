import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type WeekdayType = {
  day: string;
  visits: number;
}

type TrendWeekVisitsType = {
  data: WeekdayType[];
}

const chartConfig = {
  visits: {
    label: "Visits",
    color: "#548fea",
  },
} satisfies ChartConfig

export function TrendWeekVisits({ data }: TrendWeekVisitsType) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Visits Trend</CardTitle>
        <CardDescription>This chart highlights peak traffic days to help improve gate monitoring.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visits" fill="#72a2eb" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this week<TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none text-center">
          Showing total gate logs for the last 4 weeks
        </div>
      </CardFooter>
    </Card>
  )
}
