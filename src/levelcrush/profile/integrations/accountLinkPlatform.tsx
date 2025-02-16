"use client";

import { Badge, Button } from "@medusajs/ui";
import Trash from "@modules/common/icons/trash";
import { Check, XMark, Link } from "@medusajs/icons";
import { MetadataType, StoreCustomer } from "@medusajs/types";
import { Suspense, useContext, useState } from "react";
import { updateCustomer } from "@lib/data/customer";
import { AccountProviderContext } from "@levelcrush/providers/account_provider";
import useDeepCompareEffect, { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import {
  Platform,
  platformStart,
  platformUnlink,
} from "@levelcrush/sdk/platforms";

interface BungieValidationResult {
  membershipId: string;
  membershipType: number;
  displayName: string;
  inNetworkClan: boolean;
}

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
export type AccountLinkPlatforMetaValueType = "string" | "boolean";

interface AccountLinkPlatformProps {
  title: string;
  platform: Platform;
  badges: {
    name: string;
    metakeyResult: string;
    tooltip_valid?: string;
    tooltip_invalid?: string;
  }[];
  metakeyDisplayName: string;
  metakeyAccountID: string;
}

export function AccountLinkPlatform(props: AccountLinkPlatformProps) {
  const { account, accountFetch } = useContext(AccountProviderContext);

  const [metadata, setMetadata] = useState(account?.metadata || {});
  const [accountId, setAccountId] = useState(
    (metadata[props.metakeyAccountID] as string) || ""
  );

  const [displayName, setDisplayName] = useState(
    (metadata[props.metakeyDisplayName] as string) || "NOT LINKED"
  );

  const router = useRouter();

  useDeepCompareEffectNoCheck(() => {
    const meta = metadata || {};
    setAccountId((meta[props.metakeyAccountID] as string) || "");
    setDisplayName(
      (meta[props.metakeyDisplayName] as string) || "NOT LINKED"
    );
  }, [metadata]);

  useDeepCompareEffectNoCheck(() => {
    if (!account) {
      setMetadata({});
    } else {
      setMetadata(account.metadata || {});
    }
  }, [account]);

  if (!account) {
    return <></>;
  }

  function badgeResultValid(input: unknown) {
    const metavalue = input || "";
    switch (typeof metavalue) {
      case "string":
        return `${metavalue}`.length > 0;
      case "boolean":
        return metavalue;
      case "number":
        return `${metavalue}`;
      default:
        console.log("Unknown meta value type", metavalue);
        return false;
    }
  }

  return (
    <div
      className="w-full md:max-w-[49%] p-2
       border-gray-400 border-solid border"
    >
      <h3 className="flex flex-nowrap w-full gap-2">
        <span className="w-full">{props.title}</span>
        {props.badges.map((badge, index) => (
          <Badge
            title={
              badgeResultValid(metadata[badge.metakeyResult])
                ? badge.tooltip_valid || ""
                : badge.tooltip_invalid || ""
            }
            className="w-auto basis-auto text-center"
            color={
              badgeResultValid(metadata[badge.metakeyResult]) ? "green" : "grey"
            }
            key={`${index}-platform-link-${props.title}`}
          >
            {badgeResultValid(metadata[badge.metakeyResult]) ? (
              <Check />
            ) : (
              <XMark />
            )}
            {badge.name}
          </Badge>
        ))}
      </h3>
      <p className="my-4">{displayName}</p>
      <Button
        className="w-full md:w-auto md:min-w-40 text-center"
        variant={accountId.length > 0 ? "danger" : "primary"}
        disabled={props.platform === "discord"}
        onClick={
          props.platform === "discord"
            ? undefined
            : (ev) => {
                if (accountId && accountId.length > 0) {
                  platformUnlink(props.platform, account, router);
                } else {
                  platformStart(props.platform, router);
                }
              }
        }
      >
        {accountId.length > 0 ? (
          <>
            <Trash />
            Unlink
          </>
        ) : (
          <>
            <Link />
            Link
          </>
        )}
      </Button>
    </div>
  );
}

export default AccountLinkPlatform;
