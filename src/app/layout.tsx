import { getBaseURL } from "@lib/util/env"
import ProgressBarProvider from "components/providers/ProgressBar"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="dark" className="dark">
      <body>
        <ProgressBarProvider></ProgressBarProvider>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
