import { Metadata } from "next"

import Overview from "@modules/account/components/overview"
import { notFound, redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
}

export default async function OverviewTemplate() {
  const customer = await retrieveCustomer().catch(() => null)
  const orders = (await listOrders().catch(() => null)) || null

  if (!customer) {
    const head = await headers();
    const pageUrl = head.get("x-url") || "/";
    redirect(`/account?returnTo=${encodeURIComponent(pageUrl)}`);
    return;
  }

  return <Overview customer={customer} orders={orders} />
}
