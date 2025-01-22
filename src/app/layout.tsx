import OffCanvas from "@levelcrush/offcanvas";
import { getBaseURL } from "@lib/util/env";
import ProgressBarProvider from "@levelcrush/providers/progressBar";
import { Metadata } from "next";
import "styles/globals.css";
import SiteHeader from "@levelcrush/site_header";
import { H2 } from "@levelcrush/elements/headings";
import DiscordLink from "@levelcrush/discord_link";
import AccountProvider, { AccountProviderContext } from "@levelcrush/account/account_provider";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
};

export default function RootLayout(props: { children: React.ReactNode }) {



  if (process.env.FORCE_CONSTRUCTION === "true" || false) {
    return (
      <html lang="en" data-mode="dark" className="dark">
        <body>
          <AccountProvider>
            <OffCanvas>
              <SiteHeader />
              <Suspense><ProgressBarProvider></ProgressBarProvider></Suspense>
              <main className="relative min-h-full flex justify-center items-center">
                <div className="w-full max-w-[50rem] p-4 bg-[rgba(0,0,0,.85)] flex justify-center flex-col items-center">
                  <H2 className="w-full text-center">We just game.</H2>
                  <DiscordLink />
                </div>
              </main>
            </OffCanvas>
          </AccountProvider>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="en" data-mode="dark" className="dark">
        <body>
          <AccountProvider>
            <OffCanvas>
              <SiteHeader />
              <Suspense><ProgressBarProvider></ProgressBarProvider></Suspense>
              <main className="relative">{props.children}</main>
            </OffCanvas>
          </AccountProvider>
        </body>
      </html>
    );
  }
}
