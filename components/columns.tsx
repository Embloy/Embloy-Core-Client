"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "./new-york/ui/checkbox"

import { statuses } from "./table-data"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Job } from "@/types/job-schema"
import React, { useState } from "react"
import { ExternalLink } from "lucide-react"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"


export const columns = (dict: Record<string, any>): ColumnDef<Job>[] => {
  
  const JobSlugCell = ({ row }) => {
    const [copied, setCopied] = useState(false);
  
    const copyToClipboard = async () => {
      await navigator.clipboard.writeText(row.getValue("job_slug"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };
  
    return (
      <div onClick={copyToClipboard} className="w-[80px] cursor-pointer truncate text-xs text-muted-foreground">
        {copied ? 'Copied!' : row.getValue("job_slug")}
      </div>
    );
  };
  
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
      cell: ({ row }) => <div className="w-[20px] truncate text-muted-foreground">{row.getValue("job_id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "job_slug",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.jobSlug} />
      ),
      cell: JobSlugCell,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.title} />
      ),
      cell: ({ row }) => <div className="w-[170px] font-bold">{row.getValue("title")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "job_status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.status} />
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
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.jobType} />
      ),
      cell: ({ row }) => {
        const job_type = row.getValue("job_type");
        let colorClasses = "bg-blue-200 text-blue-800";
    
        // TODO: Use external function for all job_types & sync with genius
        if (job_type === "Marketin1g") {
          colorClasses = "cursor-text px-4 py-1 bg-red-950 rounded-full border border-red-500 font-normal text-red-500 text-xs";
        } else if (job_type === "Marketing2") {
          colorClasses = "cursor-text px-4 py-1 bg-blue-950 rounded-full border border-embloy-blue font-normal text-embloy-blue text-xs";
        } else if (job_type === "Marketing") {
          colorClasses = "cursor-text px-4 py-1 bg-red-950 rounded-full border border-red-500 font-normal text-red-500 text-xs";
        }
    
        return (
          <div className="flex space-x-2">
            <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${colorClasses}`}>
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
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <a href={row.getValue("referrer_url")} target="_blank" rel="noopener noreferrer" className="mr-5 flex max-w-[80px] items-center">
            <ExternalLink/>
          </a>
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "employer_phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.employerPhone} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[80px] text-center">
          {row.getValue("employer_phone") ? row.getValue("employer_phone") : "N/A"}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "employer_email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.employerEmail} />
      ),
      cell: ({ row }) => (
        <a href={`mailto:${row.getValue("employer_email")}`} className="max-w-[80px] text-blue-500 hover:text-blue-700">
          {row.getValue("employer_email")}
        </a>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "employer_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.employerName} />
      ),
      cell: ({ row }) => <div className="max-w-[170px] font-bold">{row.getValue("employer_name")}</div>,
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
        <DataTableColumnHeader column={column} title={dict.dashboard.upcoming.t.columns.keySkills} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[180px] truncate" title={row.getValue("key_skills")}>
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