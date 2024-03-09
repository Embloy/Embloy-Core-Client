"use client"

import { Locale } from "@/i18n-config"
import { jobSchema } from "../types/job-schema"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "./new-york/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./new-york/ui/dropdown-menu"
import Link from "next/link"
import { TableDictContext } from "./data-table"
import React from "react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = jobSchema.parse(row.original)
  const { dict } = React.useContext(TableDictContext)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="size-4" />
          <span className="sr-only">{dict.dashboard.upcoming.t.rowActions.openMenu}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Link href={`/dashboard/applications?id=${row.getValue("job_id")}&slug=${row.getValue("job_slug")}`}>
            <DropdownMenuItem>{dict.dashboard.upcoming.t.rowActions.goToApplication}</DropdownMenuItem>
        </Link>
        <DropdownMenuItem disabled>{dict.dashboard.upcoming.t.rowActions.labels}</DropdownMenuItem>
        <DropdownMenuItem disabled>{dict.dashboard.upcoming.t.rowActions.favorites}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>{dict.dashboard.upcoming.t.rowActions.share}</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.job_slug} className="ml-0 mr-5">
              <DropdownMenuRadioItem disabled value={"LinkedIn"}>{dict.dashboard.upcoming.t.rowActions.linkedIn}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem disabled value={"Instagram"}>{dict.dashboard.upcoming.t.rowActions.instagram}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem disabled value={"Twitter"}>{dict.dashboard.upcoming.t.rowActions.twitter}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem disabled value={"Email"}>{dict.dashboard.upcoming.t.rowActions.email}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          {dict.dashboard.upcoming.t.rowActions.delete}
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
