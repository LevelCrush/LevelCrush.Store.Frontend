import OffCanvas from "@levelcrush/offcanvas";
import { getBaseURL } from "@lib/util/env";
import ProgressBarProvider from "@levelcrush/providers/progressBar";
import { Metadata } from "next";
import "styles/globals.css";
import SiteHeader from "@levelcrush/site_header";
import { H2 } from "@levelcrush/elements/headings";
import DiscordLink from "@levelcrush/discord_link";
import AccountProvider, {
  AccountProviderContext,
} from "@levelcrush/providers/account_provider";
import { Suspense } from "react";
import CartProvider from "@levelcrush/providers/cart_provider";
import cms from "@levelcrush/cms";
import { RouteItem } from "@levelcrush/config/routes";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";


export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const menu = await cms.menu("Site.Menu");

  const routes = [] as RouteItem[];
  if (menu) {
    for (const link of menu.links) {
      routes.push({
        url: link.url,
        name: link.title,
        loginOnly: link.loginOnly,
        children: [],
      });
    }

    for (const submenu of menu.submenus) {
      routes.push({
        url: submenu.url,
        name: submenu.title,
        loginOnly: submenu.loginOnly,
        children: submenu.links.map((sublink) => ({
          url: sublink.url,
          name: sublink.title,
          loginOnly: sublink.loginOnly,
          children: [],
        })),
      });
    }
  }

  if (process.env.FORCE_CONSTRUCTION === "true" || false) {
    return (
      <html lang="en" data-mode="dark" className="dark">
        <GoogleAnalytics gaId={process.env["NEXT_PUBLIC_GTAG"] || ""} />
        <body>
          <Suspense>
            <AccountProvider>
              <OffCanvas>
                <SiteHeader />
                <ProgressBarProvider></ProgressBarProvider>
                <main className="relative min-h-full flex justify-center items-center">
                  <div className="w-full max-w-[50rem] p-4 bg-[rgba(0,0,0,.85)] flex justify-center flex-col items-center">
                    <H2 className="w-full text-center">We just game.</H2>
                    <DiscordLink />
                  </div>
                </main>
              </OffCanvas>
            </AccountProvider>
          </Suspense>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="en" data-mode="dark" className="dark">
        <body>
          <Suspense>
            <AccountProvider>
              <CartProvider>
                <OffCanvas routes={routes}>
                  <SiteHeader />
                  <ProgressBarProvider></ProgressBarProvider>
                  <main className="relative">{props.children}</main>
                </OffCanvas>
              </CartProvider>
            </AccountProvider>
          </Suspense>
        </body>
      </html>
    );
  }
}
