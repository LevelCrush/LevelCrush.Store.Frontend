import ContainerInner from "@levelcrush/elements/container_inner";
import { H2 } from "@levelcrush/elements/headings";
import PortableBody from "@levelcrush/portable/portable_body";
import { PortableTextBlock } from "sanity";
import CMSTemplate from "./templates/cms_template";
import CMSTemplateHome from "./templates/cms_template_home";
import CMSTemplateEmbed from "./templates/cms_template_embed";

export interface CMSPageRecord {
  id: string;
  title: string;
  metaDescription: string;
  tabName: string;
  categories: unknown[];
  route: string;
  hero: string | null;
  body: PortableTextBlock;
  template: {
    slug: string;
    metadata: { key: string; value: string }[];
  } | null;
}

export interface CMSPageProps {
  page: CMSPageRecord;
  additional?: Record<any, any>;
}

export default function CMSPage(props: CMSPageProps) {
  if (props.page.template) {
    const slug = props.page.template.slug.toLowerCase();

    if (slug == "home") {
      return <CMSTemplateHome {...props} />;
    }

    if (slug === "multi-embed") {
      return <CMSTemplateEmbed {...props} />;
    }
  }

  return <CMSTemplate {...props} />;
}
