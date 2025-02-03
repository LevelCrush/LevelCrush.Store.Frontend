"use server";

import { HOLIDAY_GIFTS_2024 } from "@levelcrush/skus";
import { sdk } from "@lib/config";
import {
  addToCart,
  getOrSetCart,
  initiatePaymentSession,
  listCartOptions,
  placeOrder,
  retrieveCart,
  setShippingMethod,
  updateCart,
} from "@lib/data/cart";
import { getAuthHeaders, getCacheTag } from "@lib/data/cookies";
import { retrieveCustomer } from "@lib/data/customer";
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
import { revalidateTag } from "next/cache";

export async function orderHolidayGift(formData: FormData, sku: string) {
  const region = await getRegion("us");
  if (!region) {
    throw new Error(`Region not found for country code: us`);
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  // get holiday gift skus
  const d2ProductRequest = await listProducts({
    countryCode: "us",
    regionId: region.id,
    queryParams: { handle: "gift-seals" },
  });

  const giftProductRequest = await listProducts({
    countryCode: "us",
    regionId: region.id,
    queryParams: { handle: "holiday-gift" },
  });

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

  // testing purposes
  const seals = [
    "Conqueror",
    "BRAVE",
    "Dredgen",
    "Flamekeeper",
    "WANTED",
    "Wishbearer",
  ];

  if (!d2Seals.variants) {
    throw new Error("No Variants found for D2 Gift seals");
  }

  const targetSeals = [] as StoreProductVariant[];
  for (const variant of d2Seals.variants) {
    if (seals.includes(variant.title || "")) {
      targetSeals.push(variant);
    }
  }

  // add overall gift variant to cart
  await addToCart({
    variantId: targetVarient.id,
    quantity: 1,
    countryCode: "us",
  });

  // add seals to cart
  for (const seal of targetSeals) {
    await addToCart({
      variantId: seal.id,
      quantity: 1,
      countryCode: "us",
    });
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

    addToCart({
      variantId: keepsakeVariant.id,
      quantity: 1,
      countryCode: "us",
    });
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

    addToCart({
      variantId: tumblerVariant.id,
      quantity: 1,
      countryCode: "us",
    });
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
  addToCart({
    variantId: cardStandard.id,
    quantity: 1,
    countryCode: "us",
  });

  if (needsRetiredFounderCard) {
    addToCart({
      variantId: cardRetired.id,
      quantity: 1,
      countryCode: "us",
    });
  }

  if (needsFounderCard) {
    addToCart({
      variantId: cardFounder.id,
      quantity: 1,
      countryCode: "us",
    });
  }

  // shipping methods
  const shippingMethods = await listCartShippingMethods(cart.id);
  const paymentMethods = await listCartPaymentMethods(region.id);

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
  console.warn("SELECTED ADDRESS: ", selectedAddress);
  if (selectedAddress.trim().length > 0 && selectedAddress !== "on") {

    console.log("Address", selectedAddress);
    const matchedAddress = account.addresses.find(
      (v) => v.id === selectedAddress
    );

    if (!matchedAddress) {
      throw new Error("No address could be matched");
    }

    console.warn("MATCHED ADDRESS", matchedAddress);

    // pass through our address to our form data

    formData.set(
      "shipping_address.first_name",
      matchedAddress.first_name || ""
    );
    formData.set("shipping_address.last_name", matchedAddress.last_name || "");
    formData.set("shipping_address.city", matchedAddress.city || "");
    formData.set("shipping_address.address_1", matchedAddress.address_1 || "");
    formData.set("shipping_address.address_2", matchedAddress.address_2 || "");
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

  console.warn("FORM DATA", formData);

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

  console.warn("Updating cart with SHIPPING");
  console.warn(shippingAddress);

  // if there is no country code make sure there is one
  shippingAddress.country_code = shippingAddress.country_code || "us";

  await updateCart({
    shipping_address: shippingAddress,
    metadata: JSON.parse(JSON.stringify(account.metadata)),
    email: account.email,
  });

  console.warn("Setting shipping", targetShipping);

  await setShippingMethod({
    cartId: cart.id,
    shippingMethodId: targetShipping.id,
  });

  // default manual fulfilment.
  await initiatePaymentSession(cart, {
    provider_id: "pp_system_default",
  });

  console.log("Placing Order for cart", cart.id);
  await placeOrder(cart.id);

  console.log("Done placing order!");
}
