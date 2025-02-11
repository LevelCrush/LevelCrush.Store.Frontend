"use client";

import { Badge, Button } from "@medusajs/ui";
import Trash from "@modules/common/icons/trash";
import { Check, XMark, Link } from "@medusajs/icons";
import { MetadataType, StoreCustomer } from "@medusajs/types";
import { useState } from "react";
import { updateCustomer } from "@lib/data/customer";

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
}

export type AccountLinkPlatforMetaValueType = "string" | "boolean";


interface AccountLinkPlatformProps {
  customer: StoreCustomer;
  title: string;
  platform: "discord" | "bungie";
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
  const metadata = props.customer.metadata || {};

  const [accountId, setAccountId] = useState(
    (metadata[props.metakeyAccountID] as string) || ""
  );
  
  const [displayName, setDisplayName] = useState(
    (metadata[props.metakeyDisplayName] as string) || "NOT LINKED"
  );

  async function checkPlatformSession() {
    const req = await fetch(
      `https://auth.levelcrush.com/platform/${encodeURIComponent(
        props.platform
      )}/session`,
      {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        credentials: "include",
      }
    );

    const data = await req.json();
    return data;
  }

  async function unlinkPlatform() { 
     const platformKeys = Object.keys(metadata).filter((v) => v.startsWith(props.platform));
     const newMetadata = {} as Record<string, unknown>;
     for(const key of platformKeys) { 
        newMetadata[key] = "";
     }
     
     await updateCustomer({
        metadata: newMetadata
     });

     window.location.reload();
  }

  function startLogin() {
    var childWindow = window.open(
      `https://auth.levelcrush.com/platform/${encodeURIComponent(
        props.platform
      )}/login`,
      "_blank"
    );
    if (childWindow) {
      var intervalHandle = setInterval(async () => {
        if (childWindow?.closed) {
          clearInterval(intervalHandle);
          const data = await checkPlatformSession();
         
          if(props.platform == "discord") { 
            const discordValidation = data as DiscordValidationResult;
            if(discordValidation.discordId && discordValidation.discordId.length > 0) { 

                const newMetadata = {} as Record<string, unknown>;
                newMetadata["discord.id"] = discordValidation.discordId || "";
                newMetadata["discord.handle"] = discordValidation.discordHandle || "";
                newMetadata["discord.server_member"] = discordValidation.inServer;

                await updateCustomer({
                    metadata: newMetadata
                });
            } 
          } else if(props.platform == "bungie") {
            const bungieValidation = data as BungieValidationResult;
            if(bungieValidation.membershipId && bungieValidation.membershipId.length > 0) { 

                const newMetadata = {} as Record<string, unknown>;
                newMetadata["bungie.id"] = bungieValidation.membershipId || "";
                newMetadata["bungie.handle"] = bungieValidation.displayName || "";
                newMetadata["bungie.platform"] = bungieValidation.membershipType || -1;
                newMetadata["bungie.clan_member"] = bungieValidation.inNetworkClan;
                await updateCustomer({
                    metadata: newMetadata
                });
            } 
          }
          window.location.reload();
        }
      }, 1000);
    }
  }

  function badgeResultValid(input: unknown) { 

    const metavalue = input || "";
    switch(typeof metavalue) {
        case "string":  
            return `${metavalue}`.length > 0;
        case "boolean":
            return metavalue;
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
            color={badgeResultValid(metadata[badge.metakeyResult])  ? "green" : "grey"}
            key={`${index}-platform-link-${props.title}`}
          >
            { badgeResultValid(metadata[badge.metakeyResult]) 
             ? <Check />
             : (
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
        onClick={(ev) => {
          if (accountId && accountId.length > 0) {
            unlinkPlatform();
          } else {
            startLogin();
          }
        }}
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