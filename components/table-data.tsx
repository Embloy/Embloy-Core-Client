import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
  } from "@radix-ui/react-icons"
  
  export const statuses = [
    {
      value: "archived",
      label: "Archived",
      icon: QuestionMarkCircledIcon,
    },
    {
      value: "listed",
      label: "Listed",
      icon: CircleIcon,
    },
    {
      value: "unlisted",
      label: "Unlisted",
      icon: StopwatchIcon,
    },
  ]
  
  export const employerRatings = [
    {
      label: "1",
      value: "1",
      icon: CircleIcon,
    },
    {
      label: "2",
      value: "2",
      icon: CircleIcon,
    },
    {
      label: "3",
      value: "3",
      icon: CircleIcon,
    },
    {
      label: "4",
      value: "4",
      icon: CircleIcon,
    },
    {
      label: "5",
      value: "5",
      icon: CircleIcon,
    },
  ]

  export const jobTypes = [
    {
      label: "Retail",
      value: "Retail",
      icon: ArrowDownIcon,
    },
    {
      label: "Marketing",
      value: "Marketing",
      icon: ArrowRightIcon,
    },
    {
      label: "Finance",
      value: "Finance",
      icon: ArrowUpIcon,
    },
  ]
  