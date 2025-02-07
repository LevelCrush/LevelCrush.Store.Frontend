import { Metadata } from "next";

import FeaturedProducts from "@modules/home/components/featured-products";
import Hero from "@modules/home/components/hero";
import { getCollectionByHandle, listCollections } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";
import Container from "@levelcrush/elements/container";
import { YouTubeConfig } from "@levelcrush/config/youtube";
import { H2 } from "@levelcrush/elements/headings";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Products | Level Crush",
  description: "Get your goodies here.",
};

/*
export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) { */
export default async function Products() {
  // for now we are hiding this page
  notFound();

  const region = await getRegion("us");

  if (!region) {
    notFound();
  }

  const collection = await getCollectionByHandle("members-only");

  if (!collection) {
    notFound();
  }

  return (
    <>
      <Container minimalCSS={true} className="lg:px-4 mx-auto mt-16">
        <H2>Products here</H2>
        <FeaturedProducts collections={[collection]} region={region} />
      </Container>
    </>
  );
}
