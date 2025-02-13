"use client";

import Container from "@levelcrush/elements/container";
import { H2 } from "@levelcrush/elements/headings";
import { getCacheTag, setAuthToken } from "@lib/data/cookies";
import { revalidateTag } from "next/cache";
import { redirect, useRouter } from "next/navigation";
import { useActionState, useContext, useEffect, useState } from "react";
import { decodeToken } from "react-jwt";

import { useCookies } from "next-client-cookies";
import { updateCustomer } from "@lib/data/customer";
import Hyperlink from "@levelcrush/elements/hyperlink";
import { AccountProviderContext } from "@levelcrush/providers/account_provider";
import AccountButton from "./account_button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DiscordValidationResult {
  discordHandle: string;
  discordId: string;
  inServer: boolean;
  email: string;
  isAdmin: boolean;
  isModerator: boolean;
  nicknames: string[];
  globalName: string;
  isBooster: boolean;
  isRetired: boolean;
  userRedirect: string;
}

export default function LoginHelper() {
  const cookies = useCookies();
  const [loading, setLoading] = useState(false);
  const { account, accountFetch } = useContext(AccountProviderContext);
  const [loginError, setLoginError] = useState("");

  const router = useRouter();

  async function createCustomer(
    token: string,
    email: string,
    metadata: Record<string, any>
  ) {
    try {
      await fetch(
        `${
          process.env["NEXT_PUBLIC_MEDUSA_BACKEND_URL"] || ""
        }/store/customers`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
          },

          body: JSON.stringify({
            email: email,
            company_name: "",
            first_name: metadata["discord.globalName"],
            last_name: "",
            phone: "",
            metadata: metadata,
          }),
        }
      );
    } catch (err) {
      console.log("Could not complete create");
    }
  }

  async function refreshToken(token: string) {
    const result = await fetch(
      `${
        process.env["NEXT_PUBLIC_MEDUSA_BACKEND_URL"] || ""
      }/auth/token/refresh`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());

    return result.token as string;
  }

  function forceRedirect(
    router: AppRouterInstance | undefined,
    redirectUrl: string,
    redirectType: "didLogin" = "didLogin"
  ) {
    const windowUrl = new URL(redirectUrl);
    const amount = windowUrl.searchParams.has(redirectType)
      ? parseInt(windowUrl.searchParams.get(redirectType) || "0") || 0
      : 0;
    windowUrl.searchParams.append(redirectType, (amount + 1).toString());
    if (!router) {
      setTimeout(() => (window.location.href = windowUrl.toString()), 250);
    } else {
      router.push(windowUrl.toString());
    }
  }

  async function doCallback() {
    setLoading(true);

    const windowParams = new URLSearchParams(window.location.search);
    const queryParams = Object.fromEntries(windowParams.entries());

    try {
      var cbUrl = `${
        process.env["NEXT_PUBLIC_MEDUSA_BACKEND_URL"] || ""
      }/auth/customer/levelcrush-auth/callback?token=${encodeURIComponent(
        (queryParams.token as string) || ""
      )}`;
      const res = await fetch(cbUrl, {
        method: "POST",
        credentials: "include",
      });

      var sessReq = await fetch(
        `${
          process.env["NEXT_PUBLIC_LEVELCRUSH_AUTH_SERVER"] || ""
        }/platform/discord/session`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      let token = data.token;
      const sessionJson = (await sessReq.json()) as DiscordValidationResult;
      const shouldCreateCustomer =
        (decodeToken(token) as { actor_id: string }).actor_id === "";

      console.log("Are you a new customer?", shouldCreateCustomer);

      // set token before other calls
      cookies.set("_medusa_jwt", token, {
        expires: 60 * 60 * 24 * 7,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      window.localStorage.setItem("medusa_jwt", token);

      const metadata = {
        "discord.id": sessionJson.discordId,
        "discord.handle": sessionJson.discordHandle,
        "discord.globalName": sessionJson.globalName,
        "discord.server_member": sessionJson.inServer,
        "discord.nicknames": sessionJson.nicknames,
        "discord.admin": sessionJson.isAdmin,
        "discord.moderator": sessionJson.isModerator,
        "discord.booster": sessionJson.isBooster,
        "discord.retired": sessionJson.isRetired,
        "discord.email": sessionJson.email,
      };

      if (shouldCreateCustomer) {
        console.log("Attempting to create your customer record");
        await createCustomer(token, sessionJson.email, metadata);

        console.log("Attempting to refresh your token");
        console.log("Starting with", token);
        token = await refreshToken(token);

        // update token again
        cookies.set("_medusa_jwt", token, {
          expires: 60 * 60 * 24 * 7,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });

        window.localStorage.setItem("medusa_jwt", token);
      } else {
        console.log("Attempting to update your customer record");
        await updateCustomer({
          first_name: metadata["discord.globalName"],
          last_name: account && account.last_name ? account.last_name : "",
          phone: account && account.phone ? account.phone : "",
          company_name:
            account && account.company_name ? account.company_name : "",
          metadata: metadata,
        });

        console.log("Done updating customer record");
      }

      const userRedirect = sessionJson.userRedirect || "";

      //const form = new FormData();
      //form.append("token", token);
      //form.append("validation", JSON.stringify(sessionJson));

      if (userRedirect) {
        //router.push(userRedirect);
        forceRedirect(router, userRedirect);
      } else {
        //router.push("/");
        forceRedirect(router, "/");
      }
      //window.location.href = "/";
    } catch (err) {
      setLoginError(`${err}`);
      console.log("REQ ERROR", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!loading) {
      doCallback();
    }
  }, []);

  return (
    <Container className="top-[4.5rem]">
      <H2 className="text-center">
        Fancy seeing you here. You'll be moved along eventually.
      </H2>
      <p className="text-center">
        Otherwise click{" "}
        <Hyperlink className="underline" href="/">
          here
        </Hyperlink>{" "}
        if you are here for way to long.
      </p>
      {loginError.length > 0 ? (
        <div>
          <p className="text-red">{loginError}</p>
          <p>
            Try logging in again. If you fail to login after another try. Send
            this to Primal.
          </p>
          <AccountButton />
        </div>
      ) : (
        <></>
      )}
    </Container>
  );
}
