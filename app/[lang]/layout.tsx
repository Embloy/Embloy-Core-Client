import { Lexend } from "next/font/google"
import localFont from "next/font/local"
import { i18n, type Locale } from "../../i18n-config";
import "@/styles/globals.css"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import Head from "next/head"

const fontSans = Lexend({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "HR",
    "Genius",
    "Integrations",
    "Lightweight",
    "Embloy",
    "Embloy Platforms",
  ],
  authors: [
    {
      name: "embloy",
      url: "https://embloy.com",
    },
  ],
  creator: "embloy",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "black" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://embloy.com/opengraph-image.jpg?5669f67eac8f9423",
        width: 1200,
        height: 630,
        alt: "Embloy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Embloy",
    description: "Solutions that brain-boost HR.",
    images: ["https://embloy.com/opengraph-image.jpg?5669f67eac8f9423"],
    creator: "@embloy",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({ children, params }: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <Head>
        <title>Embloy</title>
        <meta name="description" content="Solutions that brain-boost HR." />

        <meta property="og:url" content="https://embloy.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Embloy" />
        <meta property="og:description" content="Solutions that brain-boost HR." />
        <meta property="og:image" content="https://embloy.com/opengraph-image.jpg?5669f67eac8f9423" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="embloy.com" />
        <meta property="twitter:url" content="https://embloy.com" />
        <meta name="twitter:title" content="Embloy" />
        <meta name="twitter:description" content="Solutions that brain-boost HR." />
        <meta name="twitter:image" content="https://embloy.com/opengraph-image.jpg?5669f67eac8f9423" />
      </Head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
          <Toaster />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
