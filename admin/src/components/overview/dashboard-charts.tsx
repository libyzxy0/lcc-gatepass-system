import { TrendWeekVisits } from '@/components/overview/charts/TrendWeekVisits'
import { VisitsPie } from '@/components/overview/charts/VisitsPie'
import { MonthlyVisits } from '@/components/overview/charts/MonthlyVisits'

export function DashboardCharts() {
  return (
    <div className="mt-4 md:mt-8">
      <h1 className="font-medium mb-4 text-gray-600">Statistics</h1>
      <div className="space-y-6">
        <div>
          <MonthlyVisits />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrendWeekVisits />
          <VisitsPie />
        </div>
      </div>
    </div>
  )
}