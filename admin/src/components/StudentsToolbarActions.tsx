import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddStudentDialog } from '@/components/AddStudentDialog'
import { ImportCSVDialog } from '@/components/ImportStudentCSVDialog'
import { CSVLink } from 'react-csv'
import { Download, Upload, Plus, MoreHorizontal } from 'lucide-react'

interface Props {
  csvData: Record<string, string>[]
  csvHeaders: { label: string; key: string }[]
  csvFilename: string
  onRefetch: () => void
}

export function StudentsToolbarActions({ csvData, csvHeaders, csvFilename, onRefetch }: Props) {
  return (
    <>
      {/* Desktop: show all 3 buttons */}
      <div className="hidden md:flex items-center gap-2">
        <CSVLink data={csvData} headers={csvHeaders} filename={csvFilename} className="no-underline">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
        </CSVLink>
        <ImportCSVDialog onImport={onRefetch}>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1.5" />
            Import CSV
          </Button>
        </ImportCSVDialog>
        <AddStudentDialog onCreate={onRefetch}>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Student
          </Button>
        </AddStudentDialog>
      </div>

      {/* Mobile: Add Student prominent + overflow menu for the rest */}
      <div className="flex md:hidden items-center gap-2">
        <AddStudentDialog onCreate={onRefetch}>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </AddStudentDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <CSVLink data={csvData} headers={csvHeaders} filename={csvFilename} className="no-underline text-foreground flex items-center gap-2 w-full cursor-pointer">
                <Download className="w-4 h-4" />
                Export CSV
              </CSVLink>
            </DropdownMenuItem>
            <ImportCSVDialog onImport={onRefetch}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import CSV
              </DropdownMenuItem>
            </ImportCSVDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}