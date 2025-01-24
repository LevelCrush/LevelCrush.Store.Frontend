// src/components/Body.tsx
"use client";

import React from "react";
import {
  PortableText,
  PortableTextComponent,
  PortableTextReactComponents,
  PortableTextTypeComponent,
} from "@portabletext/react";
import ReactPlayer from "react-player";
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
      return <ReactPlayer url={url} />;
    },
  },
} as Partial<PortableTextReactComponents>;

export interface PortableBodyProps {
  blocks: PortableTextBlock;
}

export default function PortableBody(props: PortableBodyProps) {
  return <PortableText  value={props.blocks} components={customComponents} />;
}
