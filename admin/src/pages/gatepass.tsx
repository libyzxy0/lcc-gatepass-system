import { useState, useMemo } from 'react'
import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'
import { getAllGatepass } from '@/api/helpers/gatepass'
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { GatepassTableAction } from '@/components/GatepassTableAction'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue
} from '@/components/ui/select'

type Gatepass = {
  id: string;
  visitor_id: string;
  purpose: string;
  description: string;
  vehicle_type: string | null;
  vehicle_plate: string | null;
  qr_token: string;
  schedule_date: string;
  status: 'approved' | 'pending' | 'expired' | 'rejected';
  created_at: string;
};

const statusBadges = {
  rejected: <Badge variant="default" className="bg-orange-400/20 border-orange-400/50 text-orange-400">Rejected</Badge>,
  expired: <Badge variant="default" className="bg-red-400/20 border-red-400/50 text-red-400">Expired</Badge>,
  approved: <Badge variant="default" className="bg-green-400/20 border-green-400/50 text-green-400">Approved</Badge>,
  pending: <Badge variant="default" className="bg-yellow-400/20 border-yellow-400/50 text-yellow-400">Pending</Badge>
}


export default function Gatepass() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-gatepass'],
    queryFn: getAllGatepass,
    refetchInterval: 1000,
    refetchOnWindowFocus: true
  })
  
  const columns: ColumnDef<Gatepass>[] = [
  {
    accessorKey: "gatepass_id",
    header: "QRC ID",
  },
  {
    accessorKey: "visitor_fullname",
    header: "Visitor",
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (info) => {
      const value = info.getValue<string | null>()
      return <div className="col-span-3">{value ?? "N/A"}</div>
    },
  },
  {
    accessorKey: "schedule_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Scheduled Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: (info) => {
      const value = info.getValue<string | null>()
      return value
        ? new Date(value).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A"
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Requested At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: (info) => {
      const value = info.getValue<string | null>()
      return value
        ? new Date(value).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A"
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue<'pending' | 'approved' | 'rejected' | 'expired'>()
      return status ? statusBadges[status] : 'N/A'
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <GatepassTableAction id={row.original.id} pending={row.original.status === 'pending'} />,
  },
]

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
  
  const filteredData = useMemo(() => {
    if (!data) return []

    const words = search.toLowerCase().trim().split(/\s+/)

    return data.filter(gpass => {
      const nameMatch = words.every(word =>
        gpass.visitor_fullname.toLowerCase().includes(word)
      )
    
    const idMatch = words.every(word =>
        gpass.gatepass_id.toLowerCase().includes(word)
      )
      const statusMatch =
        statusFilter === "all" ? true : gpass.status === statusFilter

      return (nameMatch || idMatch) && statusMatch;
    })
  }, [data, search, statusFilter])

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-semibold text-2xl">QRCode Pass</h1>
        <p className="text-muted-foreground mt-2">Manage all gatepass informations.</p>
        <div className="border-l-4 border-green-200 px-2 text-gray-400 bg-gray-200/20 my-2 md:w-[400px]"><p className="py-2 text-[12px]"><span className="text-green-400 font-bold">Quick Note:</span>{" "}QR Code Passes that are requested by verified visitor accounts will be automatically approve.</p></div>
      </header>
      <MyTable
        columns={columns}
        data={filteredData}
        emptyMessage={'No QrPass data yet.'}
        TableAction={
          <div className="flex justify-between gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              <Select
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'all'}>All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:flex">
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