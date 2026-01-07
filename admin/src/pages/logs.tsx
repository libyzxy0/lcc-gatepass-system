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
import { getAllLogs } from '@/api/helpers/logs'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from "@/components/ui/skeleton"

type LogsType = {
  id: string;
  type: 'student' | 'visitor' | 'staff' | 'guardian';
  name: string;
  time_in: string;
  time_out: string;
  entity_id: string;
  device_id: string;
  entry_type: 'qr' | 'rfid';
  created_at: string;
};

export const columns: ColumnDef<LogsType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "entry_type",
    header: "Entry Type",
    cell: (info) => {
       const value = info.getValue<string | null>() ?? null;
       return value?.toLocaleUpperCase();
    }
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
    cell: (info) => {
      const value = info.getValue<string | null>() ?? null;
      return value && new Date(value).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
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
    cell: (info) => {
      const value = info.getValue<string | null>() ?? null;
      return value ? new Date(value).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }): "N/A";
    }
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: (info) => {
       const value = info.getValue<string | null>() ?? null;
       return value?.toLocaleUpperCase();
    }
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

export default function Logs() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-logs'],
    queryFn: getAllLogs
  })
  
  if (isPending) return (
    <div className="grid grid-cols-1 gap-5">
      <Skeleton className="h-8 w-36" />
      <div className="grid grid-cols-6 lg:grid-cols-7 mt-8">
        <Skeleton className="h-12 w-12 md:w-[100px]" />
        <Skeleton className="h-12 w-[220px] md:w-[300px]" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  )

  if (error) return 'An error has occurred: ' + error.message
  
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