import {
  Card,
  CardContent,
  CardTitle,
  CardHeader
} from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const visitors = [
  {
    id: "1",
    name: "Jan Liby Dela Costa",
    time_out: null,
    time_in: "8:24 AM"
  },
  {
    id: "2",
    name: "Krisha Sophia De Peralta",
    time_out: "3:30 PM",
    time_in: "9:21 AM",
  },
  {
    id: "3",
    name: "Aiesha Jaden Dacallos",
    time_out: "N/A",
    time_in: "11:17 AM",
  },
  {
    id: "4",
    name: "Rose Marie Indic",
    time_out: "7:00 PM",
    time_in: "4:33 PM",
  },
  {
    id: "5",
    name: "Rhonyl Caballes",
    time_out: "11:00 AM",
    time_in: "N/A",
  },
]


export function RecentLogs() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Recent Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>TIME IN</TableHead>
              <TableHead>TIME OUT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.map((visitors) => (
              <TableRow key={visitors.id}>
                <TableCell className="font-medium">{visitors.name}</TableCell>
                <TableCell>{visitors.time_in}</TableCell>
                <TableCell className="text-wrap">{visitors?.time_out ?? "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}