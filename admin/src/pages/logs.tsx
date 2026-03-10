import { useState, useMemo } from 'react'
import { CSVLink } from 'react-csv'
import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from "@/components/ui/skeleton"
import { getAllLogs } from '@/api/helpers/logs'
import { useQuery } from '@tanstack/react-query'
import { toPHTime } from '@/utils/convert-time'
import { LogsTableActions } from '@/components/LogsTableAction'
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type DateRange } from "react-day-picker"
import { format } from "date-fns"

type LogEntryType = 'student' | 'visitor' | 'staff' | 'guardian'
type LogScanType = 'qr' | 'rfid'

type LogsType = {
  id: string
  log_id: string
  type: LogEntryType
  name: string
  time_in: string
  time_out: string
  entity_id: string
  device_id: string
  entry_type: LogScanType
  created_at: string
}

const CSV_HEADERS = [
  { label: 'Log ID',       key: 'log_id'      },
  { label: 'Full Name',    key: 'name'         },
  { label: 'Person Type',  key: 'type'         },
  { label: 'Scan Method',  key: 'entry_type'   },
  { label: 'Time In',      key: 'time_in_ph'   },
  { label: 'Time Out',     key: 'time_out_ph'  },
  { label: 'Device ID',    key: 'device_id'    },
  { label: 'Date Created', key: 'created_at'   },
]

function toCSVRow(log: LogsType) {
  const SCAN_LABEL: Record<LogScanType, string> = {
    rfid: 'RFID Card',
    qr:   'QR Code',
  }
  const TYPE_LABEL: Record<LogEntryType, string> = {
    student:  'Student',
    visitor:  'Visitor',
    staff:    'Staff',
    guardian: 'Guardian',
  }

  return {
    log_id:      log.log_id,
    name:        log.name,
    type:        TYPE_LABEL[log.type]       ?? log.type,
    entry_type:  SCAN_LABEL[log.entry_type] ?? log.entry_type,
    time_in_ph:  toPHTime(log.time_in  ?? null),
    time_out_ph: toPHTime(log.time_out ?? null),
    device_id:   log.device_id,
    created_at:  log.created_at
      ? format(new Date(log.created_at), 'MMM dd, yyyy hh:mm aa')
      : '—',
  }
}

const TYPE_BADGES: Record<LogEntryType, React.ReactNode> = {
  student:  <Badge className="bg-blue-400/20   border-blue-400/50   text-blue-400">Student</Badge>,
  visitor:  <Badge className="bg-orange-400/20 border-orange-400/50 text-orange-400">Visitor</Badge>,
  staff:    <Badge className="bg-green-400/20  border-green-400/50  text-green-400">Staff</Badge>,
  guardian: <Badge className="bg-yellow-400/20 border-yellow-400/50 text-yellow-400">Guardian</Badge>,
}

const SCAN_BADGES: Record<LogScanType, React.ReactNode> = {
  rfid: <Badge className="bg-sky-400/20  border-sky-400/50  text-sky-400">RFID</Badge>,
  qr:   <Badge className="bg-pink-400/20 border-pink-400/50 text-pink-400">QRC</Badge>,
}

export default function Logs() {
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to:   undefined,
  })

  const { isPending, error, data } = useQuery({
    queryKey:             ['get-all-logs'],
    queryFn:              getAllLogs,
    refetchInterval:      500,
    refetchOnWindowFocus: true,
  })

  const columns: ColumnDef<LogsType>[] = [
    {
      accessorKey: 'log_id',
      header: 'Log ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'time_in',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Time In
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => toPHTime(info.getValue<string | null>() ?? null),
    },
    {
      accessorKey: 'time_out',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Time Out
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => toPHTime(info.getValue<string | null>() ?? null),
    },
    {
      accessorKey: 'entry_type',
      header: 'Used',
      cell: (info) => SCAN_BADGES[info.getValue<LogScanType>()],
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: (info) => TYPE_BADGES[info.getValue<LogEntryType>()],
    },
    {
      id: 'actions',
      cell: (info) => <LogsTableActions id={info.row.original.id} />,
    },
  ]

  const filteredData = useMemo(() => {
    if (!data) return []

    const words = search.toLowerCase().trim().split(/\s+/)

    return data.filter((log) => {
      const nameMatch = words.every((w) => log.name.toLowerCase().includes(w))
      const idMatch   = words.every((w) => log.log_id.toLowerCase().includes(w))

      if (dateRange?.from && dateRange?.to) {
        const createdAt = new Date(log.created_at)
        const from      = new Date(dateRange.from).setHours(0, 0, 0, 0)
        const to        = new Date(dateRange.to).setHours(23, 59, 59, 999)
        if (createdAt < new Date(from) || createdAt > new Date(to)) return false
      }

      return nameMatch || idMatch
    })
  }, [data, search, dateRange])

  const csvData     = useMemo(() => filteredData.map(toCSVRow), [filteredData])
  const csvFilename = `gate-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`

  if (error) return <p>An error has occurred: {error.message}</p>

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
        <h1 className="font-semibold text-2xl">Gate Logs</h1>
        <p className="text-muted-foreground mt-2">Monitor log informations.</p>
      </header>

      <MyTable
        emptyMessage="No logs to show yet."
        columns={columns}
        data={filteredData}
        TableAction={
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="md:max-w-[224px] justify-start text-left font-normal"
                  >
                    {dateRange?.from ? (
                      dateRange.to
                        ? `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`
                        : format(dateRange.from, 'LLL dd, y')
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    numberOfMonths={2}
                    selected={dateRange}
                    onSelect={setDateRange}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="hidden md:flex">
              <CSVLink
                data={csvData}
                headers={CSV_HEADERS}
                filename={csvFilename}
                className="no-underline"
              >
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              </CSVLink>
            </div>
          </div>
        }
      />
    </div>
  )
}