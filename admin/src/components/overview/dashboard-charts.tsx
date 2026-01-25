import { TrendWeekVisits } from '@/components/overview/charts/TrendWeekVisits'
import { VisitsPie } from '@/components/overview/charts/VisitsPie'
import { MonthlyVisits } from '@/components/overview/charts/MonthlyVisits'
import { getCharts } from '@/api/helpers/overview'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardCharts() {
  const { isPending, data, error } = useQuery({
    queryKey: ['get-charts'],
    queryFn: getCharts,
    refetchInterval: 500,
    refetchOnWindowFocus: true
  })

  if (isPending) {
    return (
      <div className="space-y-6 mt-4">
        <div>
          <Skeleton className="w-full h-[240px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Skeleton className="col-span-3 w-full h-[220px]" />
          <Skeleton className="col-span-2 w-full h-[220px]" />
        </div>
      </div>
    )
  }

  if (error) return 'An error occured ' + error;

  return (
    <div className="mt-4 md:mt-8">
      <div className="space-y-6">
        <div>
          <MonthlyVisits data={data.daily} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="col-span-3">
            <TrendWeekVisits data={data.weekday} />
          </div>
          <div className="col-span-2">
            <VisitsPie data={data.most} />
          </div>
        </div>
      </div>
    </div>
  )
}