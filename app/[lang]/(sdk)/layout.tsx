interface SdkLayoutProps {
  children: React.ReactNode
}

export default function SdkLayout({ children }: SdkLayoutProps) {
  return <div className="min-h-screen">{children}</div>
}
