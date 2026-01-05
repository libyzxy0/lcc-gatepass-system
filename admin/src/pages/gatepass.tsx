import { GatepassTable } from '@/components/gatepass-table'
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from 'lucide-react';
import {
  useQuery,
} from '@tanstack/react-query'
import { getAllGatepass } from '@/api/helpers/gatepass'
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GatepassTableAction } from '@/components/GatepassTableAction'

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

const colorMap: Record<string, string> = {
  'pending': 'bg-yellow-400',
  'approved': 'bg-green-400',
  'expired': 'bg-orange-500',
  'rejected': 'bg-red-500'
}

export const columns: ColumnDef<Gatepass>[] = [
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
      return <div className="text-wrap">{value ?? "N/A"}</div>
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
      const status = info.getValue<string>()
      return (
        <Badge className={`capitalize ${colorMap[status]}`}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <GatepassTableAction id={row.original.id} />,
  },
]


export default function Gatepass() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-gatepass'],
    queryFn: getAllGatepass
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
        <h1 className="font-semibold text-2xl">Gatepass</h1>
      </header>
      <GatepassTable
        columns={columns}
        data={data}
      />
    </div>
  )
}