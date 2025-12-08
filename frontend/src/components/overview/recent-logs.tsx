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
    direction: "IN",
    time: "8:24 AM"
  },
  {
    id: "2",
    name: "Krisha Sophia De Peralta",
    direction: "IN",
    time: "9:21 AM",
  },
  {
    id: "3",
    name: "Aiesha Jaden Dacallos",
    direction: "IN",
    time: "11:17 AM",
  },
  {
    id: "4",
    name: "Rose Marie Indic",
    direction: "OUT",
    time: "4:33 PM",
  },
  {
    id: "5",
    name: "Rhonyl Caballes",
    direction: "OUT",
    time: "7:00 PM",
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
              <TableHead>Direction</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.map((visitors) => (
              <TableRow key={visitors.id}>
                <TableCell className="font-medium">{visitors.name}</TableCell>
                <TableCell>{visitors.direction}</TableCell>
                <TableCell className="text-wrap">{visitors.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}