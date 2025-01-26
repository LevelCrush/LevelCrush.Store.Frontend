"use client";

import Container from "@levelcrush/elements/container";
import { CMSTemplateProps } from "./cms_template";
import ReactPlayer from "react-player/lazy";
import ContainerInner from "@levelcrush/elements/container_inner";
import { H2 } from "@levelcrush/elements/headings";
import PortableBody from "@levelcrush/portable/portable_body";
import BlogList, { BlogPostListingRecord } from "@levelcrush/blog/blog_list";

export default function CMSTemplateHome(props: CMSTemplateProps) {
  if (!props.page.template) {
    return <></>;
  }

  const addl = props.additional || {};
  const posts = (addl.posts as BlogPostListingRecord[] | null | undefined) || [] as BlogPostListingRecord[];

  const metadata = props.page.template.metadata || [];

  let heroSrc = "";
  let heroType = "";
  for (const meta of metadata) {
    if (meta.key === "hero.src") {
      heroSrc = meta.value;
    }

    if (meta.value === "hero.type") {
      heroType = meta.value;
    }
  }

  return (
    <>
      <div className="top-[-4.5rem] relative max-w-[240rem] mx-auto border-b-8 border-solid border-cyan-400 shadow-[0px_.5rem_.5rem_2px_rgba(0,0,0,0.7)]">
        <div className="player-wrapper">
          <ReactPlayer
            className="react-player"
            url={heroSrc}
            muted={true}
            playing={true}
            playsinline={true}
            width="100%"
            height="100%"
            loop={true}
            config={{
              youtube: {
                embedOptions: {
                  iv_load_policy: "3",
                  controls: "0",
                  fs: "0",
                  showinfo: "0",
                  rel: "0",
                  modestbranding: "1",
                  mute: 1,
                },
              },
            }}
          />
        </div>
      </div>
      <ContainerInner>
        <div className="w-full bg-[rgba(0,0,0,.85)] md:p-8">
          <H2>{props.page.title}</H2>
          <PortableBody blocks={props.page.body} />
        </div>
      </ContainerInner>
      <BlogList post={posts} />
    </>
  );
}
