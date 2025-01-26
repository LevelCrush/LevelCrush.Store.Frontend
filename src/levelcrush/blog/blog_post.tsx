import { H1, H3 } from "@levelcrush/elements/headings";
import PortableBody from "@levelcrush/portable/portable_body";
import { ImageAsset, PortableTextBlock } from "sanity";
import React from "react";
import Container from "@levelcrush/elements/container";
import Link from "next/link";
import Image from "next/image";
import ContainerInner from "@levelcrush/elements/container_inner";

export interface BlogPostRecord {
  _id: string;
  title: string;
  slug: string;
  image: ImageAsset | null;
  shortBody?: PortableTextBlock | null;
  body?: PortableTextBlock;
  publishedAt: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface BlogPostSectionComponentProps {
  post: BlogPostRecord;
}

export function BlogPostCover(props: BlogPostSectionComponentProps) {
  return (
    <>
      {props.post.image ? (
        <section className="blogpost-cover mb-16">
          <div className="w-full h-[30rem] relative top-0 ">
            <Image src={props.post.image.url} fill={true} alt="" />
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
}

export function BlogPostTitle(props: BlogPostSectionComponentProps) {
  return (
    <section className="blogpost-title  mb-16">
      <H3>
        <Link href={`/blog/${props.post.slug}`}>{props.post.title}</Link>
      </H3>
    </section>
  );
}

export function BlogPostBody(props: BlogPostSectionComponentProps) {
  return (
    <>
      {props.post.body ? (
        <section className="blogpost-content my-16">
          <PortableBody blocks={props.post.body} />
        </section>
      ) : (
        <></>
      )}
    </>
  );
}

export function BlogPostShortBody(props: BlogPostSectionComponentProps) {
  return (
    <>
      {props.post.shortBody ? (
        <section className="blogpost-content-short my-16">
          <PortableBody blocks={props.post.shortBody} />
        </section>
      ) : (
        <></>
      )}
    </>
  );
}

export function BlogPostFooter(props: BlogPostSectionComponentProps) {
  return (
    <footer className="blogpost-footer mt-16">
      <div>
        <span>Published on </span>
        <time dateTime={props.post.publishedAt}>{props.post.publishedAt}</time>
      </div>
      <div>
        <span>Last updated on </span>
        <time dateTime={props.post._updatedAt}>{props.post._updatedAt}</time>
      </div>
    </footer>
  );
}

export interface BlogPostProps {
  post: BlogPostRecord;
}

export default function BlogPost(props: BlogPostProps) {
  const post = props.post;
  return (
    <ContainerInner>
      <article className="w-full px-4">
        <BlogPostTitle post={post} />
        <BlogPostCover post={post} />
        <BlogPostShortBody post={post} />
        <BlogPostBody post={post} />
        <BlogPostFooter post={post} />
      </article>
    </ContainerInner>
  );
}
