import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store | Level Crush",
  description: "Explore all of our products.",
}

/*
type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
} */

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

//export default async function StorePage(props: Params) {
  export default async function StorePage(props: Params) {
  //const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode="us"
    //  countryCode={params.countryCode}
    />
  )
}
