import { Metadata } from "next";

import { H1, H2 } from "@levelcrush/elements/headings";
import { retrieveCustomer } from "@lib/data/customer";
import Container from "@levelcrush/elements/container";
import AccountButton from "@levelcrush/account/account_button";
import AccountLinkPlatform from "@levelcrush/profile/integrations/accountLinkPlatform";
import Link from "next/link";
import CheckoutHolidayGift from "@levelcrush/checkout/checkout_holiday_gift";
import { getRegion } from "@lib/data/regions";
import { notFound } from "next/navigation";
import cms from "@levelcrush/cms";

export const metadata: Metadata = {
  title: "Holiday Gift 2024 | Level Crush",
  description: "Level Crush Holiday Gift",
};

function LinkDiscord() {
  return (
    <Container>
      <H1>Discord Account</H1>
      <AccountButton />
    </Container>
  );
}

function LinkBungie() {
  return (
    <Container>
      <H2 className="mb-4">Bungie Membership</H2>
      <p className="mb-4">
        You will only be able to proceed on with the following conditions
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>You have a valid linked bungie account</li>
        <li>
          You are in either the{" "}
          <Link
            target="_blank"
            href="https://www.bungie.net/en/ClanV2?groupid=4356849"
          >
            Level Crush
          </Link>{" "}
          Destiny clan OR the{" "}
          <Link
            target="_blank"
            href="https://www.bungie.net/en/ClanV2?groupid=4250497"
          >
            Level Stomp
          </Link>{" "}
          destiny clan.{" "}
        </li>
      </ul>
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
    </Container>
  );
}

export default async function HolidayGiftPage() {
  const account = await retrieveCustomer();
  const region = await getRegion("us");

  if (!region) {
    notFound();
  }

  if (!account) {
    return LinkDiscord();
  }

  const metadata = account.metadata || {};
  if (
    !metadata["discord.id"] ||
    (metadata["discord.id"] as string).trim().length === 0
  ) {
    return LinkDiscord();
  }

  if (
    !metadata["bungie.id"] ||
    (metadata["bungie.id"] as string).trim().length === 0
  ) {
    return LinkBungie();
  }

  const page = await cms.page("/holiday-gift");

  return <CheckoutHolidayGift region={region} customer={account} page={page} />;
}
