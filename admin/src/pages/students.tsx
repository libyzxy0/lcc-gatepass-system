import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash, Pencil, IdCard, Ellipsis, Import, Plus } from 'lucide-react';
import {
  useQuery,
} from '@tanstack/react-query'
import { getStudents } from '@/api/helpers/student'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AddStudentDialog } from '@/components/AddStudentDialog'

type Student = {
  id: string;
  student_id: string;
  firstname: string;
  lastname: string;
  middle_name: string | null;
  section: string;
  grade_level: string;
  parent_phone_number: string;
  parent_name: string | null;
  rfid_code: string;
  photo_url: string;
  address: string;
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
    accessorKey: "middle_name",
    header: "Middle Name"
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
    accessorKey: "parent_name",
    header: "Parent Name",
  },
  {
    accessorKey: "parent_phone_number",
    header: "Parent Phone",
  },
  {
    accessorKey: "rfid_code",
    header: "RFID CODE",
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
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-students'],
    queryFn: getStudents
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
        <h1 className="font-semibold text-2xl">Students</h1>
      </header>
      <MyTable
        emptyMessage={'No students data yet.'}
        columns={columns}
        data={data}
        TableAction={
          <div className="grid grid-cols-2 gap-2">
            <Button className="hidden md:flex" variant={'outline'}>
              <Import />
              Import CSV
            </Button>
            <AddStudentDialog onCreate={() => refetch()}>
              <Button>
                <Plus />
                Add Student
              </Button>
            </AddStudentDialog>
          </div>
        }
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