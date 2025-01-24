import { BlogPostListingRecord } from "@levelcrush/blog/blog_list";
import BlogPost, { BlogPostRecord } from "@levelcrush/blog/blog_post";
import { client } from "@sanity-cms/lib/client";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug?: string }>;
};

export default async function BlogPage(props: Props) {
  const params = await props.params;
  const slug = params.slug || "";

  if (!slug) {
    notFound();
  }

  const posts =
    (await client.fetch(`*[_type == "post" && slug.current == "${slug}"] {
    _id,
    title,
    "image": image.asset->,
    "slug": slug.current,
    body,
    publishedAt,
    _createdAt,
    _updatedAt
    }`)) as BlogPostRecord[];
  const post = (posts || []).at(0);
  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
