import {
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    CircleBackslashIcon,
  } from "@radix-ui/react-icons"
  
  export const statuses = [
    {
      value: "archived",
      label: "Archived",
      icon: CircleBackslashIcon,
    },
    {
      value: "listed",
      label: "Listed",
      icon: CheckCircledIcon,
    },
    {
      value: "unlisted",
      label: "Unlisted",
      icon: CrossCircledIcon,
    },
  ]
  
  export const employerRatings = [
    {
      value: "1",
      label: "1",
      icon: CircleIcon,
    },
    {
      value: "2",
      label: "2",
      icon: CircleIcon,
    },
    {
      value: "3",
      label: "3",
      icon: CircleIcon,
    },
    {
      value: "4",
      label: "4",
      icon: CircleIcon,
    },
    {
      value: "5",
      label: "5",
      icon: CircleIcon,
    },
  ]

  export const jobTypes = [
    { value: "Retail", label: "Retail" },
    { value: "Food", label: "Food" },
    { value: "Hospitality", label: "Hospitality" },
    { value: "Tourism", label: "Tourism" },
    { value: "Events", label: "Events" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Cleaning", label: "Cleaning" },
    { value: "Landscaping", label: "Landscaping" },
    { value: "Personal_Care", label: "Personal Care" },
    { value: "Childcare", label: "Childcare" },
    { value: "Delivery", label: "Delivery" },
    { value: "Logistics", label: "Logistics" },
    { value: "Transportation", label: "Transportation" },
    { value: "Staffing", label: "Staffing" },
    { value: "Warehousing", label: "Warehousing" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Customer_Service", label: "Customer Service" },
    { value: "Call_Centers", label: "Call Centers" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Freelance", label: "Freelance" },
    { value: "Construction", label: "Construction" },
    { value: "Real_Estate", label: "Real Estate" },
    { value: "Fitness", label: "Fitness" },
    { value: "Security", label: "Security" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
    { value: "Administration", label: "Administration" },
    { value: "IT", label: "IT" },
    { value: "Education", label: "Education" },
  ];


  export const jobTypeColorClasses = {
    "Retail": "cursor-text px-4 py-1 bg-gray-100 dark:bg-gray-950 rounded-full border border-gray-600 dark:border-gray-500 font-normal text-gray-600 dark:text-gray-500 text-xs",
    "Food": "cursor-text px-4 py-1 bg-yellow-100 dark:bg-yellow-950 rounded-full border border-yellow-600 dark:border-yellow-500 font-normal text-yellow-600 dark:text-yellow-500 text-xs",
    "Hospitality": "cursor-text px-4 py-1 bg-blue-100 dark:bg-blue-950 rounded-full border border-blue-600 dark:border-blue-500 font-normal text-blue-600 dark:text-blue-500 text-xs",
    "Tourism": "cursor-text px-4 py-1 bg-green-100 dark:bg-green-950 rounded-full border border-green-600 dark:border-green-500 font-normal text-green-600 dark:text-green-500 text-xs",
    "Events": "cursor-text px-4 py-1 bg-red-100 dark:bg-red-950 rounded-full border border-red-600 dark:border-red-500 font-normal text-red-600 dark:text-red-500 text-xs",
    "Entertainment": "cursor-text px-4 py-1 bg-purple-100 dark:bg-purple-950 rounded-full border border-purple-600 dark:border-purple-500 font-normal text-purple-600 dark:text-purple-500 text-xs",
    "Cleaning": "cursor-text px-4 py-1 bg-orange-100 dark:bg-orange-950 rounded-full border border-orange-600 dark:border-orange-500 font-normal text-orange-600 dark:text-orange-500 text-xs",
    "Landscaping": "cursor-text px-4 py-1 bg-teal-100 dark:bg-teal-950 rounded-full border border-teal-600 dark:border-teal-500 font-normal text-teal-600 dark:text-teal-500 text-xs",
    "Personal_Care": "cursor-text px-4 py-1 bg-pink-100 dark:bg-pink-950 rounded-full border border-pink-600 dark:border-pink-500 font-normal text-pink-600 dark:text-pink-500 text-xs",
    "Childcare": "cursor-text px-4 py-1 bg-indigo-100 dark:bg-indigo-950 rounded-full border border-indigo-600 dark:border-indigo-500 font-normal text-indigo-600 dark:text-indigo-500 text-xs",
    "Delivery": "cursor-text px-4 py-1 bg-yellow-100 dark:bg-yellow-950 rounded-full border border-yellow-600 dark:border-yellow-500 font-normal text-yellow-600 dark:text-yellow-500 text-xs",
    "Logistics": "cursor-text px-4 py-1 bg-blue-100 dark:bg-blue-950 rounded-full border border-blue-600 dark:border-blue-500 font-normal text-blue-600 dark:text-blue-500 text-xs",
    "Transportation": "cursor-text px-4 py-1 bg-green-100 dark:bg-green-950 rounded-full border border-green-600 dark:border-green-500 font-normal text-green-600 dark:text-green-500 text-xs",
    "Staffing": "cursor-text px-4 py-1 bg-red-100 dark:bg-red-950 rounded-full border border-red-600 dark:border-red-500 font-normal text-red-600 dark:text-red-500 text-xs",
    "Warehousing": "cursor-text px-4 py-1 bg-purple-100 dark:bg-purple-950 rounded-full border border-purple-600 dark:border-purple-500 font-normal text-purple-600 dark:text-purple-500 text-xs",
    "Manufacturing": "cursor-text px-4 py-1 bg-orange-100 dark:bg-orange-950 rounded-full border border-orange-600 dark:border-orange-500 font-normal text-orange-600 dark:text-orange-500 text-xs",
    "Customer_Service": "cursor-text px-4 py-1 bg-teal-100 dark:bg-teal-950 rounded-full border border-teal-600 dark:border-teal-500 font-normal text-teal-600 dark:text-teal-500 text-xs",
    "Call_Centers": "cursor-text px-4 py-1 bg-pink-100 dark:bg-pink-950 rounded-full border border-pink-600 dark:border-pink-500 font-normal text-pink-600 dark:text-pink-500 text-xs",
    "Healthcare": "cursor-text px-4 py-1 bg-indigo-100 dark:bg-indigo-950 rounded-full border border-indigo-600 dark:border-indigo-500 font-normal text-indigo-600 dark:text-indigo-500 text-xs",
    "Freelance": "cursor-text px-4 py-1 bg-yellow-100 dark:bg-yellow-950 rounded-full border border-yellow-600 dark:border-yellow-500 font-normal text-yellow-600 dark:text-yellow-500 text-xs",
    "Construction": "cursor-text px-4 py-1 bg-blue-100 dark:bg-blue-950 rounded-full border border-blue-600 dark:border-blue-500 font-normal text-blue-600 dark:text-blue-500 text-xs",
    "Real_Estate": "cursor-text px-4 py-1 bg-green-100 dark:bg-green-950 rounded-full border border-green-600 dark:border-green-500 font-normal text-green-600 dark:text-green-500 text-xs",
    "Fitness": "cursor-text px-4 py-1 bg-red-100 dark:bg-red-950 rounded-full border border-red-600 dark:border-red-500 font-normal text-red-600 dark:text-red-500 text-xs",
    "Security": "cursor-text px-4 py-1 bg-indigo-100 dark:bg-indigo-950 rounded-full border border-indigo-600 dark:border-indigo-500 font-normal text-indigo-600 dark:text-indigo-500 text-xs",
    "Marketing": "cursor-text px-4 py-1 bg-orange-100 dark:bg-orange-950 rounded-full border border-orange-600 dark:border-orange-500 font-normal text-orange-600 dark:text-orange-500 text-xs",
    "Sales": "cursor-text px-4 py-1 bg-purple-100 dark:bg-purple-950 rounded-full border border-purple-600 dark:border-purple-500 font-normal text-purple-600 dark:text-purple-500 text-xs",
    "Administration": "cursor-text px-4 py-1 bg-yellow-100 dark:bg-yellow-950 rounded-full border border-yellow-600 dark:border-yellow-500 font-normal text-yellow-600 dark:text-yellow-500 text-xs",
    "IT": "cursor-text px-4 py-1 bg-blue-100 dark:bg-blue-950 rounded-full border border-blue-600 dark:border-blue-500 font-normal text-blue-600 dark:text-blue-500 text-xs",
    "Education": "cursor-text px-4 py-1 bg-green-100 dark:bg-green-950 rounded-full border border-green-600 dark:border-green-500 font-normal text-green-600 dark:text-green-500 text-xs",
  };