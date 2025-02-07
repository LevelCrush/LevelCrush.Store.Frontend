import { BlogPostListingRecord } from "@levelcrush/blog/blog_list";
import BlogPost, { BlogPostRecord } from "@levelcrush/blog/blog_post";
import cms from "@levelcrush/cms";
import { client } from "@sanity-cms/lib/client";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug?: string }>;
};

export default async function BlogPage(props: Props) {
  notFound();
  const params = await props.params;
  const slug = params.slug || "";

  if (!slug) {
    notFound();
  }

  const post = await cms.blog(slug);
  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
