import { Metadata } from "next";

import { H1, H2 } from "@levelcrush/elements/headings";
import { retrieveCustomer } from "@lib/data/customer";
import Container from "@levelcrush/elements/container";
import AccountButton from "@levelcrush/account/account_button";
import AccountLinkPlatform from "@levelcrush/profile/integrations/accountLinkPlatform";
import Link from "next/link";
import CheckoutHolidayGift, {
  RasputinTitlesResponse,
} from "@levelcrush/checkout/checkout_holiday_gift";
import { getRegion } from "@lib/data/regions";
import { notFound, redirect } from "next/navigation";
import cms from "@levelcrush/cms";
import ContainerInner from "@levelcrush/elements/container_inner";
import Button, { HyperlinkButton } from "@levelcrush/elements/button";
import { revalidateTag } from "next/cache";
import { getCacheTag } from "@lib/data/cookies";
import { headers } from "next/headers";
import { AccountLinkPlatformBungie, AccountLinkPlatformDiscord } from "@levelcrush/profile/integrations/accountLinkBook";

export const metadata: Metadata = {
  title: "Holiday Gift 2024 | Level Crush",
  description: "Level Crush Holiday Gift",
};

function LinkDiscord() {
  return (
    <ContainerInner>
      <H2 >Please link your discord.</H2>
      <p className="my-4">
        This gift is personal, private and intended only for Level Crush server
        members
      </p>
      <div>
       <AccountLinkPlatformDiscord />
      </div>
    </ContainerInner>
  );
}

function LinkBungie() {
  return (
    <ContainerInner>
      <H2 className="mb-4">Bungie Membership</H2>
      <p className="mb-4">
        You will only be able to proceed on with the following conditions
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>You have a valid linked bungie account</li>
        <li>
          You are in either the{" "}
          <Link
            className="underline"
            target="_blank"
            href="https://www.bungie.net/en/ClanV2?groupid=4356849"
          >
            Level Crush
          </Link>{" "}
          Destiny clan OR the{" "}
          <Link
            target="_blank"
            className="underline"
            href="https://www.bungie.net/en/ClanV2?groupid=4250497"
          >
            Level Stomp
          </Link>{" "}
          destiny clan.{" "}
        </li>
      </ul>
      <AccountLinkPlatformBungie />
    </ContainerInner>
  );
}

export default async function HolidayGiftPage() {
  const account = await retrieveCustomer("no-store");
  const region = await getRegion("us");

  if (!region) {
    console.warn("No region for holiday gift");
    notFound();
  }

  if (!account) {

    const head = await headers();
    const pageUrl = head.get('x-url') || "/";
    redirect(`/account?returnTo=${encodeURIComponent(pageUrl)}`);
    return;
  }

  const metadata = account.metadata || {};
  if (
    !metadata["discord.id"] ||
    (`${metadata["discord.id"]}` as string).trim().length === 0
  ) {
    return LinkDiscord();
  }

  if (!metadata["discord.server_member"]) {
    return LinkDiscord();
  }

  if (
    !metadata["bungie.id"] ||
    (`${metadata["bungie.id"]}` as string).trim().length === 0
  ) {
    return LinkBungie();
  }

  if (!metadata["bungie.clan_member"]) {
    return LinkBungie();
  }

  const page = await cms.page("/holiday-gift");
  if (!page) {
    console.warn("No CMS Page found");
    notFound();
  }

  const rasputinRes = await fetch(
    `${process.env["NEXT_PUBLIC_RASPUTIN"]}/member/${encodeURIComponent(
      metadata["bungie.id"] + ""
    )}/titles`,
    {
      method: "GET",
      cache: "force-cache",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const rasputinData = (await rasputinRes.json()) as RasputinTitlesResponse;

  return (
    <CheckoutHolidayGift
      region={region}
      customer={account}
      page={page}
      titles={rasputinData}
    />
  );
}
