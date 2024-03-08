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
      <><div className="md:hidden">
      <Image
        src="/examples/tasks-light.png"
        width={1280}
        height={998}
        alt="Playground"
        className="block dark:hidden" />
      <Image
        src="/examples/tasks-dark.png"
        width={1280}
        height={998}
        alt="Playground"
        className="hidden dark:block" />
    </div><div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <DataTable data={jobs} params={{ lang: lang }} columns={columns(dict)} />
      </div></>
  )
}

