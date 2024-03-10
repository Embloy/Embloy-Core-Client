"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "./table"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { Locale } from "@/i18n-config"
import { useEffect } from "react"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { TooltipProvider } from "./new-york/ui/tooltip"
import { Skeleton } from "./ui/skeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  params: {
    lang: Locale
  }
  data: TData[]
  isLoading: boolean
}

export const GlobalFilterContext = React.createContext<{
  globalFilter: string
  setGlobalFilter: (filterValue: string) => void
}>({
  globalFilter: "",
  setGlobalFilter: () => {},
})

export const TableDictContext = React.createContext<{
  dict: Record<string, any>
  setDict: (dict: Record<string, any>) => void
}>({
  dict: [],
  setDict: () => {},
})

export function DataTable<TData, TValue>({
  columns,
  params: {lang},
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })


  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();
    }, [lang, dict]);
  
    if (isLoading) {
      return dict && (
        <div className="space-y-4">
        <TooltipProvider delayDuration={0}>
         <TableDictContext.Provider value={{ dict, setDict }}>
          <GlobalFilterContext.Provider value={{ globalFilter, setGlobalFilter }}>
            <div className="space-y-4">
              <DataTableToolbar
                table={table}
              />
            </div>
          </GlobalFilterContext.Provider>
          <div className="rounded-md border">
            <Table>
          <TableHeader>
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
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
              {Array.from({ length: 7 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex} className="h-12 text-center">
                      {/* Placeholder content */}
                      <Skeleton className="h-5" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        <DataTablePagination table={table} />
      </TableDictContext.Provider>
      </TooltipProvider>
    </div>
      );
    } else {
  return dict && (
    <div className="space-y-4">
      <TooltipProvider delayDuration={0}>
       <TableDictContext.Provider value={{ dict, setDict }}>
        <GlobalFilterContext.Provider value={{ globalFilter, setGlobalFilter }}>
          <div className="space-y-4">
            <DataTableToolbar
              table={table}
            />
          </div>
        </GlobalFilterContext.Provider>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {dict.dashboard.upcoming.t.noResults}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </TableDictContext.Provider>
      </TooltipProvider>
    </div>
    )
  }
}
