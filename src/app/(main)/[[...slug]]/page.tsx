import cms from "@levelcrush/cms";
import CMSPage, { CMSPageProps } from "@levelcrush/cms/cms_page";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string[] }>;
};


export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  try {
    const params = await props.params;
    const slugs = params.slug || [];
    // const slug = params.cmsSlug1 || "";
    const route = `/${slugs.join("/")}`;
    const page = await cms.page(route);
    if (!page) {
      console.log("Could not find route", route);
      notFound();
    }

    const title = page.tabName || "Level Crush";
    const description = page.metaDescription || "";

    return {
      title: title,
      description,
      alternates: {
        canonical: ``,
      },
    };
  } catch (error) {
    console.log("Err", error);
    notFound();
  }
}

export default async function FallbackPage(props: Props) {
  const params = await props.params;
  const slugs = params.slug || [];
  const route = `/${slugs.join("/")}`;
  console.info("Looking for route", route);
  const page = await cms.page(route);
  if (!page) {
    notFound();
  }

  let cmsProps = {
    page: page,
    additional: {},
  } as CMSPageProps;

  if (route == "/" && cmsProps.additional) {
    const latestPost = await cms.blogPaginate();
    cmsProps.additional["posts"] = latestPost;
  }

  return <CMSPage {...cmsProps} />;
}
