import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import { useQuery } from '@tanstack/react-query'
import { getStaffs } from '@/api/helpers/staff'
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from 'react'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue
} from '@/components/ui/select'
import { Badge } from "@/components/ui/badge"
import { RFIDCode } from '@/components/RFIDCode'
import { StaffTableActions } from '@/components/StaffTableActions'
import { StaffToolbarActions } from '@/components/StaffToolbarActions'
import { format } from 'date-fns'

interface Staff {
  id: string
  staff_id: string
  firstname: string
  lastname: string
  middle_name: string | null
  phone_number: string
  rfid_code: string
  staff_type: string
  photo_url: string | null
  email: string
  created_at: string
}

type StaffType = 'faculty' | 'guard' | 'administrator' | 'canteen_vendors' | 'other'

const typeBadges: Record<StaffType, React.ReactNode> = {
  faculty:         <Badge variant="default" className="bg-blue-400/20   border-blue-400/50   text-blue-400">Faculty</Badge>,
  guard:           <Badge variant="default" className="bg-red-400/20    border-red-400/50    text-red-400">Security</Badge>,
  administrator:   <Badge variant="default" className="bg-green-400/20  border-green-400/50  text-green-400">Admin</Badge>,
  canteen_vendors: <Badge variant="default" className="bg-yellow-400/20 border-yellow-400/50 text-yellow-400">Vendors</Badge>,
  other:           <Badge variant="default" className="bg-gray-400/20   border-gray-400/50   text-gray-400">Other</Badge>,
}

const CSV_HEADERS = [
  { label: 'Staff ID',      key: 'staff_id' },
  { label: 'First Name',    key: 'firstname' },
  { label: 'Last Name',     key: 'lastname' },
  { label: 'Middle Name',   key: 'middle_name' },
  { label: 'Phone Number',  key: 'phone_number' },
  { label: 'Email',         key: 'email' },
  { label: 'Staff Type',    key: 'staff_type' },
  { label: 'RFID Code',     key: 'rfid_code' },
  { label: 'Date Created',  key: 'created_at' },
]

const STAFF_TYPE_LABEL: Record<StaffType, string> = {
  faculty:         'Faculty',
  guard:           'Security',
  administrator:   'Administrator',
  canteen_vendors: 'Canteen Vendors',
  other:           'Other',
}

function toCSVRow(staff: Staff) {
  return {
    staff_id:     staff.staff_id,
    firstname:    staff.firstname,
    lastname:     staff.lastname,
    middle_name:  staff.middle_name ?? 'N/A',
    phone_number: staff.phone_number,
    email:        staff.email,
    staff_type:   STAFF_TYPE_LABEL[staff.staff_type as StaffType] ?? staff.staff_type,
    rfid_code:    staff.rfid_code,
    created_at:   staff.created_at
      ? format(new Date(staff.created_at), 'MMM dd, yyyy hh:mm aa')
      : '—',
  }
}

export default function Staff() {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-all-staffs'],
    queryFn: getStaffs,
  })
  const [typeFilter, setTypeFilter] = useState("")
  const [search, setSearch] = useState("")

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
    return data.filter(staff => {
      const nameMatch = words.every(word =>
        staff.firstname.toLowerCase().includes(word) ||
        staff.lastname.toLowerCase().includes(word)
      )
      const idMatch = words.every(word =>
        staff.staff_id.toLowerCase().includes(word)
      )
      const typeMatch = typeFilter.toLowerCase() === 'all' ? true : typeFilter
        ? staff.staff_type.toLowerCase() === typeFilter.toLowerCase()
        : true
      return (nameMatch || idMatch) && typeMatch
    })
  }, [data, search, typeFilter])

  const csvData     = useMemo(() => filteredData.map(toCSVRow), [filteredData])
  const csvFilename = `staffs-${format(new Date(), 'yyyy-MM-dd')}.csv`

  const columns: ColumnDef<Staff>[] = [
    { accessorKey: "staff_id",  header: "Staff ID" },
    { accessorKey: "firstname", header: "First Name" },
    { accessorKey: "lastname",  header: "Last Name" },
    {
      accessorKey: "middle_name",
      header: "Middle Name",
      cell: info => info.getValue<string | null>() || 'N/A'
    },
    { accessorKey: "phone_number", header: "Phone" },
    {
      accessorKey: "email",
      header: "Email",
      cell: info => <div className="text-wrap">{info.getValue<string | null>() ?? "N/A"}</div>
    },
    {
      accessorKey: "staff_type",
      header: "Type",
      cell: info => {
        const value = info.getValue<StaffType>()
        return value ? typeBadges[value] : 'N/A'
      }
    },
    {
      accessorKey: "rfid_code",
      header: "RFID CODE",
      cell: info => <RFIDCode value={info.row.original.rfid_code} />
    },
    {
      id: 'actions',
      cell: info => <StaffTableActions id={info.row.original.id} />
    }
  ]

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-semibold text-2xl">Staffs</h1>
        <p className="text-muted-foreground mt-2">Manage all staffs informations.</p>
      </header>
      <MyTable
        emptyMessage="No staffs data yet."
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="guard">Security</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="canteen_vendors">Canteen Vendors</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <StaffToolbarActions
              csvData={csvData}
              csvHeaders={CSV_HEADERS}
              csvFilename={csvFilename}
              onRefetch={() => refetch()}
            />
          </div>
        }
      />
    </div>
  )
}