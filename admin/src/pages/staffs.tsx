import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import { Download, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'
import { getStaffs } from '@/api/helpers/staff'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddStaffDialog } from '@/components/AddStaffDialog'
import { StaffTableActions } from '@/components/StaffTableActions'
import { useState, useMemo } from 'react'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue
} from '@/components/ui/select'

interface Staff {
  id: string;
  staff_id: string;
  firstname: string;
  lastname: string;
  middle_name: string | null;
  phone_number: string;
  rfid_code: string;
  staff_type: string;
  photo_url: string | null;
  email: string;
  created_at: string;
};

export default function Staff() {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-all-staffs'],
    queryFn: getStaffs
  })
  const [typeFilter, setSectionFilter] = useState("")
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

      const sectionMatch = typeFilter.toLowerCase() === 'all' ? true : typeFilter
        ? staff.staff_type.toLowerCase() === typeFilter.toLowerCase()
        : true

      return nameMatch && sectionMatch
    })
  }, [data, search, typeFilter])

  const columns: ColumnDef<Staff>[] = [
    { accessorKey: "staff_id", header: "Staff ID" },
    { accessorKey: "firstname", header: "First Name" },
    { accessorKey: "lastname", header: "Last Name" },
    {
      accessorKey: "middle_name",
      header: "Middle Name",
      cell: info => info.getValue<string | null>() ?? "N/A"
    },
    {
      accessorKey: "staff_type",
      header: "Type",
      cell: info => info.getValue<string | null>() ?? "N/A"
    },
    { accessorKey: "phone_number", header: "Level" },
    {
      accessorKey: "email",
      header: "Email",
      cell: info => <div className="text-wrap">{info.getValue<string | null>() ?? "N/A"}</div>
    },
    { accessorKey: "rfid_code", header: "RFID CODE" },
    {
      id: 'actions',
      cell: info => <StaffTableActions id={info.row.original.id} />
    }
  ]

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-semibold text-2xl">Staff</h1>
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
              <Select
                value={typeFilter}
                onValueChange={setSectionFilter}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'all'}>All</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="guard">Guard/Security</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="canteen_vendors">Canteen Vendors</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-2">
              <Button variant={'outline'}>
                <Download />
                Download CSV
              </Button>
              <AddStaffDialog onCreate={() => refetch()}>
                <Button>
                  <Plus />
                  Add Staff
                </Button>
              </AddStaffDialog>
            </div>
          </div>
        }
      />
    </div>
  )
}
