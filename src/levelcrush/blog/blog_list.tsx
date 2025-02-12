import { H1, H3 } from "@levelcrush/elements/headings";
import PortableBody from "@levelcrush/portable/portable_body";
import { ImageAsset, PortableTextBlock } from "sanity";
import React from "react";
import Container from "@levelcrush/elements/container";
import Link from "next/link";
import Image from "next/image";
import BlogPost from "./blog_post";
import { notFound } from "next/navigation";

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
    <>
      {postings.map((post, key) => (
        <BlogPost
          showLink={true}
          post={post}
          key={`blog_list_${post._id}.${key}`}
        />
      ))}
    </>
  );
}
