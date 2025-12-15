import { StudentTable } from '@/components/students/student-table'
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash, Pencil, IdCard, Ellipsis } from 'lucide-react';
import {
  useQuery,
} from '@tanstack/react-query'
import { getVisitors } from '@/api/helpers/visitor'
import { Skeleton } from "@/components/ui/skeleton"

type Visitor = {
  id: string;
  visitor_id: string;
  firstname: string;
  lastname: string;
  middle_initial: string | null;
  phone_number: string;
  email: string | null;
  photo_url: string;
  created_at: string;
  verified: boolean;
  activated: boolean;
  pin: string;
  valid_id_type: string;
  valid_id_photo_url: string;
};

export const columns: ColumnDef<Visitor>[] = [
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
    accessorKey: "middle_initial",
    header: "M.I.",
  },
  {
    accessorKey: "phone_number",
    header: "Parent Phone",
  },
  {
    accessorKey: "email",
    header: "Parent Email",
  },
  {
    accessorKey: "verified",
    header: "Verified",
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
            <DropdownMenuItem>
              <Pencil />
              Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash />
              Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export default function StudentsLog() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-visitors'],
    queryFn: getVisitors
  })
  
  const handleCreateStudent = async () => {
    
  }

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
      <StudentTable 
      columns={columns} 
      data={data}
      tableActionLabel={"New Visitor"} 
      onTableActionClick={handleCreateStudent}
      filterSelect={[
        {
          id: 'student_id',
          label: "Student ID"
        },
        {
          id: 'rfid_code',
          label: "RFID Code"
        },
        {
          id: 'firstname',
          label: "First Name"
        },
        {
          id: 'lastname',
          label: "Last Name"
        },
        {
          id: 'section',
          label: "Section"
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