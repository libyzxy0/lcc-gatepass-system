import { useState, useMemo } from 'react'
import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Download } from 'lucide-react';
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
import { LogsTableActions } from '@/components/LogsTableAction';
import { Badge } from "@/components/ui/badge"

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

const typeBadges = {
  student: <Badge variant="default" className="bg-blue-400/20 border-blue-400/50 text-blue-400">Student</Badge>,
  visitor: <Badge variant="default" className="bg-orange-400/20 border-orange-400/50 text-orange-400">Visitor</Badge>,
  staff: <Badge variant="default" className="bg-green-400/20 border-green-400/50 text-green-400">Staff</Badge>,
  guardian: <Badge variant="default" className="bg-yellow-400/20 border-yellow-400/50 text-yellow-400">Guardian</Badge>,
}

const entryTypeBadges = {
  rfid: <Badge variant="default" className="bg-sky-400/20 border-sky-400/50 text-sky-400">RFID</Badge>,
  qr: <Badge variant="default" className="bg-pink-400/20 border-pink-400/50 text-pink-400">QRC</Badge>,
}

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
      accessorKey: "entry_type",
      header: "Entry Type",
      cell: (info) => {
        const value = info.getValue<string | null>() ?? null;
        return entryTypeBadges[value]
      }
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (info) => {
        const value = info.getValue<string | null>() ?? null;
        return typeBadges[value];
      }
    },
    {
      id: 'actions',
      cell: (info) => <LogsTableActions id={info.row.original.id} />
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
        emptyMessage={"No logs to show yet."}
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