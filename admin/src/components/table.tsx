import React, { useState } from 'react'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel
} from "@tanstack/react-table"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from "@/components/ui/pagination"

interface MyTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  TableAction?: React.ReactNode;
  emptyMessage: string;
}

export function MyTable<TData, TValue>({
  columns,
  data,
  TableAction,
  emptyMessage
}: MyTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div>
      {TableAction && (
        <div className="mb-2">
          {TableAction}
        </div>
      )}

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null :
                        flexRender(header.column.columnDef.header, header.getContext())
                      }
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} className="even:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {emptyMessage}
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
                  onClick={() => table.previousPage()}
                  className={!table.getCanPreviousPage() && "opacity-50 pointer-events-none"}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink isActive>
                  {table.getState().pagination.pageIndex + 1}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  className={!table.getCanNextPage() && "opacity-50 pointer-events-none"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  )
}
