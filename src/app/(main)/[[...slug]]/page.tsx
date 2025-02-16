import cms from "@levelcrush/cms";
import CMSPage, { CMSPageProps } from "@levelcrush/cms/cms_page";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string[] }>;
};

/* Maybe look into this? 
export async function generateStaticParams() {
  
  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
} */

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
    console.log("Err");
    notFound();
  }
}

export default async function FallbackPage(props: Props) {

  console.warn("Looking for slug");
  const params = await props.params;
  const slugs = params.slug || [];
  const route = `/${slugs.join("/")}`;

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
