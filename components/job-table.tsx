import { getDictionary } from "@/app/[lang]/dictionaries"
import Image from "next/image"
import React, { useEffect } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export function JobTable({jobs, params: {lang}}) {
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);
  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();
  }, [lang, dict]);
  
  return dict && (
    <><div className="overflow-x-auto md:hidden">
    <DataTable data={jobs} params={{ lang: lang }} columns={columns(dict)} />
  </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <DataTable data={jobs} params={{ lang: lang }} columns={columns(dict)} />
      </div></>
  )
}

