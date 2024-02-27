import { resourcesConfig } from "@/config/resources"
import { ResourcesSidebarNav } from "@/components/sidebar-nav"
import { Locale } from "@/i18n-config"

interface ResourcesLayoutProps {
  children: React.ReactNode
  params: {
    lang: Locale
  }
}

export default function ResourcesLayout({ children, params: { lang } }: ResourcesLayoutProps) {
  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-10">
        <ResourcesSidebarNav items={resourcesConfig.sidebarNav} params={{lang: lang}} />
      </aside>
      {children}
    </div>
  )
}