"use client";

import React, { useActionState, useContext, useEffect, useState } from "react";
import Button from "@levelcrush/elements/button";
import { AccountProviderContext } from "@levelcrush/providers/account_provider";
import { isObject } from "@lib/util/isEmpty";
import { redirect } from "next/navigation";
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

export default function AccountButton() {
  const { account, accountFetch } = useContext(AccountProviderContext);   

  let nicknames = account && account.metadata ? account.metadata["discord.nicknames"] as string[]|string : [];
  if(typeof nicknames === "string") {
    nicknames = (nicknames as string).split(",");
  } 


  const displayName =
    account && account.metadata
      ? nicknames[0]
      : "Oops";

  async function doLogin() {
    const customerLoginUrl = `${
      process.env["NEXT_PUBLIC_MEDUSA_BACKEND_URL"] || ""
    }/auth/customers/levelcrush-auth`;

    const result = await fetch(customerLoginUrl, {
      credentials: "include",
      method: "POST",
      cache: "no-store",
    });

    try {
      const json = await result.json();
      if (json.location) {
        window.location.href = json.location;
        return;
      }

      if (!json.token) {
        alert("Authenticatin failed");
        return;
      }
    } catch (err) {
      console.log("Err", err);
    }
  }

  async function sendToProfile() {
    redirect("/account");
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
      <Button intention="normal" onClick={doLogin}>
        Login With Discord
      </Button>
    );
  }
}
