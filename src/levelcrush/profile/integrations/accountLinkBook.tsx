"use client";

import { retrieveCustomer } from "@lib/data/customer";
import AccountLinkPlatform from "@levelcrush/profile/integrations/accountLinkPlatform";
import { notFound } from "next/navigation";
import { useContext } from "react";
import { AccountProviderContext } from "@levelcrush/providers/account_provider";

export function AccountLinkPlatformDiscord() {
  return (
    <AccountLinkPlatform
      title="Discord"
      metakeyDisplayName="discord.handle"
      metakeyAccountID="discord.id"
      platform="discord"
      badges={[
        {
          name: "Validated",
          metakeyResult: "discord.id",
          tooltip_valid: "Your account has been validated",
          tooltip_invalid: "Link your account to validate",
        },
        {
          name: "Member",
          metakeyResult: "discord.server_member",
          tooltip_valid: "Your in the Level Crush Discord",
          tooltip_invalid: "You are not in the Level Crush Discord",
        },
      ]}
    />
  );
}

export function AccountLinkPlatformBungie() {
  return (
    <AccountLinkPlatform
      title="Bungie"
      metakeyDisplayName="bungie.handle"
      metakeyAccountID="bungie.id"
      platform="bungie"
      badges={[
        {
          name: "Validated",
          metakeyResult: "bungie.id",
          tooltip_valid: "Your Bungie account has been validated",
          tooltip_invalid: "Link your bungie account to validate",
        },
        {
          name: "Clan",
          metakeyResult: "bungie.clan_member",
          tooltip_valid: "Your in an affiliated clan",
          tooltip_invalid: "You are not in an affiliated clan",
        },
      ]}
    />
  );
}

export function AccountLinkBook() {
  const { account } = useContext(AccountProviderContext);

  if (!account) {
    return <></>;
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-wrap gap-2">
        <AccountLinkPlatformDiscord />
        <AccountLinkPlatformBungie />
      </div>
    </div>
  );
}

export default AccountLinkBook;
