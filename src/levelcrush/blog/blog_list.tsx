import { H1, H3 } from "@levelcrush/elements/headings";
import PortableBody from "@levelcrush/portable/portable_body";
import { ImageAsset, PortableTextBlock } from "sanity";
import React from "react";
import Container from "@levelcrush/elements/container";
import Link from "next/link";
import Image from "next/image";

export interface BlogPostListingRecord {
  _id: string;
  title: string;
  slug: string;
  image: ImageAsset | null;
  shortBody: PortableTextBlock;
  publishedAt: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface BlogListProps {
  post?: BlogPostListingRecord[] | null;
}

export default function BlogList(props: BlogListProps) {
  const postings = props.post || [];
  return (
    <Container className="top-[4.5rem]">
      {postings.map((post, key) => (
        <div key={`blog_list_${post._id}.${key}`}>
          <H3>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </H3>
          {post.image ? (
            <section>
              <div className="w-full h-[30rem] relative top-0">
                <Image src={post.image.url} fill={true} alt="" />
              </div>
            </section>
          ) : (
            <></>
          )}
          <PortableBody blocks={post.shortBody} />
        </div>
      ))}
    </Container>
  );
}
