import { Metadata } from "next";

import ProfilePhone from "@modules/account//components/profile-phone";
import ProfileBillingAddress from "@modules/account/components/profile-billing-address";
import ProfileEmail from "@modules/account/components/profile-email";
import ProfileName from "@modules/account/components/profile-name";
import ProfilePassword from "@modules/account/components/profile-password";

import { notFound, redirect } from "next/navigation";
import { listRegions } from "@lib/data/regions";
import { retrieveCustomer } from "@lib/data/customer";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Medusa Store profile.",
};

export default async function Profile() {
  const customer = await retrieveCustomer("no-store");
  const regions = await listRegions();

  if (!customer || !regions) {
    const head = await headers();
    const pageUrl = head.get("x-url") || "/";
    console.log("Do redirect");
    redirect(`/account?returnTo=${encodeURIComponent(pageUrl)}`);
  }

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Profile</h1>
        <p className="text-base-regular">
          View and update your profile information, including your name, email,
          and phone number. You can also update your billing address, or change
          your password.
        </p>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <ProfileName customer={customer} />
        <Divider />
        <ProfileEmail customer={customer} />
        <Divider />
        <ProfilePhone customer={customer} />
        <Divider />
        {/* <ProfilePassword customer={customer} />
        <Divider /> */}
        <ProfileBillingAddress customer={customer} regions={regions} />
      </div>
    </div>
  );
}

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />;
};
``;
