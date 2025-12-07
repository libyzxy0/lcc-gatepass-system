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
      <h1 className="font-bold text-3xl">Overview</h1>
      <Counts />
      <div className="mt-8 flex flex-row gap-4">
        <RecentLogs />
        <PendingVisitors />
      </div>
    </div>
  )
}