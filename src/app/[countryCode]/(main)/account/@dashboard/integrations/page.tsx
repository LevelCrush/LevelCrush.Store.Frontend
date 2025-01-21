import { Metadata } from "next";
import { notFound } from "next/navigation";

import AddressBook from "@modules/account/components/address-book";

import { getRegion } from "@lib/data/regions";
import { retrieveCustomer } from "@lib/data/customer";
import AccountLinkBook from "components/AccountLinkBook";

export const metadata: Metadata = {
  title: "Integrations",
  description: "View your profile integrations",
};

export default async function Integrations(props: {
  params: Promise<{ countryCode: string }>;
}) {
  const params = await props.params;
  const { countryCode } = params;
  const customer = await retrieveCustomer();

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
