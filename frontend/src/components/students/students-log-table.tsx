import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function StudentsLogTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = useState<SortingState>([])
  const [filterType, setFilterType] = useState('name');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters
    },
  })

  return (
    <div>
      <div className="flex justify-end gap-2 py-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="student_id">Student ID</SelectItem>
            <SelectItem value="section">Section</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder={`Search by ${filterType}...`}
          value={(table.getColumn(filterType)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterType)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="even:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No student logs yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Pagination className="flex items-center justify-end space-x-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.getCanPreviousPage() && table.previousPage()}
                  className={!table.getCanPreviousPage() ? 'opacity-50 pointer-event-none' : ''} />
              </PaginationItem>
              <PaginationItem>
                {table.getCanPreviousPage() && (
                  <PaginationLink>{table.getState().pagination.pageIndex + 1 - 1}</PaginationLink>
                )}
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>
                  {table.getState().pagination.pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                {table.getCanNextPage() && (
                  <PaginationLink>{table.getState().pagination.pageIndex + 1 + 1}</PaginationLink>
                )}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => table.getCanNextPage() && table.nextPage()}
                  className={!table.getCanNextPage() ? 'opacity-50 pointer-event-none' : ''} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  )
}