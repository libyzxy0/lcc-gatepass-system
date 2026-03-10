import { useState, useMemo } from 'react'
import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import { Download } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getAllVisitors, type Visitor } from '@/api/helpers/visitors'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { VisitorTableActions } from '@/components/VisitorTableActions'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue
} from '@/components/ui/select'
import { CSVLink } from 'react-csv'
import { format } from 'date-fns'

type VisitorStatus = 'verified' | 'review' | 'unverified'

const statusBadges: Record<VisitorStatus, React.ReactNode> = {
  verified:   <Badge variant="default" className="bg-green-400/20  border-green-400/50  text-green-400">Verified</Badge>,
  unverified: <Badge variant="default" className="bg-red-400/20    border-red-400/50    text-red-400">Unverified</Badge>,
  review:     <Badge variant="default" className="bg-yellow-400/20 border-yellow-400/50 text-yellow-400">Review</Badge>,
}

const CSV_HEADERS = [
  { label: 'Visitor ID',   key: 'visitor_id'  },
  { label: 'First Name',   key: 'firstname'   },
  { label: 'Last Name',    key: 'lastname'    },
  { label: 'Middle Name',  key: 'middle_name' },
  { label: 'Status',       key: 'status'      },
  { label: 'Phone Number', key: 'phone_number'},
  { label: 'Email',        key: 'email'       },
  { label: 'Address',      key: 'address'     },
  { label: 'Date Created', key: 'created_at'  },
]

function toCSVRow(visitor: Visitor) {
  const status: VisitorStatus = visitor.verified
    ? 'verified'
    : visitor.valid_id_photo_url
      ? 'review'
      : 'unverified'

  return {
    visitor_id:   visitor.visitor_id,
    firstname:    visitor.firstname,
    lastname:     visitor.lastname,
    middle_name:  visitor.middle_name ?? 'N/A',
    status:       status.charAt(0).toUpperCase() + status.slice(1),
    phone_number: visitor.phone_number ? '0' + visitor.phone_number : 'N/A',
    email:        visitor.email,
    address:      visitor.address     ?? 'N/A',
    created_at:   visitor.created_at
      ? format(new Date(visitor.created_at), 'MMM dd, yyyy hh:mm aa')
      : '—',
  }
}

export default function Visitors() {
  const { isPending, error, data } = useQuery({
    queryKey:             ['get-all-visitors'],
    queryFn:              getAllVisitors,
    refetchInterval:      1000,
    refetchOnWindowFocus: true,
  })
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")

  const columns: ColumnDef<Visitor>[] = [
    {
      accessorKey: "visitor_id",
      header: "Visitor ID",
    },
    {
      accessorKey: "firstname",
      header: "First Name",
    },
    {
      accessorKey: "lastname",
      header: "Last Name",
    },
    {
      accessorKey: "middle_name",
      header: "Middle Name",
      cell: (info) => {
        const value = info.getValue<string | null>()
        return <div className="text-wrap">{value ? value : "N/A"}</div>
      },
    },
    {
      accessorKey: "verified",
      header: "Status",
      cell: (info) => {
        const verified = info.getValue<boolean | null>()
        return verified ? statusBadges['verified'] : info.row.original.valid_id_photo_url ? statusBadges['review'] : statusBadges['unverified']
      },
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
      cell: (info) => {
        const phone = info.getValue<boolean | null>()
        return <div className={info.row.original.activated ? 'text-green-400' : 'text-red-400'}>{"0" + phone}</div>
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: (info) => {
        const value = info.getValue<string | null>()
        return <div className="col-span-4">{value ?? "N/A"}</div>
      },
    },
    {
      id: 'actions',
      cell: info => <VisitorTableActions id={info.row.original.id} />
    }
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

    return data.filter(visitor => {
      const nameMatch = words.every(word =>
        visitor.firstname.toLowerCase().includes(word) ||
        visitor.lastname.toLowerCase().includes(word)
      )
      const idMatch = words.every(word =>
        visitor.visitor_id.toLowerCase().includes(word)
      )

      const status: VisitorStatus = visitor.verified
        ? 'verified'
        : visitor.valid_id_photo_url
          ? 'review'
          : 'unverified'

      const statusMatch = statusFilter === 'all' ? true : status === statusFilter

      return (nameMatch || idMatch) && statusMatch
    })
  }, [data, search, statusFilter])

  const csvData     = useMemo(() => filteredData.map(toCSVRow), [filteredData])
  const csvFilename = `visitors-${format(new Date(), 'yyyy-MM-dd')}.csv`

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-semibold text-2xl">Visitors</h1>
        <p className="text-muted-foreground mt-2">Manage all visitor accounts informations.</p>
      </header>
      <MyTable
        emptyMessage="No visitors data yet."
        columns={columns}
        data={filteredData}
        TableAction={
          <div className="flex justify-between items-center gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="hidden md:flex">
              <CSVLink
                data={csvData}
                headers={CSV_HEADERS}
                filename={csvFilename}
                className="no-underline"
              >
                <Button variant="outline">
                  <Download />
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