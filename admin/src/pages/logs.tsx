import { useState, useMemo } from 'react'
import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash, IdCard, Ellipsis, ArrowUpDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from "@/components/ui/skeleton"
import { getAllLogs } from '@/api/helpers/logs'
import { useQuery } from '@tanstack/react-query'
import { toPHTime } from '@/utils/convert-time'

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

export default function Logs() {
  const [search, setSearch] = useState("")
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-logs'],
    queryFn: getAllLogs,
    refetchInterval: 1000,
    refetchOnWindowFocus: true
  })

  const columns: ColumnDef<LogsType>[] = [
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
        return toPHTime(value);
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
        return toPHTime(value);
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
  ];
  
  if (error) return 'An error has occurred: ' + error.message
  
  const filteredData = useMemo(() => {
    if (!data) return []

    const words = search.toLowerCase().trim().split(/\s+/)

    return data.filter(log => {
      const nameMatch = words.every(word =>
        log.name.toLowerCase().includes(word)
      )

      return nameMatch
    })
  }, [data, search])

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

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-semibold text-2xl">Logs</h1>
      </header>
      <MyTable
        emptyMessage={"No logs yet."}
        columns={columns}
        data={filteredData}
        TableAction={
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              <Select
                value={'today'}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'today'}>Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button variant={'outline'}>
                <Download />
                Download CSV
              </Button>
            </div>
          </div>
        }
      />
    </div>
  )
}