import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import { Download, Plus } from 'lucide-react';
import {
  useQuery,
} from '@tanstack/react-query'
import { getAllVisitors } from '@/api/helpers/visitors'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AddStudentDialog } from '@/components/AddStudentDialog'
import { StudentTableActions } from '@/components/StudentTableActions'

interface Student {
  id: string;
  student_id: string;
  firstname: string;
  lastname: string;
  middle_name: string | null;
  section: string;
  grade_level: string;
  parent_fullname: string;
  parent_phone_number: string;
  rfid_code: string;
  photo_url: string;
  address: string;
  created_at: string;
};

export const columns: ColumnDef<Student>[] = [
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
    accessorKey: "activated",
    header: "Activated",
    cell: (info) => {
      const activated = info.getValue<string | null>()
      return <div className="text-wrap">{activated ? "TRUE" : "FALSE"}</div>
    },
  },
  {
    accessorKey: "verified",
    header: "Status",
    cell: (info) => {
      const verified = info.getValue<string | null>()
      return <div className="text-wrap">{verified ? "Verified" : info.row.original.valid_id_photo_url ? 'To Review' : 'Not Verfied'}</div>
    },
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
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
      return <div className="text-wrap">{value ?? "N/A"}</div>
    },
  }
]

export default function Students() {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-all-visitors'],
    queryFn: getAllVisitors
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
        <h1 className="font-semibold text-2xl">Visitors</h1>
      </header>
      <MyTable
        emptyMessage={'No students data yet.'}
        columns={columns}
        data={data}
        TableAction={
          <div className="grid grid-cols-1 gap-2">
            <Button className="hidden md:flex" variant={'outline'}>
              <Download />
              Download CSV
            </Button>
          </div>
        }
      />
    </div>
  )
}