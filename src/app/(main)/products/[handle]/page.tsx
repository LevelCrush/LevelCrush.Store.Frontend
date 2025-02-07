import { Metadata } from "next";
import { notFound } from "next/navigation";
import { listProducts } from "@lib/data/products";
import { getRegion, listRegions } from "@lib/data/regions";
import ProductTemplate from "@modules/products/templates";
import { client } from "@sanity-cms/lib/client";

/*
type Props = {
  params: Promise<{ countryCode: string; handle: string }>
} */

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateStaticParams() {
  // for now we are hiding this page
  notFound();

  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    );

    if (!countryCodes) {
      return [];
    }

    const products = await listProducts({
      countryCode: "US",
      queryParams: { fields: "handle" },
    }).then(({ response }) => response.products);

    return countryCodes
      .map((countryCode) =>
        products.map((product) => ({
          countryCode,
          handle: product.handle,
        }))
      )
      .flat()
      .filter((param) => param.handle);
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    );
    return [];
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  // for now we are hiding this page
  notFound();

  const params = await props.params;
  const countryCode = "us";
  const handle = params.handle;
  const region = await getRegion(countryCode);

  if (!region) {
    notFound();
  }

  const product = await listProducts({
    countryCode: countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0]);

  if (!product) {
    notFound();
  }

  return {
    title: `${product.title} | Level Crush`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Level Crush`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function ProductPage(props: Props) {
  // for now we are hiding this page
  notFound();

  const params = await props.params;
  const countryCode = "us";
  const region = await getRegion(countryCode);

  if (!region) {
    notFound();
  }

  const pricedProduct = await listProducts({
    countryCode: countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0]);

  if (!pricedProduct) {
    notFound();
  }

  // alternatively, you can filter the content by the language
  const sanity = (await client.getDocument(pricedProduct.id))?.specs[0];

  console.log("Intended Sanity", sanity);

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={countryCode}
      sanity={sanity}
    />
  );
}
