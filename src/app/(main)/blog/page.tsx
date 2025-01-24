import BlogList, { BlogPostListingRecord } from "@levelcrush/blog/blog_list";
import ContainerInner from "@levelcrush/elements/container_inner";
import { client } from "@sanity-cms/lib/client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
};

export default async function Blog() {
  const latestPost = (await client.fetch(`
        *[_type == "post"] | order(publishedAt desc)[0..9] {
          _id,
          title,
          "image": image.asset->,
          "slug": slug.current,
          shortBody,
          publishedAt,
          _createdAt,
          _updatedAt
        }`)) as BlogPostListingRecord[] | null | undefined;


  return <BlogList post={latestPost} />;
}
