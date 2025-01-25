"use client";

import Container from "@levelcrush/elements/container";
import { CMSTemplateProps } from "./cms_template";
import ReactPlayer from "react-player/lazy";
import ContainerInner from "@levelcrush/elements/container_inner";

export default function CMSTemplateHome(props: CMSTemplateProps) {
  if (!props.page.template) {
    return <></>;
  }

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

  /*
        <iframe
        id="youtubePlayer"
        width="1920"
        height="1080"
        className="w-full h-full fixed top-0 left-0"
        src={
          "https://www.youtube-nocookie.com/embed/" +
          encodeURIComponent(heroSrc) +
          "?iv_load_policy=3&controls=0&autoplay=1&disablekb=1&fs=0&showinfo=0&rel=0&loop=1&playlist=" +
          encodeURIComponent(heroSrc) +
          "&modestbranding=1&playsinline=1&mute=1"
        }
        title="Embedded Inline Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
  */

  return (
    <>
      <div className="top-[-4.5rem] relative max-w-[240rem] mx-auto">
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
      <ContainerInner></ContainerInner>
    </>
  );
}
