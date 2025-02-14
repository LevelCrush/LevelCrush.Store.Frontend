import { Metadata } from "next";

import FeaturedProducts from "@modules/home/components/featured-products";
import Hero from "@modules/home/components/hero";
import { listCollections } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";
import Container from "@levelcrush/elements/container";
import { YouTubeConfig } from "@levelcrush/config/youtube";
import { client } from "@sanity-cms/lib/client";
import cms from "@levelcrush/cms";
import { notFound } from "next/navigation";
import CMSPage from "@levelcrush/cms/cms_page";

export const metadata: Metadata = {
  title: "Level Crush",
  description: "We just game.",
};

/*
export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) { */
export default async function Home() {
  const page = await cms.page("/");
  if (!page) {
    notFound();
  }

  const latestPost = await cms.blogPaginate();

  return (
    <CMSPage
      page={page}
      additional={{
        posts: latestPost,
      }}
    />
  );
}
