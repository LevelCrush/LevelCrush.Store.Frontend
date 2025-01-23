import { Metadata } from "next";

import FeaturedProducts from "@modules/home/components/featured-products";
import Hero from "@modules/home/components/hero";
import { listCollections } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";
import Container from "@levelcrush/elements/container";
import { YouTubeConfig } from "@levelcrush/config/youtube";

export const metadata: Metadata = {
  title: "Level Crush",
  description:
    "We just game.",
};


/*
export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) { */
export default async function Home() {
  //const params = await props.params

  //const { countryCode } = params
  const countryCode = "us";

  const region = await getRegion(countryCode);

  const { collections } = await listCollections({
    fields: "id, handle, title",
  });

  if (!collections || !region) {
    return null;
  }

  const youtubeID = YouTubeConfig.playlistIDHome;

  return (
    <>
      <Container minimalCSS={true} className="lg:px-4 mx-auto mt-16">
        <iframe
          id="youtubePlayer"
          width="1920"
          height="1080"
          className="w-full h-full fixed top-0 left-0"
          src={
            'https://www.youtube-nocookie.com/embed/' +
            encodeURIComponent(youtubeID) +
            '?iv_load_policy=3&controls=0&autoplay=1&disablekb=1&fs=0&showinfo=0&rel=0&loop=1&playlist=' +
            encodeURIComponent(youtubeID) +
            '&modestbranding=1&playsinline=1&mute=1'
          }
          title="Embedded Inline Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
        <div className="flex relative top-0 basis-full w-full">
          {/* For now empty */}
        </div>
      </Container>
    </>
  );
}
