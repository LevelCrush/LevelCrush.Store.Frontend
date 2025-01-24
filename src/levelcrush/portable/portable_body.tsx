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
  },
} as Partial<PortableTextReactComponents>;

export interface PortableBodyProps {
  blocks: PortableTextBlock;
}

export default function PortableBody(props: PortableBodyProps) {
  return <PortableText value={props.blocks} components={customComponents} />;
}
