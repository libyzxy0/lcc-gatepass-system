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
import { getStudents } from '@/api/helpers/student'
import { Skeleton } from "@/components/ui/skeleton"

type Student = {
  id: string;
  student_id: string;
  firstname: string;
  lastname: string;
  middle_initial: string | null;
  section: string;
  grade_level: string;
  parent_phone_number: string;
  parent_email: string | null;
  rfid_code: string;
  photo_url: string;
  created_at: string;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "student_id",
    header: "Student ID",
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
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "grade_level",
    header: "Level",
  },
  {
    accessorKey: "parent_phone_number",
    header: "Parent Phone",
  },
  {
    accessorKey: "parent_email",
    header: "Parent Email",
  },
  {
    accessorKey: "rfid_code",
    header: "RFID Code",
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
              View Student</DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil />
              Edit Log</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash />
              Delete Log</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export default function StudentsLog() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-students'],
    queryFn: getStudents
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
        <h1 className="font-semibold text-2xl">Students Log</h1>
      </header>
      <StudentTable 
      columns={columns} 
      data={data}
      tableActionLabel={"New Student"} 
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