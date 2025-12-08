import {
  Counts
} from '@/components/overview/dashboard-counts'

import {
  PendingVisitors
} from '@/components/overview/pending-visitors'
import {
  RecentLogs
} from '@/components/overview/recent-logs'

export default function Overview() {
  return (
    <div>
      <h1 className="font-semibold text-2xl">Overview</h1>
      <Counts />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecentLogs />
        <PendingVisitors />
      </div>
    </div>
  )
}