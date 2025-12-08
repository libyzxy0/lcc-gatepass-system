import {
  Card,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { 
  IdCard,
  DoorOpen,
  UserCheck,
  UserCog,
  ContactRound,
  CheckCheck
} from 'lucide-react';

export function Counts() {
  return (
    <div className="mt-4 md:mt-8">
      <h1 className="font-medium mb-4 text-gray-600">Students & Visitors</h1>
        
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      
     <Card className="bg-yellow-100 border-yellow-400">
          <CardContent>
            <CardTitle className="text-3xl font-medium mb-2 flex flex-row gap-2 items-center">
              <ContactRound />
              <h1>6,640</h1>
            </CardTitle>
            <CardDescription>
              <p>People Today</p>
            </CardDescription>
          </CardContent>
        </Card>
     <Card className="bg-green-100 border-green-400">
          <CardContent>
            <CardTitle className="text-3xl font-medium mb-2 flex flex-row gap-2 items-center">
              <IdCard />
              <h1>4,890</h1>
            </CardTitle>
            <CardDescription>
              <p>Enrolled Students</p>
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-green-100 border-green-400">
          <CardContent>
            <CardTitle className="text-3xl font-medium mb-2 flex flex-row gap-2 items-center">
              <UserCheck />
              <h1>1,757</h1>
            </CardTitle>
            <CardDescription>Approved Visitors</CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-violet-100 border-violet-400">
          <CardContent>
            <CardTitle className="text-3xl font-medium mb-2 flex flex-row gap-2 items-center">
              <DoorOpen />
              <h1>2,345</h1>
            </CardTitle>
            <CardDescription>Students Today</CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-violet-100 border-violet-400">
          <CardContent>
            <CardTitle className="text-3xl font-medium mb-2 flex flex-row gap-2 items-center">
              <UserCog />
              <h1>4,003</h1>
            </CardTitle>
            <CardDescription>Visitors Today</CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 border-orange-400">
          <CardContent>
            <CardTitle className="text-3xl font-medium mb-2 flex flex-row gap-2 items-center">
              <CheckCheck />
              <h1>32,000</h1>
            </CardTitle>
            <CardDescription>Completed Visits</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}