import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash, IdCard, Ellipsis, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button'

export type LogsType = {
  id: string;
  name: string;
  type: string;
  time_in: string;
  time_out: string;
}

export const columns: ColumnDef<LogsType>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
    accessorKey: "type",
    header: "Type",
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
              View</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash />
              Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

const data: LogsType[] = [
  {
    id: "STU20250327",
    name: "Jan Liby Dela Costa",
    type: "Staff",
    time_in: "7:46 AM",
    time_out: "4:12 PM",
  },
];

export default function Logs() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-semibold text-2xl">Logs</h1>
      </header>
      <MyTable
      emptyMessage={"No visitor logs yet."}
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