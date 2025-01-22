"use client";

import { H2 } from "@levelcrush/elements/headings";
import { signout } from "@lib/data/customer";
import { Button, Container } from "@medusajs/ui";
import { useContext } from "react";
import { AccountProviderContext } from "./account_provider";
import { useRouter } from "next/router";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import { isObject } from "@lib/util/isEmpty";
import { redirect } from "next/navigation";

export default function LogoutHelper() {
  const { account } = useContext(AccountProviderContext);

  useDeepCompareEffectNoCheck(() => {
    if (isObject(account) === false) {
      signout("us", true, "/");
    }
  }, [account]);

  function renderStillHere() {
    return (
      <>
        <H2>Still here?</H2>
        <p>Get going. git.</p>
        <Button
          variant="primary"
          onClick={async (ev) => {
            ev.preventDefault();
            await signout("us", true, "/");
            return false;
          }}
        >
          Log me out
        </Button>
      </>
    );
  }

  return <Container className="top-[4.5rem]">{renderStillHere()}</Container>;
}
