"use client";

import { retrieveCart } from "@lib/data/cart";
import { StoreCart } from "@medusajs/types";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const CartProviderContext = createContext({
  cart: null as StoreCart | null,
  updateCart: async (): Promise<void> => {},
});

export default function CartProvider(props: React.PropsWithChildren<{}>) {
  const [cart, setCart] = useState(null as StoreCart | null);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  async function updateCart() {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const newCart = await retrieveCart();
      setCart(newCart);
    } catch (err) {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    updateCart();
  }, []);

  useEffect(() => {
    updateCart();
  }, [pathname, searchParams]);

  return (
    <CartProviderContext.Provider
      value={{
        cart: cart,
        updateCart: updateCart,
      }}
    >
      {props.children}
    </CartProviderContext.Provider>
  );
}
