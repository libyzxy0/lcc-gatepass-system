import {
  IdCard,
  DoorOpen,
  UserCog,
  ContactRound,
  Users
} from 'lucide-react';
import {
  useQuery,
} from '@tanstack/react-query'
import { getOverviewCounts } from '@/api/helpers/overview'
import { Skeleton } from '@/components/ui/skeleton'
import { CountCard } from '@/components/CountCard'

export function Counts() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-counts'],
    queryFn: getOverviewCounts,
    refetchInterval: 500,
    refetchOnWindowFocus: true
  })

  if (isPending) return (
    <div className="mt-4 md:mt-8">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <Skeleton className="w-[180px] md:w-[200px] lg:w-[240px] h-[105px]" />
        <Skeleton className="w-[180px] md:w-[200px] lg:w-[240px] h-[105px]" />
        <Skeleton className="w-[180px] md:w-[200px] lg:w-[240px] h-[105px]" />
        <Skeleton className="w-[180px] md:w-[200px] lg:w-[240px] h-[105px]" />
        <Skeleton className="w-[180px] md:w-[200px] lg:w-[240px] h-[105px]" />
        <Skeleton className="w-[180px] md:w-[200px] lg:w-[240px] h-[105px]" />
      </div>
    </div>
  );

  if (error) return 'An error occurred ' + error;

  return (
    <div className="mt-4 md:mt-8">
       <h1 className="font-medium mb-4 text-gray-600">Statistics</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <CountCard
          name="People Today"
          count={data.people_today}
          className="bg-gradient-to-r from-sky-100/50 to-sky-200/50 border-sky-300/30"
          icon={ContactRound}
        />
        <CountCard
          name="Students Today"
          count={data.students_today}
          className="bg-gradient-to-r from-indigo-100/50 to-indigo-200/50 border-indigo-300/30"
          icon={DoorOpen}
        />
        <CountCard
          name="Visitors Today"
          count={data.visitors_today}
          className="bg-gradient-to-r from-teal-100/50 to-teal-200/50 border-teal-300/30"
          icon={DoorOpen}
        />
        <CountCard
          name="Other People"
          count={data.other_people}
          className="bg-gradient-to-r from-purple-100/50 to-purple-200/50 border-purple-300/30"
          icon={Users}
        />
        <CountCard
          name="Enrolled Students"
          count={data.students}
          className="bg-gradient-to-r from-green-100/50 to-green-200/50 border-green-300/30"
          icon={IdCard}
        />
        <CountCard
          name="Pending QRPass"
          count={data.pending_gatepass}
          className="bg-gradient-to-r from-yellow-100/50 to-yellow-200/50 border-yellow-300/30"
          icon={UserCog}
        />
      </div>
    </div>
  )
}