import { CartProviderContext } from "@levelcrush/providers/cart_provider";
import { retrieveCart } from "@lib/data/cart";
import { StoreCart } from "@medusajs/types";
import CartDropdown from "@modules/layout/components/cart-dropdown";
import { useContext, useEffect, useState } from "react";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";

export default function CartButton() {

  const { cart} = useContext(CartProviderContext);
  const [targetCart, setCart] = useState(cart);
    

  /*
  useDeepCompareEffectNoCheck(() => {
    setCart(targetCart);
  }, [cart]);    */


  // const cart = await retrieveCart().catch(() => null)

  return <CartDropdown cart={cart} />;
}
