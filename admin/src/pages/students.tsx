import { MyTable } from '@/components/table'
import type { ColumnDef } from "@tanstack/react-table"
import { Download, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'
import { getStudents } from '@/api/helpers/student'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddStudentDialog } from '@/components/AddStudentDialog'
import { StudentTableActions } from '@/components/StudentTableActions'
import { useState, useMemo } from 'react'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue
} from '@/components/ui/select'
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

export default function Students() {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-students'],
    queryFn: getStudents
  })
  const [sectionFilter, setSectionFilter] = useState("")
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

    return data.filter(student => {
      const nameMatch = words.every(word =>
        student.firstname.toLowerCase().includes(word) ||
        student.lastname.toLowerCase().includes(word)
      )

      const sectionMatch = sectionFilter.toLowerCase() === 'all' ? true : sectionFilter
        ? student.grade_level.toLowerCase() === sectionFilter.toLowerCase()
        : true

      return nameMatch && sectionMatch
    })
  }, [data, search, sectionFilter])

  const columns: ColumnDef<Student>[] = [
    { accessorKey: "student_id", header: "Student ID" },
    { accessorKey: "firstname", header: "First Name" },
    { accessorKey: "lastname", header: "Last Name" },
    {
      accessorKey: "middle_name",
      header: "Middle Name",
      cell: info => info.getValue<string | null>() ?? "N/A"
    },
    {
      accessorKey: "section",
      header: "Section",
      cell: info => info.getValue<string | null>() ?? "N/A"
    },
    { accessorKey: "grade_level", header: "Level" },
    { accessorKey: "parent_fullname", header: "Parent Name" },
    {
      accessorKey: "address",
      header: "Address",
      cell: info => <div className="text-wrap">{info.getValue<string | null>() ?? "N/A"}</div>
    },
    { accessorKey: "rfid_code", header: "RFID CODE" },
    {
      id: 'actions',
      cell: info => <StudentTableActions id={info.row.original.id} />
    }
  ]

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-semibold text-2xl">Students</h1>
      </header>
      <MyTable
        emptyMessage="No students data yet."
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
                value={sectionFilter}
                onValueChange={setSectionFilter}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'all'}>All</SelectItem>
                  <SelectItem value="SHS-12">SHS-12</SelectItem>
                  <SelectItem value="SHS-11">SHS-11</SelectItem>
                  <SelectItem value="JHS-10">JHS-10</SelectItem>
                  <SelectItem value="JHS-9">JHS-9</SelectItem>
                  <SelectItem value="JHS-8">JHS-8</SelectItem>
                  <SelectItem value="JHS-7">JHS-7</SelectItem>
                  <SelectItem value="ELEM-6">ELEM-6</SelectItem>
                  <SelectItem value="ELEM-5">ELEM-5</SelectItem>
                  <SelectItem value="ELEM-4">ELEM-4</SelectItem>
                  <SelectItem value="ELEM-3">ELEM-3</SelectItem>
                  <SelectItem value="ELEM-2">ELEM-2</SelectItem>
                  <SelectItem value="ELEM-1">ELEM-1</SelectItem>
                  <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-2">
              <Button variant={'outline'}>
                <Download />
                Download CSV
              </Button>
              <AddStudentDialog onCreate={() => refetch()}>
                <Button>
                  <Plus />
                  Add Student
                </Button>
              </AddStudentDialog>
            </div>
          </div>
        }
      />
    </div>
  )
}
