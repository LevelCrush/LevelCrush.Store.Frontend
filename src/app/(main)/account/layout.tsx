import { retrieveCustomer } from "@lib/data/customer";
import { Toaster } from "@medusajs/ui";
import AccountLayout from "@modules/account/templates/account-layout";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode;
  login?: React.ReactNode;
}) {
  const customer = await retrieveCustomer().catch(() => null);

  
  return (
    <AccountLayout customer={customer}>
      {customer ? dashboard : login}
      <Toaster />
    </AccountLayout>
  );
}
