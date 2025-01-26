import React from "react";
import { CMSPageRecord } from "../cms_page";
import ContainerInner from "@levelcrush/elements/container_inner";
import { H2 } from "@levelcrush/elements/headings";
import PortableBody from "@levelcrush/portable/portable_body";

export interface CMSTemplateProps {
  page: CMSPageRecord;
  additional?: Record<any, any>;
}

export default function CMSTemplate(props: CMSTemplateProps) {
  return (
    <ContainerInner>
      <article className="w-full px-4">
        <H2>{props.page.title}</H2>
        <PortableBody blocks={props.page.body}></PortableBody>
      </article>
    </ContainerInner>
  );
}
