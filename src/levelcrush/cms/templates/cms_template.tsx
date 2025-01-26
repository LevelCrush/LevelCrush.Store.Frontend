import React from "react";
import { CMSPageRecord } from "../cms_page";
import ContainerInner from "@levelcrush/elements/container_inner";
import { H2 } from "@levelcrush/elements/headings";
import PortableBody from "@levelcrush/portable/portable_body";
import Hero from "@levelcrush/hero";

export interface CMSTemplateProps {
  page: CMSPageRecord;
  additional?: Record<any, any>;
}

export default function CMSTemplate(props: CMSTemplateProps) {
  return (
    <>
      {props.page.hero ? (
        <Hero backgroundUrl={props.page.hero}>
          <H2>{props.page.title}</H2>
        </Hero>
      ) : (
        <></>
      )}
      <ContainerInner>
        <article className="w-full px-4">
          <H2>{props.page.title}</H2>
          <PortableBody blocks={props.page.body}></PortableBody>
        </article>
      </ContainerInner>
    </>
  );
}
