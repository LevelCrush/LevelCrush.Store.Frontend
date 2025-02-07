"use server";

import { RasputinTitlesResponse } from "@levelcrush/checkout/checkout_holiday_gift";
import { HOLIDAY_GIFTS_2024 } from "@levelcrush/skus";
import { sdk } from "@lib/config";
import {
  addToCart,
  deleteLineItem,
  getOrSetCart,
  initiatePaymentSession,
  listCartOptions,
  placeOrder,
  retrieveCart,
  setShippingMethod,
  updateCart,
} from "@lib/data/cart";
import { getAuthHeaders, getCacheTag } from "@lib/data/cookies";
import { retrieveCustomer, updateCustomer } from "@lib/data/customer";
import { listCartShippingMethods } from "@lib/data/fulfillment";
import { listCartPaymentMethods } from "@lib/data/payment";
import { listProducts } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import {
  StoreAddAddress,
  StoreCartShippingOption,
  StoreProductVariant,
  StoreShippingOption,
} from "@medusajs/types";
import ShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge";
import { match } from "assert";
import { error } from "console";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function clearCart() {
  const cart = await getOrSetCart("us");
  const items = cart.items || [];
  for (const item of items) {
    await deleteLineItem(item.id);
  }
}

export async function orderHolidayGift(formData: FormData) {
  let redirectResult = "";
  try {
    const region = await getRegion("us");
    if (!region) {
      throw new Error(`Region not found for country code: us`);
    }

    // make sure the cart is clear
    await clearCart();

    const customer = await retrieveCustomer();
    const metadata = customer?.metadata || {};
    if (!metadata["discord.id"]) {
      throw new Error("No linked discord");
    }

    if (!metadata["discord.server_member"]) {
      throw new Error("Not in discord server");
    }

    if (!metadata["bungie.id"]) {
      throw new Error("No linked bungie");
    }

    if (!metadata["bungie.clan_member"]) {
      throw new Error("Not a clan member");
    }

    let sku = "";
    if (metadata["discord.admin"] === true) {
      sku = HOLIDAY_GIFTS_2024.ACTIVE_FOUNDER;
    } else if (metadata["discord.retired"] === true) {
      sku = HOLIDAY_GIFTS_2024.RETIRED_FOUNDER;
    } else if (metadata["discord.booster"] === true) {
      sku = HOLIDAY_GIFTS_2024.SERVER_BOOSTER;
    } else {
      sku = HOLIDAY_GIFTS_2024.NORMAL;
    }

    if (!sku) {
      throw new Error("No Gift Sku could be found");
    }

    // get holiday gift skus
    /*const d2ProductRequest = await listProducts({
      countryCode: "us",
      regionId: region.id,
      queryParams: { handle: "gift-seals" },
    });

    const giftProductRequest = await listProducts({
      countryCode: "us",
      regionId: region.id,
      queryParams: { handle: "holiday-gift" },
    }); */

    console.warn("Searching for gift seals and holiday gift skus");
    const [d2ProductRequest, giftProductRequest] = await Promise.all([
      listProducts({
        countryCode: "us",
        regionId: region.id,
        queryParams: { handle: "gift-seals" },
      }),
      listProducts({
        countryCode: "us",
        regionId: region.id,
        queryParams: { handle: "holiday-gift" },
      }),
    ]);

    if (giftProductRequest.response.products.length === 0) {
      throw new Error("No Holiday Gift could be found");
    }

    if (d2ProductRequest.response.products.length === 0) {
      console.log(d2ProductRequest);
      throw new Error("No seal products found. ");
    }

    const d2Seals = d2ProductRequest.response.products[0];

    const gift = giftProductRequest.response.products[0];
    if (!gift.variants) {
      throw new Error("No varients attached");
    }

    let varientFound = false;
    let targetVarient = null as StoreProductVariant | null;
    for (const varient of gift.variants) {
      console.log(varient.sku, varient.id, sku);
      if (varient.sku === sku) {
        varientFound = true;
        targetVarient = varient;
        break;
      }
    }

    if (!varientFound) {
      throw new Error("Sku does not exist");
    }

    if (!targetVarient) {
      throw new Error("Varient is not defined");
    }

    // fresh cart always
    let cart = await getOrSetCart("us");

    console.warn("Starting rasputin request");

    const rasputinRes = await fetch(
      `${process.env["NEXT_PUBLIC_RASPUTIN"]}/member/${encodeURIComponent(
        metadata["bungie.id"] + ""
      )}/titles`,
      {
        method: "GET",
        cache: "force-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.warn("Done getting rasputin request");

    const rasputinData = (await rasputinRes.json()) as RasputinTitlesResponse;

    // testing purposes
    const seals = [];
    for (const seal of rasputinData) {
      seals.push(seal.title);
    }

    if (!d2Seals.variants) {
      throw new Error("No Variants found for D2 Gift seals");
    }

    const targetSeals = [] as StoreProductVariant[];
    for (const variant of d2Seals.variants) {
      const variantOptions = variant.options || [];
      const titleOption = variantOptions.find(
        (opt) => opt.option?.title === "Seal"
      );

      if (seals.includes(titleOption?.value || "")) {
        targetSeals.push(variant);
      }
    }

    // add overall gift variant to cart
    const actions = [] as Promise<void>[];
    actions.push(
      addToCart({
        variantId: targetVarient.id,
        quantity: 1,
        countryCode: "us",
      })
    );

    // add seals to cart
    for (const seal of targetSeals) {
      actions.push(
        addToCart({
          variantId: seal.id,
          quantity: 1,
          countryCode: "us",
        })
      );
    }

    // now determine based on pack what to add to the cart as well
    let needsKeepsake = false;
    let needsCup = false;
    let needsFounderCard = false;
    let needsRetiredFounderCard = false;
    if (sku === HOLIDAY_GIFTS_2024.SERVER_BOOSTER) {
      needsKeepsake = true;
    } else if (sku === HOLIDAY_GIFTS_2024.RETIRED_FOUNDER) {
      needsKeepsake = true;
      needsRetiredFounderCard = true;
    } else if (sku === HOLIDAY_GIFTS_2024.ACTIVE_FOUNDER) {
      needsKeepsake = true;
      needsCup = true;
      needsFounderCard = true;
    }

    if (needsKeepsake) {
      const keepsakeRequest = await listProducts({
        countryCode: "us",
        regionId: region.id,
        queryParams: { handle: "keepsake-box" },
      });

      const keepsakeProduct = (keepsakeRequest.response.products || []).at(0);
      if (!keepsakeProduct) {
        throw new Error("No keepsake could be found");
      }

      const keepsakeVariant = (keepsakeProduct.variants || []).find((v) =>
        v.sku?.endsWith("AUTO")
      );
      if (!keepsakeVariant) {
        throw new Error("No keepsake variant could be found");
      }

      actions.push(
        addToCart({
          variantId: keepsakeVariant.id,
          quantity: 1,
          countryCode: "us",
        })
      );
    }

    if (needsCup) {
      const tumblerRequest = await listProducts({
        countryCode: "us",
        regionId: region.id,
        queryParams: { handle: "tumbler" },
      });

      const tumblerProducts = tumblerRequest.response.products || [];
      if (tumblerProducts.length === 0) {
        throw new Error("No tumblers found in database");
      }
      const tumbler = tumblerProducts[0];

      // we only have one tumbler varient in stock at time of code. For now this works
      const tumblerVariant = tumbler.variants?.at(0);
      if (!tumblerVariant) {
        throw new Error("No tumbler variant found");
      }

      actions.push(
        addToCart({
          variantId: tumblerVariant.id,
          quantity: 1,
          countryCode: "us",
        })
      );
    }

    // cards
    const cardsRequest = await listProducts({
      countryCode: "us",
      regionId: region.id,
      queryParams: { handle: "membership-card" },
    });

    const cards = cardsRequest.response.products || [];
    if (cards.length === 0) {
      throw new Error("No cards could be found");
    }

    const cardVariants = cards.at(0)?.variants || [];

    const cardFounder = cardVariants.find((v) => v.sku?.endsWith("FNDR"));
    const cardRetired = cardVariants.find((v) => v.sku?.endsWith("RETF"));
    const cardStandard = cardVariants.find((v) => v.sku?.endsWith("STND"));

    if (!cardFounder) {
      throw new Error("no founder card found");
    }

    if (!cardRetired) {
      throw new Error("no retired cound found");
    }

    if (!cardStandard) {
      throw new Error("no standard card could be found");
    }

    // everyone gets the standard card
    actions.push(
      addToCart({
        variantId: cardStandard.id,
        quantity: 1,
        countryCode: "us",
      })
    );

    if (needsRetiredFounderCard) {
      actions.push(
        addToCart({
          variantId: cardRetired.id,
          quantity: 1,
          countryCode: "us",
        })
      );
    }

    if (needsFounderCard) {
      actions.push(
        addToCart({
          variantId: cardFounder.id,
          quantity: 1,
          countryCode: "us",
        })
      );
    }

    await Promise.all(actions);

    // shipping methods
    const [shippingMethods, paymentMethods] = await Promise.all([listCartShippingMethods(cart.id), listCartPaymentMethods(region.id)]);
    

    if (!shippingMethods) {
      throw new Error("No valid shipping methods");
    }

    if (!paymentMethods) {
      throw new Error("No valid payment methods");
    }

    let targetShipping = null as StoreCartShippingOption | null;
    for (const method of shippingMethods) {
      if (method.provider_id === "manual_manual") {
        targetShipping = method;
      }
    }

    if (!targetShipping) {
      throw new Error("Manual Shipping fulfillment could not be found");
    }

    const account = await retrieveCustomer();
    if (!account) {
      throw new Error("Customer account could not be found");
    }

    const selectedAddress = (formData.get("selectedAddress") as string) || "";
    if (selectedAddress.trim().length > 0 && selectedAddress !== "on") {
      const matchedAddress = account.addresses.find(
        (v) => v.id === selectedAddress
      );

      if (!matchedAddress) {
        throw new Error("No address could be matched");
      }

      // pass through our address to our form data

      formData.set(
        "shipping_address.first_name",
        matchedAddress.first_name || ""
      );
      formData.set(
        "shipping_address.last_name",
        matchedAddress.last_name || ""
      );
      formData.set("shipping_address.city", matchedAddress.city || "");
      formData.set(
        "shipping_address.address_1",
        matchedAddress.address_1 || ""
      );
      formData.set(
        "shipping_address.address_2",
        matchedAddress.address_2 || ""
      );
      formData.set("shipping_address.company", matchedAddress.company || "");
      formData.set(
        "shipping_address.postal_code",
        matchedAddress.postal_code || ""
      );
      formData.set(
        "shipping_address.country_code",
        matchedAddress.country_code || ""
      );
      formData.set("shipping_address.phone", matchedAddress.phone || "");
      formData.set("shipping_address.province", matchedAddress.province || "");
    }

    const shippingAddress = {
      first_name: formData.get("shipping_address.first_name") || "",
      last_name: formData.get("shipping_address.last_name") || "",
      address_1: formData.get("shipping_address.address_1") || "",
      address_2: formData.get("shipping_address.address_2") || "",
      company: formData.get("shipping_address.company") || "",
      postal_code: formData.get("shipping_address.postal_code") || "",
      city: formData.get("shipping_address.city") || "",
      country_code: formData.get("shipping_address.country_code") || "",
      province: formData.get("shipping_address.province") || "",
      phone: formData.get("shipping_address.phone") || "",
    } as StoreAddAddress;

    // if there is no country code make sure there is one
    shippingAddress.country_code = shippingAddress.country_code || "us";

    await updateCart({
      shipping_address: shippingAddress,
      metadata: JSON.parse(JSON.stringify(account.metadata)),
      email: account.email,
    });

    await setShippingMethod({
      cartId: cart.id,
      shippingMethodId: targetShipping.id,
    });

    // default manual fulfilment.
    await initiatePaymentSession(cart, {
      provider_id: "pp_system_default",
    });

    const result = await placeOrder(cart.id, false);
    if (typeof result === "string") {
      const metadata = customer?.metadata || {};

      metadata["gift.h24"] = true;

      // update metadata
      await updateCustomer({
        metadata,
      });

      redirectResult = result;
    }
  } catch (err) {
    return {
      success: false,
      error: err.message,
      response: {},
    };
  }

  if (redirectResult) {
    // then redirect
    redirect(redirectResult);
  }

  // if we made it this far without the redirect. Something is wrong
  const err = "Unable to place order";
  return {
    success: false,
    error: err,
    response: {},
  };
}
