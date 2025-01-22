import { AccountProviderContext } from "@levelcrush/account/account_provider";
import LogoutHelper from "@levelcrush/account/logout_helper";
import { H2 } from "@levelcrush/elements/headings";
import { retrieveCart } from "@lib/data/cart";
import { retrieveCustomer, signout } from "@lib/data/customer";
import { Button, Container } from "@medusajs/ui";
import CartTemplate from "@modules/cart/templates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logout | Level Crush",
  description: "Get me outta here chief.",
};

export default async function Logout() {
  return (
    <>
      <LogoutHelper></LogoutHelper>
    </>
  );
}
