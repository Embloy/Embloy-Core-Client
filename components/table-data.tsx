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
    "Food": "cursor-text px-4 py-1 bg-emerald-100 dark:bg-emerald-950 rounded-full border border-emerald-600 dark:border-emerald-500 font-normal text-emerald-600 dark:text-emerald-500 text-xs",
    "Hospitality": "cursor-text px-4 py-1 bg-fuchsia-100 dark:bg-fuchsia-950 rounded-full border border-fuchsia-600 dark:border-fuchsia-500 font-normal text-fuchsia-600 dark:text-fuchsia-500 text-xs",
    "Tourism": "cursor-text px-4 py-1 bg-sky-100 dark:bg-sky-950 rounded-full border border-sky-600 dark:border-sky-500 font-normal text-sky-600 dark:text-sky-500 text-xs",
    "Events": "cursor-text px-4 py-1 bg-[#fee2e5] dark:bg-[#450a11] rounded-full border border-[#dc263b] dark:border-[#ef4458] font-normal text-[#dc263b] dark:text-[#ef4458] text-xs",
    "Entertainment": "cursor-text px-4 py-1 bg-violet-100 dark:bg-violet-950 rounded-full border border-violet-600 dark:border-violet-500 font-normal text-violet-600 dark:text-violet-500 text-xs",
    "Landscaping": "cursor-text px-4 py-1 bg-[#eff3d4] dark:bg-[#1f270c] rounded-full border border-[#718828] dark:border-[#92ab37] font-normal text-[#718828] dark:text-[#92ab37] text-xs",
    "Cleaning": "cursor-text px-4 py-1 bg-[#ffe4e1] dark:bg-[#470e08] rounded-full border border-[#e23320] dark:border-[#f66151] font-normal text-[#e23320] dark:text-[#f66151] text-xs",
    "Personal_Care": "cursor-text px-4 py-1 bg-[#fee5f5] dark:bg-[#58002a] rounded-full border border-[#f0128a] dark:border-[#ff4db6] font-normal text-[#f0128a] dark:text-[#ff4db6] text-xs",
    "Childcare": "cursor-text px-4 py-1 bg-indigo-100 dark:bg-indigo-950 rounded-full border border-indigo-600 dark:border-indigo-500 font-normal text-indigo-600 dark:text-indigo-500 text-xs",
    "Delivery": "cursor-text px-4 py-1 bg-lime-100 dark:bg-lime-950 rounded-full border border-lime-600 dark:border-lime-500 font-normal text-lime-600 dark:text-lime-500 text-xs",
    "Logistics": "cursor-text px-4 py-1 bg-rose-100 dark:bg-rose-950 rounded-full border border-rose-600 dark:border-rose-500 font-normal text-rose-600 dark:text-rose-500 text-xs",
    "Transportation": "cursor-text px-4 py-1 bg-amber-100 dark:bg-amber-950 rounded-full border border-amber-600 dark:border-amber-500 font-normal text-amber-600 dark:text-amber-500 text-xs",
    "Staffing": "cursor-text px-4 py-1 bg-[#fee5e2] dark:bg-[#460f09] rounded-full border border-[#df3623] dark:border-[#f15442] font-normal text-[#df3623] dark:text-[#f15442] text-xs",
    "Warehousing": "cursor-text px-4 py-1 bg-purple-100 dark:bg-purple-950 rounded-full border border-purple-600 dark:border-purple-500 font-normal text-purple-600 dark:text-purple-500 text-xs",
    "Manufacturing": "cursor-text px-4 py-1 bg-[#dbfde7] dark:bg-[#042f16] rounded-full border border-[#14a548] dark:border-[#1fc85c] font-normal text-[#14a548] dark:text-[#1fc85c] text-xs",
    "Customer_Service": "cursor-text px-4 py-1 bg-teal-100 dark:bg-teal-950 rounded-full border border-teal-600 dark:border-teal-500 font-normal text-teal-600 dark:text-teal-500 text-xs",
    "Call_Centers": "cursor-text px-4 py-1 bg-pink-100 dark:bg-pink-950 rounded-full border border-pink-600 dark:border-pink-500 font-normal text-pink-600 dark:text-pink-500 text-xs",
    "Healthcare": "cursor-text px-4 py-1 bg-cyan-100 dark:bg-cyan-950 rounded-full border border-cyan-600 dark:border-cyan-500 font-normal text-cyan-600 dark:text-cyan-500 text-xs",
    "Freelance": "cursor-text px-4 py-1 bg-yellow-100 dark:bg-yellow-950 rounded-full border border-yellow-600 dark:border-yellow-500 font-normal text-yellow-600 dark:text-yellow-500 text-xs",
    "Construction": "cursor-text px-4 py-1 bg-blue-100 dark:bg-blue-950 rounded-full border border-blue-600 dark:border-blue-500 font-normal text-blue-600 dark:text-blue-500 text-xs",
    "Real_Estate": "cursor-text px-4 py-1 bg-green-100 dark:bg-green-950 rounded-full border border-green-600 dark:border-green-500 font-normal text-green-600 dark:text-green-500 text-xs",
    "Fitness": "cursor-text px-4 py-1 bg-red-100 dark:bg-red-950 rounded-full border border-red-600 dark:border-red-500 font-normal text-red-600 dark:text-red-500 text-xs",
    "Security": "cursor-text px-4 py-1 bg-[#ffefd4] dark:bg-[#441606] rounded-full border border-[#ef6207] dark:border-[#fe7d11] font-normal text-[#ef6207] dark:text-[#fe7d11] text-xs",
    "Marketing": "cursor-text px-4 py-1 bg-orange-100 dark:bg-orange-950 rounded-full border border-orange-600 dark:border-orange-500 font-normal text-orange-600 dark:text-orange-500 text-xs",
    "IT": "cursor-text px-4 py-1 bg-[#eee5d7] dark:bg-[#321b16] rounded-full border border-[#9b6444] dark:border-[#b5835a] font-normal text-[#9b6444] dark:text-[#b5835a] text-xs",
    "Retail": "cursor-text px-4 py-1 bg-[#eaedfd] dark:bg-[#191970] rounded-full border border-[#4845e2] dark:border-[#666cec] font-normal text-[#4845e2] dark:text-[#666cec] text-xs",
    "Education": "cursor-text px-4 py-1 bg-[#cbffeb] dark:bg-[#00332b] rounded-full border border-[#00ad88] dark:border-[#00d4a4] font-normal text-[#00ad88] dark:text-[#00d4a4] text-xs",
    "Administration": "cursor-text px-4 py-1 bg-[#ffeed4] dark:bg-[#441506] rounded-full border border-[#ed5a09] dark:border-[#fc7513] font-normal text-[#ed5a09] dark:text-[#fc7513] text-xs",
    "Sales": "cursor-text px-4 py-1 bg-[#cdfffc] dark:bg-[#063b46] rounded-full border border-[#01aab9] dark:border-[#00d6dc] font-normal text-[#01aab9] dark:text-[#00d6dc] text-xs",
  };