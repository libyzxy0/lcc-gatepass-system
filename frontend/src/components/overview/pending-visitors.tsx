import {
  Card,
  CardContent,
  CardTitle,
  CardHeader
} from '@/components/ui/card'
import {Link } from 'react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Table as TableIcon } from 'lucide-react';


const visitors = [
  {
    id: "1",
    name: "Jan Liby Dela Costa",
    office: "Admission Office",
    schedule: "Dec 14",
    purpose: "I want to enroll my son to La Concepcion College.",
  },
  {
    id: "2",
    name: "Krisha Sophia De Peralta",
    office: "Registrar Office",
    schedule: "Dec 8",
    purpose: "I want to get my good moral.",
  },
  {
    id: "3",
    name: "Aiesha Jaden Dacallos",
    office: "Cahier",
    schedule: "Dec 17",
    purpose: "I want to pay my tuition.",
  },
  {
    id: "4",
    name: "Rose Marie Indic",
    office: "Cahier",
    schedule: "Dec 17",
    purpose: "I want to pay my tuition.",
  },
  {
    id: "5",
    name: "Rhonyl Caballes",
    office: "Sir Jeff",
    schedule: "Dec 17",
    purpose: "I want to talk to sir Jeff.",
  },
]

export function PendingVisitors() {
  return (
    <Card>
      <CardHeader className="relative flex items-center">
        <CardTitle>Pending Visitors</CardTitle>
        <Link to="/visitors" className="absolute right-5">
          <TableIcon className="size-5 text-muted-foreground" />
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead className="w-[10px]">No.</TableHead>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Visiting</TableHead>
              <TableHead className="w-[20px]">Purpose</TableHead>
              <TableHead>Schedule</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.map((visitors, index) => (
              <TableRow key={visitors.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{visitors.name}</TableCell>
                <TableCell>{visitors.office}</TableCell>
                <TableCell className="text-wrap">{visitors.purpose}</TableCell>
                <TableCell>{visitors.schedule}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}