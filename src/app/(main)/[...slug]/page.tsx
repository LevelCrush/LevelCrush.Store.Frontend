import cms from "@levelcrush/cms";
import CMSPage from "@levelcrush/cms/cms_page";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string[]; }>
}


/*
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
  const params = await props.params
  try {
    const params = await props.params;
   // const slug = params.cmsSlug1 || "";
    const route = `/${params.slug.join("/")}`;
    const title = "Teehee";
    const description = "Description";

    return {
      title: `${title} | Medusa Store`,
      description,
      alternates: {
        canonical: ``,
      },
    }
  } catch (error) {
    console.log("Err");
    notFound()
  }
}

export default async function FallbackPage(props: Props) {
  const params = await props.params;
  const route = `/${params.slug.join("/")}`;

  const page = await cms.page(route);
  console.log(page, typeof page);
  if(!page) {
    notFound();
  }


  return <CMSPage page={page} />
}
