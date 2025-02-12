"use client";

import Summary from "@modules/cart/templates/summary";
import ItemsTemplate from "@levelcrush/cart/items";
import EmptyCartMessage from "@modules/cart/components/empty-cart-message";
import SignInPrompt from "@modules/cart/components/sign-in-prompt";
import Divider from "@modules/common/components/divider";
import { HttpTypes } from "@medusajs/types";
import { useContext, useState } from "react";
import { CartProviderContext } from "@levelcrush/providers/cart_provider";
import { AccountProviderContext } from "@levelcrush/providers/account_provider";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";

const CartTemplate = () => {
  const {cart} = useContext(CartProviderContext);
  const {account} = useContext(AccountProviderContext);
  const [targetCart, setCart] = useState(cart);

  useDeepCompareEffectNoCheck(() => {
    setCart(targetCart);
  }, [cart]);

  if(!cart) {
    return <></>;
  }


  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-transparent py-6 gap-y-6">
              {!account && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={targetCart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-transparent py-6">
                      <Summary cart={targetCart as any} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTemplate;
