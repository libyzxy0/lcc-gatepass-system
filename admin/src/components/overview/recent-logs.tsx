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
  TableRow,
} from "@/components/ui/table"
import { getAllLogs } from '@/api/helpers/logs'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { toPHTime } from '@/utils/convert-time'
export function RecentLogs() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-logs'],
    queryFn: getAllLogs,
    refetchInterval: 1000,
    refetchOnWindowFocus: true
  })

  if (isPending) return (
    <Skeleton className="h-[260px] md:h-[310px] w-full" />
  );

  if (error) return 'An error has occurred: ' + error.message

  return (
    <Card>
    <CardHeader className="relative flex items-center">
        <CardTitle>Recent Logs</CardTitle>
        <Link to="/dashboard/logs" className="absolute right-5 text-sm text-gray-400">
          See all
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>TIME IN</TableHead>
              <TableHead>TIME OUT</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length !== 0 ? (
              <>
                {data?.slice(0, 5).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {toPHTime(item.time_in)}
                    </TableCell>
                    <TableCell>
                      {toPHTime(item.time_out)}
                    </TableCell>
                    <TableCell className="text-wrap capitalize">{item.type?.toUpperCase()}</TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No recent logs for today yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}