import {
  Card,
  CardContent,
  CardTitle,
  CardHeader
} from '@/components/ui/card'
import { Link } from 'react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  useQuery,
} from '@tanstack/react-query'
import { getAllGatepass } from '@/api/helpers/gatepass'
import { Skeleton } from '@/components/ui/skeleton'

export function PendingGatepass() {
  const { isPending, data } = useQuery({
    queryKey: ['get-all-gatepass'],
    queryFn: getAllGatepass
  })
  
  if(isPending) return (
    <Skeleton className="h-[260px] md:h-[310px] w-full" />
  );
  
  return (
    <Card>
      <CardHeader className="relative flex items-center">
        <CardTitle>Pending Gatepass</CardTitle>
        <Link to="/dashboard/gatepass" className="absolute right-5 text-sm text-gray-400">
          See All
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead className="w-[10px]">No.</TableHead>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[20px]">Purpose</TableHead>
              <TableHead>Schedule</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isPending && data && data.filter(gpass => gpass.status === 'pending').length !== 0 ? (
              <>
                {(data.filter(gpass => gpass.status === 'pending')).slice(0, 5).map((gatepass, index) => (
                  <TableRow key={gatepass.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{gatepass.visitor_fullname}</TableCell>
                    <TableCell className="text-wrap">{gatepass.purpose}</TableCell>
                    <TableCell>{gatepass.schedule_date && new Date(gatepass.schedule_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No pending gatepass yet.
              </TableCell>
            </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}