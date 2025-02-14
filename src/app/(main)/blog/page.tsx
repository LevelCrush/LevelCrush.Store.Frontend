import BlogList, { BlogPostListingRecord } from "@levelcrush/blog/blog_list";
import cms from "@levelcrush/cms";
import ContainerInner from "@levelcrush/elements/container_inner";
import { client } from "@sanity-cms/lib/client";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Blog Post",
  description: "Latest Blog Entries",
};

export default async function Blog() {
  notFound();
  const latestPost = await cms.blogPaginate();
  return <BlogList post={latestPost} />;
}
