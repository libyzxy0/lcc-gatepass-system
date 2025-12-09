import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash, Pencil, IdCard } from 'lucide-react';
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


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function StudentsLogTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })
  return (
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
                <TableHead>
                  Actions
                </TableHead>
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
                  <TableCell className="flex justify-center">
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
                          Edit</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Trash />
                          Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
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
                <PaginationLink>{table.getState().pagination.pageIndex - 2}</PaginationLink>
              )}
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>
                {table.getState().pagination.pageIndex + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              {table.getCanNextPage() && (
                <PaginationLink>{table.getState().pagination.pageIndex + 2}</PaginationLink>
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
  )
}