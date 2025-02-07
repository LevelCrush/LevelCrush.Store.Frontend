"use client";

import Container from "@levelcrush/elements/container";
import { CMSTemplateProps } from "./cms_template";
import ReactPlayer from "react-player/lazy";
import ContainerInner from "@levelcrush/elements/container_inner";
import { H2 } from "@levelcrush/elements/headings";
import PortableBody from "@levelcrush/portable/portable_body";
import BlogList, { BlogPostListingRecord } from "@levelcrush/blog/blog_list";
import Hero from "@levelcrush/hero";
import DiscordLink from "@levelcrush/discord_link";

export default function CMSTemplateHome(props: CMSTemplateProps) {
  if (!props.page.template) {
    return <></>;
  }

  const addl = props.additional || {};

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

  let isYouTube = heroSrc.toLowerCase().includes("youtube");

  /*
  <div className="top-[-4.5rem] relative max-w-[240rem] mx-auto border-b-8 border-solid border-cyan-400 shadow-[0px_.5rem_.5rem_2px_rgba(0,0,0,0.7)]">

      </div>
   */

  return (
    <>
      <Hero
        youtubeUrl={isYouTube ? heroSrc : ""}
        backgroundUrl={isYouTube ? "" : heroSrc}
      />
      <ContainerInner>
        <div className="w-full px-4">
          <H2>{props.page.title}</H2>
          <PortableBody blocks={props.page.body} />
          <DiscordLink />
        </div>
      </ContainerInner>
    </>
  );
}
