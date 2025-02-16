"use client";

import { H2 } from "@levelcrush/elements/headings";
import { signout } from "@lib/data/customer";
import { Button, Container } from "@medusajs/ui";
import { useContext, useEffect } from "react";
import { AccountProviderContext } from "../providers/account_provider";
import { useRouter } from "next/router";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import { isObject } from "@lib/util/isEmpty";
import { redirect } from "next/navigation";
import ContainerInner from "@levelcrush/elements/container_inner";

export default function LogoutHelper() {
  const { account } = useContext(AccountProviderContext);

  /*
  useDeepCompareEffectNoCheck(() => {
    if (isObject(account) === false) {
      signout("us", true, "/");
    }
  }, [account]); */

  useEffect(() => {
    signout("us", true, "/");
  }, []);

  function renderStillHere() {
    return (
      <ContainerInner>
        <H2>You are being logged out.</H2>
        <p className="my-4">If you are still here afer an extended period of time, please click the button below</p>
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
      </ContainerInner>
    );
  }

  return <Container className="top-[4.5rem]">{renderStillHere()}</Container>;
}
