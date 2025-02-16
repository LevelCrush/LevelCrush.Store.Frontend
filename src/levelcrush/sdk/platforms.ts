"use client";

import { updateCustomer } from "@lib/data/customer";
import { StoreCustomer } from "@medusajs/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface BungieValidationResult {
  membershipId: string;
  membershipType: number;
  displayName: string;
  inNetworkClan: boolean;
}

export interface DiscordValidationResult {
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

export type Platform = "discord" | "bungie";

function forceRedirect(
  router: AppRouterInstance | undefined,
  redirectType: "postLink" | "unlink" = "postLink"
) {
  const windowUrl = new URL(window.location.href);
  const amount = windowUrl.searchParams.has(redirectType)
    ? parseInt(windowUrl.searchParams.get(redirectType) || "0") || 0
    : 0;
  windowUrl.searchParams.append(redirectType, (amount + 1).toString());
  if (router) {
    router.push(windowUrl.toString());
  } else {
    window.location.href = windowUrl.toString();
  }
}

async function platformSession(platform: Platform) {
  const req = await fetch(
    `${
      process.env["NEXT_PUBLIC_LEVELCRUSH_AUTH_SERVER"]
    }/platform/${encodeURIComponent(platform)}/session`,
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

export async function platformUnlink(
  platform: Platform,
  customer: StoreCustomer | null,
  router: AppRouterInstance
) {
  
  if(platform === "discord") { 
    return;
  }
  
  const metadata = customer ? customer.metadata || {} : {};

  const platformKeys = Object.keys(metadata).filter((v) =>
    v.startsWith(platform)
  );
  const newMetadata = {} as Record<string, unknown>;
  for (const key of platformKeys) {
    newMetadata[key] = "";
  }

  await updateCustomer({
    metadata: newMetadata,
  });

  forceRedirect(router, "unlink");
}

export async function platformLinkBungie(
  bungieValidation: BungieValidationResult
) {
  if (
    bungieValidation.membershipId &&
    bungieValidation.membershipId.length > 0
  ) {
    const newMetadata = {} as Record<string, unknown>;
    newMetadata["bungie.id"] = bungieValidation.membershipId || "";
    newMetadata["bungie.handle"] = bungieValidation.displayName || "";
    newMetadata["bungie.platform"] = bungieValidation.membershipType || -1;
    newMetadata["bungie.clan_member"] = bungieValidation.inNetworkClan;

    await updateCustomer({
      metadata: newMetadata,
    });
  }
}

export function platformMetadataDiscord(
  discordValidationResult: DiscordValidationResult
) {
  return {
    "discord.id": discordValidationResult.discordId,
    "discord.handle": discordValidationResult.discordHandle,
    "discord.globalName": discordValidationResult.globalName,
    "discord.server_member": discordValidationResult.inServer,
    "discord.nicknames": discordValidationResult.nicknames,
    "discord.admin": discordValidationResult.isAdmin,
    "discord.moderator": discordValidationResult.isModerator,
    "discord.booster": discordValidationResult.isBooster,
    "discord.retired": discordValidationResult.isRetired,
    "discord.email": discordValidationResult.email,
  };
}

export async function platformLinkDiscord(
  discordValidationResult: DiscordValidationResult
) {
  const metadata = platformMetadataDiscord(discordValidationResult);
  await updateCustomer({
    metadata
  });
}

export async function platformStart(
  platform: Platform,
  router: AppRouterInstance
) {
  var childWindow = window.open(
    `${
      process.env["NEXT_PUBLIC_LEVELCRUSH_AUTH_SERVER"]
    }/platform/${encodeURIComponent(platform)}/login`,
    "_blank"
  );

  if (childWindow) {
    var intervalHandle = setInterval(async () => {
      if (childWindow?.closed) {
        clearInterval(intervalHandle);
        const data = await platformSession(platform);

        if (platform == "bungie") {
          const bungieValidation = data as BungieValidationResult;
          platformLinkBungie(bungieValidation);
        } else if(platform == "discord") {
          const discordValidation = data as DiscordValidationResult;
          platformLinkDiscord(discordValidation);
        }

        forceRedirect(router, "postLink");
        return;
      }
    }, 1000);
  }
}
