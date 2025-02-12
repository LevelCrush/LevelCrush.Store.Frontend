import { Metadata } from "next";
import { notFound } from "next/navigation";

import AddressBook from "@modules/account/components/address-book";

import { getRegion } from "@lib/data/regions";
import { retrieveCustomer } from "@lib/data/customer";
import AccountLinkBook from "@levelcrush/profile/integrations/accountLinkBook";
import { getCacheTag } from "@lib/data/cookies";
import { revalidateTag } from "next/cache";

export const metadata: Metadata = {
  title: "Integrations",
  description: "View your profile integrations",
};

export default async function Integrations() {
  const customer = await retrieveCustomer("no-store");

  if (!customer) {
    notFound();
  }

  return (
    <div className="w-full" data-testid="integrations-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Integrations</h1>
        <p className="text-base-regular">
          Connect your profile to other services
        </p>
      </div>
      <AccountLinkBook></AccountLinkBook>
    </div>
  );
}
