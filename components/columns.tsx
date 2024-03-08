"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "./new-york/ui/badge"
import { Checkbox } from "./new-york/ui/checkbox"

import { employerRatings, jobTypes, statuses } from "./table-data"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Job } from "@/types/job-schema"
import React from "react"


export const columns = (dict: Record<string, any>): ColumnDef<Job>[] => {
  
  return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={dict.dashboard.upcoming.t.columns.selectAll}
            className="translate-y-[2px]"
          />
        ),

      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={dict.dashboard.upcoming.t.columns.selectRow}
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "job_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.id} />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("job_id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "job_slug",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.jobSlug} />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("job_slug")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.title} />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("title")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.status} />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("status")
        )

        if (!status) {
          return null
        }

        return (
          <div className="flex w-[100px] items-center">
            {status.icon && (
              <status.icon className="mr-2 size-4 text-muted-foreground" />
            )}
            <span>{status.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "job_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.jobType} />
      ),
      cell: ({ row }) => {
        const job_type = jobTypes.find((label) => label.value === row.original.status)

        return (
          <div className="flex space-x-2">
            {job_type && <Badge variant="outline">{job_type.label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("job_type")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "referrer_url",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.employerURL} />
        ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("referrer_url")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "employer_phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.employerPhone} />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("employer_phone")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "employer_email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.employerEmail} />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("employer_email")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "employer_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.employerName} />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("employer_name")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "employer_rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.employerRating} />
      ),
      cell: ({ row }) => {
        const employerRating = employerRatings.find(
          (employerRating) => employerRating.value === row.getValue("employer_rating")
        )

        if (!employerRating) {
          return null
        }

        return (
          <div className="flex items-center">
            {employerRating.icon && (
              <employerRating.icon className="mr-2 size-4 text-muted-foreground" />
            )}
            <span>{employerRating.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "key_skills",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.keySkills} />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("key_skills")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}