"use client"

import React, { useState } from "react"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { ExternalLink } from "lucide-react"

import { Job } from "@/types/job-schema"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Checkbox } from "./new-york/ui/checkbox"
import { jobTypeColorClasses, jobTypes, statuses } from "./table-data"

export const columns = (dict: Record<string, any>): ColumnDef<Job>[] => {
  const JobSlugCell = ({ row }) => {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
      await navigator.clipboard.writeText(row.getValue("job_slug"))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    }

    return (
      <div
        onClick={copyToClipboard}
        className="w-[80px] cursor-pointer truncate text-xs text-muted-foreground"
      >
        {copied ? "Copied!" : row.getValue("job_slug")}
      </div>
    )
  }

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
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.dashboard.upcoming.t.columns.id}
        />
      ),
      cell: ({ row }) => (
        <div className="w-[30px] truncate text-muted-foreground">
          {row.getValue("id")}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "job_slug",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.dashboard.upcoming.t.columns.jobSlug}
        />
      ),
      cell: JobSlugCell,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.dashboard.upcoming.t.columns.title}
        />
      ),
      cell: ({ row }) => (
        <div className="w-[170px]">{row.getValue("title")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "start_slot",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="hidden"
          column={column}
          title={dict.dashboard.upcoming.t.columns.startSlot}
        />
      ),
      cell: ({ row }) => (
        <div className="hidden w-[170px]">{row.getValue("start_slot")}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "job_status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.dashboard.upcoming.t.columns.status}
        />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("job_status")
        )

        if (!status) {
          return (
            <div className="flex w-[100px] items-center text-muted-foreground">
              <QuestionMarkCircledIcon className="mr-2 size-4 text-muted-foreground" />
              <span>Unknown</span>
            </div>
          )
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
        <DataTableColumnHeader
          column={column}
          title={dict.dashboard.upcoming.t.columns.jobType}
        />
      ),
      cell: ({ row }) => {
        const jobType = jobTypes.find(
          (jobType) => jobType.value === row.getValue("job_type")
        )

        if (!jobType) {
          return (
            <div className="flex w-[100px] items-center justify-center text-muted-foreground">
              <QuestionMarkCircledIcon className="mr-2 size-4 text-muted-foreground" />
              <span>Unknown</span>
            </div>
          )
        }
        let colorClasses = jobTypeColorClasses[jobType.value]

        if (!colorClasses) {
          colorClasses =
            "cursor-text px-4 py-1 bg-gray-100 dark:bg-gray-950 rounded-full border border-gray-600 dark:border-gray-500 font-normal text-gray-600 dark:text-gray-500 text-xs"
        }

        return (
          <div className="flex justify-center space-x-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${colorClasses}`}
            >
              {jobType.label}
            </span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "referrer_url",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.dashboard.upcoming.t.columns.employerURL}
        />
      ),
      cell: ({ row }) =>
        row.getValue("referrer_url") ? (
          <a
            href={row.getValue("referrer_url")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex max-w-[80px] items-center justify-center"
          >
            <ExternalLink />
          </a>
        ) : (
          <div className="flex max-w-[80px] items-center justify-center text-gray-500">
            N/A
          </div>
        ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "employer.employer_phone",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.dashboard.upcoming.t.columns.employerPhone}
        />
      ),
      cell: ({ row }) => {
        const employer = row.original.employer
        return (
          <div className="max-w-[80px] text-center">
            {employer?.employer_phone || "N/A"}
          </div>
        )
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "employer.employer_email",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.dashboard.upcoming.t.columns.employerEmail}
        />
      ),
      cell: ({ row }) => {
        const employer = row.original.employer
        return (
          <a
            href={`mailto:${employer?.employer_email}`}
            className="max-w-[80px] hover:text-blue-500 hover:underline"
          >
            {employer?.employer_email || "N/A"}
          </a>
        )
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "employer.employer_name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.dashboard.upcoming.t.columns.employerName}
        />
      ),
      cell: ({ row }) => {
        const employer = row.original.employer
        return (
          <div className="max-w-[160px] font-bold">
            {employer?.employer_name || "N/A"}
          </div>
        )
      },
      enableSorting: true,
      enableHiding: true,
    },
    /*    {
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
    },*/
    {
      accessorKey: "key_skills",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={dict.dashboard.upcoming.t.columns.keySkills}
        />
      ),
      cell: ({ row }) => (
        <div
          className="max-w-[180px] truncate"
          title={row.getValue("key_skills")}
        >
          {row.getValue("key_skills")}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
