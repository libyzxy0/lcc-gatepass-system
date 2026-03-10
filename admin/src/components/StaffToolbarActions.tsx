import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddStaffDialog } from '@/components/AddStaffDialog'
import { ImportStaffCSVDialog } from '@/components/ImportStaffCSVDialog'
import { CSVLink } from 'react-csv'
import { Download, Upload, Plus, MoreHorizontal } from 'lucide-react'

interface Props {
  csvData: Record<string, string>[]
  csvHeaders: { label: string; key: string }[]
  csvFilename: string
  onRefetch: () => void
}

export function StaffToolbarActions({ csvData, csvHeaders, csvFilename, onRefetch }: Props) {
  return (
    <>
      {/* Desktop: all 3 buttons inline */}
      <div className="hidden md:flex items-center gap-2">
        <CSVLink data={csvData} headers={csvHeaders} filename={csvFilename} className="no-underline">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
        </CSVLink>
        <ImportStaffCSVDialog onImport={onRefetch}>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1.5" />
            Import CSV
          </Button>
        </ImportStaffCSVDialog>
        <AddStaffDialog onCreate={onRefetch}>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Staff
          </Button>
        </AddStaffDialog>
      </div>

      {/* Mobile: Add Staff prominent + overflow menu */}
      <div className="flex md:hidden items-center gap-2">
        <AddStaffDialog onCreate={onRefetch}>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </AddStaffDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={csvFilename}
                className="no-underline text-foreground flex items-center gap-2 w-full cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </CSVLink>
            </DropdownMenuItem>
            <ImportStaffCSVDialog onImport={onRefetch}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import CSV
              </DropdownMenuItem>
            </ImportStaffCSVDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}