import { DashboardCharts } from '@/components/overview/dashboard-charts'
import { Counts } from '@/components/overview/dashboard-counts'
import { PendingGatepass } from '@/components/overview/pending-gatepass'
import { RecentLogs } from '@/components/overview/recent-logs'

export default function Overview() {
  return (
    <div>
      <h1 className="font-semibold text-2xl">Overview</h1>
      <DashboardCharts />
      <Counts />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentLogs />
        <PendingGatepass />
      </div>
    </div>
  )
}