// src/components/Body.tsx
"use client";

import React from "react";
import {
  PortableText,
  PortableTextComponent,
  PortableTextReactComponents,
  PortableTextTypeComponent,
} from "@portabletext/react";
import ReactPlayer from "react-player/lazy";
import { PortableTextBlock } from "sanity";
import Image from "next/image";
import { H1, H2, H3, H4, H5, H6 } from "@levelcrush/elements/headings";

/*
const serializers = {
    types: {
      youtube: ({node:any}) => {
        const { url } = node
        return (<ReactPlayer url={url} />)
      }
    }
} */

const customComponents = {
  block: {
    h1: ({ children }) => <H1>{children}</H1>,
    h2: ({ children }) => <H2>{children}</H2>,
    h3: ({ children }) => <H3>{children}</H3>,
    h4: ({ children }) => <H4>{children}</H4>,
    h5: ({ children }) => <H5>{children}</H5>,
    h6: ({ children }) => <H6>{children}</H6>,
    normal: ({ children }) => <p className="my-4">{children}</p>,
  },
  types: {
    youtube: ({ value }) => {
      const { url } = value;
      return (
        <div className="player-wrapper">
          <ReactPlayer
            className="react-player"
            url={url}
            width="100%"
            height="100%"
          />
        </div>
      );
    },
    image: ({ value }) => {
      const { asset } = value as { asset: { _ref: string } };
      if (asset) {
        const dashSplits = asset._ref.split("-");
        const extension = dashSplits[dashSplits.length - 1];
        return (
          <div className="image-container aspect-video relative top-0">
            <Image
              src={`https://cdn.sanity.io/images/${
                process.env["NEXT_PUBLIC_SANITY_PROJECT_ID"] || ""
              }/${process.env["NEXT_PUBLIC_SANITY_DATASET"]}/${asset._ref
                .replace("image-", "")
                .replace("-" + extension, "")}.${extension}`}
              alt={""}
              fill={true}
            />
          </div>
        );
      } else {
        return <></>;
      }
    },
  },
} as Partial<PortableTextReactComponents>;

export interface PortableBodyProps {
  blocks: PortableTextBlock;
}

export default function PortableBody(props: PortableBodyProps) {
  
  return <PortableText value={props.blocks} components={customComponents} />;
}
