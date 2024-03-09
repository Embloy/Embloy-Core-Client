"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import { Input } from "./new-york/ui/input"
import { jobTypes, statuses } from "./table-data"
import { GlobalFilterContext, TableDictContext } from "./data-table"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { globalFilter, setGlobalFilter } = React.useContext(GlobalFilterContext)
  const { dict } = React.useContext(TableDictContext)

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={dict.dashboard.upcoming.t.toolBar.filterJobs}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("job_status") && (
          <DataTableFacetedFilter
            column={table.getColumn("job_status")}
            title={dict.dashboard.upcoming.t.toolBar.jobStatus}
            options={statuses}
          />
        )}
        {table.getColumn("job_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("job_type")}
            title={dict.dashboard.upcoming.t.toolBar.jobType}
            options={jobTypes}
          />
        )}
        {/*table.getColumn("employer_rating") && (
          <DataTableFacetedFilter
            column={table.getColumn("employer_rating")}
            title={dict.dashboard.upcoming.t.toolBar.employerRating}
            options={employerRatings}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
             {dict.dashboard.upcoming.t.toolbar.reset}
            <Cross2Icon className="ml-2 size-4" />
          </Button>
        )*/}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}