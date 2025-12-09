import { 
  IdCard,
  DoorOpen,
  UserCog,
  ContactRound,
  Users
} from 'lucide-react';

import { CountCard } from '@/components/CountCard'

export function Counts() {
  return (
    <div className="mt-4 md:mt-8">
      <h1 className="font-medium mb-4 text-gray-600">Students & Visitors</h1>
        
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      
     <CountCard name="People Today" count={1473} className="bg-blue-100 border-blue-400" icon={ContactRound} />
     <CountCard name="Enrolled Students" count={4789} className="bg-green-100 border-green-400" icon={IdCard} />
     <CountCard name="Pending Visitors" count={36} className="bg-yellow-100 border-yellow-400" icon={UserCog} />
     <CountCard name="Students Today" count={1402} className="bg-sky-100 border-sky-400" icon={DoorOpen} />
     <CountCard name="Visitors Today" count={21} className="bg-neutral-100 border-neutral-400" icon={Users} />
     <CountCard name="Staffs Today" count={50} className="bg-orange-100 border-orange-400" icon={Users} />
      </div>
    </div>
  )
}