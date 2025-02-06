"use client";

import Container from "@levelcrush/elements/container";
import { CMSTemplateProps } from "./cms_template";

import ContainerInner from "@levelcrush/elements/container_inner";
import { H2, H3 } from "@levelcrush/elements/headings";
import PortableBody from "@levelcrush/portable/portable_body";
import BlogList, { BlogPostListingRecord } from "@levelcrush/blog/blog_list";
import ReactPlayer from "react-player/lazy";

export default function CMSTemplateEmbed(props: CMSTemplateProps) {
  if (!props.page.template) {
    return <></>;
  }

  const addl = props.additional || {};
  const metadata = props.page.template.metadata || [];

  const groups = {} as {
    [groupId: string]: {
      name: string;
      members: {
        [name: string]: { url: URL; id: string };
      };
    };
  };
  for (const metadataField of metadata) {
    const key = metadataField.key;
    if (key.startsWith("Name")) {
      const spl = key.split(".");
      const groupId = (spl[1] || "").trim();
      const groupName = metadataField.value;

      if (typeof groups[groupId] === "undefined") {
        groups[groupId] = { name: "", members: {} };
      }

      groups[groupId].name = groupName;
    } else {
      const spl = key.split("|");
      const group = (spl[0] || "").trim();
      const personName = (spl[1] || "Another Potatoe").trim();
      const url = metadataField.value;

      if (typeof groups[group] === "undefined") {
        groups[group] = { name: "", members: {} };
      }

      let jsUrl = new URL(url);
      groups[group].members[personName] = {
        url: jsUrl,
        id: jsUrl.pathname.split("/")[1],
      };
    }
  }

  /*
  <div className="top-[-4.5rem] relative max-w-[240rem] mx-auto border-b-8 border-solid border-cyan-400 shadow-[0px_.5rem_.5rem_2px_rgba(0,0,0,0.7)]">

      </div>
   */

  console.log(groups);

  return (
    <>
      <ContainerInner>
        <div className="w-full px-4">
          <H2>{props.page.title}</H2>
          <PortableBody blocks={props.page.body} />
          <div className="">
            {Object.keys(groups).map((group, idx) => (
              <div
                className="group group-stream"
                key={`multi_embed_group${group}`}
              >
                <H3>{groups[group].name}</H3>
                {Object.keys(groups[group].members).map((member, sidx) => (
                  <div
                    key={`me_group${group}))_member${member}`}
                    className="player-wrapper w-full"
                  >
                    <ReactPlayer
                      className="react-player"
                      url={groups[group].members[member].url.href}
                      muted={true}
                      playing={true}
                      playsinline={true}
                      width="100%"
                      height="100%"
                      loop={true}
                      controls={true}
                      config={{
                        twitch: {
                          options: {
                            channel: groups[group].members[member].id,
                          },
                        },
                      }}
                    ></ReactPlayer>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </ContainerInner>
    </>
  );
}
