"use client";

import React, { Suspense, useEffect } from "react";
import Container from "./elements/container";
import { H1 } from "./elements/headings";
import Hyperlink from "./elements/hyperlink";
import { OffCanvasToggle } from "@levelcrush/offcanvas";
import DiscordLink from "@levelcrush/discord_link";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import CartButton from "@levelcrush/cart/cart-button";

export interface SiteHeaderProps {
  forceStickyStyle?: boolean;
}

export const SiteHeader = (props: SiteHeaderProps) => {
  useEffect(() => {
    if (props.forceStickyStyle) {
      const el = document.querySelector(".navigation-bar");
      if (el) {
        el.classList.add("is-sticky");
      }
    } else {
      const el = document.querySelector(".navigation-bar");
      const observer = new IntersectionObserver(
        ([e]) =>
          e.target.classList.toggle("is-sticky", e.intersectionRatio < 1),
        { threshold: [1] }
      );
      if (el) {
        observer.observe(el);
      }

      return () => {
        if (el) {
          observer.unobserve(el);
        }
        observer.disconnect();
      };
    }
  }, []);

  return (
    <header className="top-[-1px] sticky z-[99] navigation-bar backdrop-blur-sm transition-all">
      <div className="min-h-[4.5rem] flex items-center h-auto transition-all bg-[rgba(0, 0, 0, 0.35);] sticky:bg-[rgba(0,33,52,1)] border-b-8 border-solid border-cyan-400 shadow-[0px_.5rem_.5rem_2px_rgba(0,0,0,0.7)] relative z-[99] ">
        <Container
          minimalCSS={true}
          className="relative flex-auto px-4 flex mx-auto my-0 justify-between items-center flex-wrap md:flex-nowrap "
        >
          <div className="flex-initial text-center md:text-left absolute">
            <OffCanvasToggle className="float-left text-yellow-400  text-4xl font-headline font-bold uppercase tracking-widest drop-shadow-lg" />
            <div className="clear-both"></div>
          </div>

          <H1 className="flex-auto text-center transition-all">
            <Hyperlink className="!hover:no-underline" href="/" title="Go home">
              Level Crush
            </Hyperlink>
          </H1>

          <div className="right-4 absolute flex-auto basis-full md:basis-auto  text-center mt-8 mb-8 md:mt-0 md:mb-0 md:flex-initial md:text-right hidden md:block">
            <div className="w-full flex gap-4">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base flex gap-2"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    Cart (0)
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default SiteHeader;
