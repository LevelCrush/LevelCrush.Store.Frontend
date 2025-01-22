import { retrieveCart } from "@lib/data/cart"
import { StoreCart } from "@medusajs/types";
import CartDropdown from "@modules/layout/components/cart-dropdown";
import { useEffect, useState } from "react";

export default function CartButton() {

    const [cart, setCart] = useState(null as StoreCart | null);

    useEffect(() => {
        console.log("Attempting to get cart");
        retrieveCart().then((sessionCart) => {
            console.log("Cart retrieved", sessionCart);
            setCart(sessionCart);
        }).catch(() => {
            setCart(null);
        })
    }, []);

 // const cart = await retrieveCart().catch(() => null)

  return <CartDropdown cart={cart} />
}
