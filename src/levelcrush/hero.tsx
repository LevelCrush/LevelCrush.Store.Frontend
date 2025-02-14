"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";

export interface HeroProps {
  backgroundUrl?: string;
  className?: string;
  youtubeUrl?: string;
}

export default function Hero(props: React.PropsWithChildren<HeroProps>) {
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    <div
      className={
        "flex-auto basis-full relative top-[-4.5rem] left-0 hero bg-cover bg-center  h-auto flex flex-col items-center justify-center border-b-8 border-solid border-cyan-400 shadow-[0px_.3rem_1rem_2px_rgba(0,0,0,0.4)] " +
        (props.className || "")
      }
      style={{
        backgroundImage: `url(${props.backgroundUrl || "/hero.jpg"})`,
        minHeight: "50rem",
      }}
    >
      
      {props.youtubeUrl && hasWindow ? (
        <>
          <div className="absolute top-0 left-0 bg-black opacity-[.65] w-full h-full"></div>
          <div className="player-wrapper w-full">
            <ReactPlayer
              className="react-player"
              url={props.youtubeUrl}
              muted={true}
              playing={true}
              playsinline={true}
              width="100%"
              height="100%"
              loop={true}
      
              config={{
                youtube: {
                  embedOptions: {
                    iv_load_policy: "3",
                    controls: "0",
                    fs: "0",
                    showinfo: "0",
                    rel: "0",
                    modestbranding: "1",
                    mute: 1,
                  },
                },
              }}
            />
          </div>
        </>
      ) : (
        <></>
      )}
      {props.children}
    </div>
  );
}
