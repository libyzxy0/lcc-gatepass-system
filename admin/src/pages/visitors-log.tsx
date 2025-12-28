import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash, Pencil, IdCard, Ellipsis, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button'

export type VisitorLogType = {
  id: string;
  visitor_id: string;
  name: string;
  section: string;
  grade_level: string;
  time_in: string;
  time_out: string;
}

export const columns: ColumnDef<VisitorLogType>[] = [
  {
    accessorKey: "student_id",
    header: "Visitor ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "time_in",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time In
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "time_out",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time Out
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "grade_level",
    header: "Level",
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <IdCard />
              View Visitor</DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil />
              Edit Log</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash />
              Delete Log</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

const data: VisitorLogType[] = [
  {
    id: "STU20250327",
    visitor_id: "STU20250327",
    name: "Jan Liby Dela Costa",
    section: "ICT-12A",
    grade_level: "SHS-G12",
    time_in: "7:46 AM",
    time_out: "4:12 PM",
  },
];

export default function StudentsLog() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-semibold text-2xl">Visits Log</h1>
      </header>
      <MyTable
      columns={columns} 
      data={data} 
      filterSelect={[
        {
          id: 'name',
          label: "Name"
        },
        {
          id: 'visitor_id',
          label: "Visitor ID"
        },
        {
          id: 'visiting',
          label: "Visiting"
        },
        {
          id: 'grade_level',
          label: "Grade Level"
        },
      ]}
      />
    </div>
  )
}