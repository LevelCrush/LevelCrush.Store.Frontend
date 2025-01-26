import { H1, H3 } from "@levelcrush/elements/headings";
import PortableBody from "@levelcrush/portable/portable_body";
import { ImageAsset, PortableTextBlock } from "sanity";
import React from "react";
import Container from "@levelcrush/elements/container";
import Link from "next/link";
import Image from "next/image";
import ContainerInner from "@levelcrush/elements/container_inner";
import Button from "@levelcrush/elements/button";

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
  showLink?: boolean;
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
      <H3 className={"text-yellow-400 underline hover:text-white"}>
        <Link href={`/blog/${props.post.slug}`}>{props.post.title}</Link>
      </H3>
      {props.showLink ? (
        <Button
          className={"w-full md:w-auto min-w-[10rem]"}
          href={`/blog/${props.post.slug}`}
          intention={"normal"}
        >
          View Post
        </Button>
      ) : (
        <></>
      )}
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
  return (
    <ContainerInner>
      <article className="w-full px-4">
        <BlogPostTitle {...props} />
        <BlogPostCover {...props} />
        <BlogPostShortBody {...props} />
        <BlogPostBody {...props} />
        <BlogPostFooter {...props} />
      </article>
    </ContainerInner>
  );
}
