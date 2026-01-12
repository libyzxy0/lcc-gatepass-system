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
      <h1 className="font-medium mb-4 text-gray-600">Students & Visitors</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <Skeleton className="w-[180px] md:w-[200px] h-[105px]" />
        <Skeleton className="w-[180px] md:w-[200px] h-[105px]" />
        <Skeleton className="w-[180px] md:w-[200px] h-[105px]" />
        <Skeleton className="w-[180px] md:w-[200px] h-[105px]" />
        <Skeleton className="w-[180px] md:w-[200px] h-[105px]" />
        <Skeleton className="w-[180px] md:w-[200px] h-[105px]" />
      </div>
    </div>
  );
  
  if (error) return 'An error occurred ' + error;

  return (
    <div className="mt-4 md:mt-8">
      <h1 className="font-medium mb-4 text-gray-600">Students & Visitors</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

        <CountCard name="People Today" count={data.people_today} className="bg-blue-100 border-blue-400" icon={ContactRound} />
        <CountCard name="Enrolled Students" count={data.students} className="bg-green-100 border-green-400" icon={IdCard} />
        <CountCard name="Pending Gatepass" count={data.pending_gatepass} className="bg-yellow-100 border-yellow-400" icon={UserCog} />
        <CountCard name="Students Today" count={data.students_today} className="bg-sky-100 border-sky-400" icon={DoorOpen} />
        <CountCard name="Visitors Today" count={data.visitors_today} className="bg-neutral-100 border-neutral-400" icon={DoorOpen} />
        <CountCard name="Other People" count={data.other_people} className="bg-orange-100 border-orange-400" icon={Users} />
      </div>
    </div>
  )
}