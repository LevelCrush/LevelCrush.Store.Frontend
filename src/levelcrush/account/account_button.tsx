"use client";

import React, { useActionState, useContext, useEffect, useState } from "react";
import Button from "@levelcrush/elements/button";
import { AccountProviderContext } from "@levelcrush/providers/account_provider";
import { isObject } from "@lib/util/isEmpty";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { login, updateCustomer } from "@lib/data/customer";
import { getCacheTag, setAuthToken } from "@lib/data/cookies";
import { revalidateTag } from "next/cache";

interface DiscordValidationResult {
  discordHandle: string;
  discordId: string;
  inServer: boolean;
  email: string;
  isAdmin: boolean;
  isModerator: boolean;
  nicknames: string[];
  globalName: string;
}

export default function AccountButton(props: { type?: "discord" | "normal" }) {
  const { account, accountFetch } = useContext(AccountProviderContext);
  const [isLoggingIn, setIsLoggingIn]  = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const loginType = props.type || "normal";

  let nicknames =
    account && account.metadata
      ? (account.metadata["discord.nicknames"] as string[] | string)
      : [];
  if (typeof nicknames === "string") {
    nicknames = (nicknames as string).split(",");
  }

  let displayName = "Idk";
  if (
    account &&
    account.metadata &&
    nicknames.length > 0 &&
    nicknames[0].trim().length > 0
  ) {
    displayName = nicknames[0].trim();
  } else if (account) {
    displayName = account.first_name || "Oops";
  }

  async function doLogin() {

    if(isLoggingIn) {
      return;
    }


    const returnToUrl = searchParams.has("returnTo")
      ? searchParams.get("returnTo") || window.location.href
      : window.location.href;

    if (loginType === "discord") {
      setIsLoggingIn(true);
      
      const customerLoginUrl = `${
        process.env["NEXT_PUBLIC_MEDUSA_BACKEND_URL"] || ""
      }/auth/customers/levelcrush-auth?redirect=${encodeURIComponent(
        returnToUrl
      )}`;

      const result = await fetch(customerLoginUrl, {
        credentials: "include",
        method: "POST",
        cache: "no-store",
      });

      try {
        const json = await result.json();
        if (json.location) {
        
          router.push(json.location);
          return;
        }

        if (!json.token) {
          alert("Authentication failed");
          return;
        }
      } catch (err) {
        console.log("Err", err);
      }
    } else {
      if (window.location.href.includes("/account?")) {
        router.push("/account"); // just push back to normal account, no redirect
      } else {
        router.push(`/account?returnTo=${encodeURIComponent(returnToUrl)}`);
      }
    }
  }

  async function sendToProfile() {
    //redirect("/account");
    router.push("/account");
  }

  const isLoggedIn = isObject(account);

  if (isLoggedIn) {
    return (
      <Button intention="normal" onClick={sendToProfile}>
        {displayName}
      </Button>
    );
  } else {
    return (
      <Button disabled={isLoggingIn} intention={isLoggingIn ? "inactive" : "normal"} onClick={doLogin}>
        {props.type == "discord" ? "Login With Discord" : "Login"}
      </Button>
    );
  }
}
