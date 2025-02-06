"use client";

import {
  Field,
  Fieldset,
  Legend,
  Radio,
  RadioGroup,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { page } from "@levelcrush/cms";
import { CMSPageRecord } from "@levelcrush/cms/cms_page";
import Button from "@levelcrush/elements/button";
import ContainerInner from "@levelcrush/elements/container_inner";
import { H2, H3 } from "@levelcrush/elements/headings";
import Hero from "@levelcrush/hero";
import PortableBody from "@levelcrush/portable/portable_body";
import { AccountProviderContext } from "@levelcrush/providers/account_provider";
import COUNTRY_CODES from "@levelcrush/sdk/country_codes";
import { orderHolidayGift } from "@levelcrush/sdk/server_actions";
import { HOLIDAY_GIFTS_2024 } from "@levelcrush/skus";
import {
  StoreCustomer,
  StoreCustomerAddress,
  StoreRegion,
} from "@medusajs/types";
import { Label, Select } from "@medusajs/ui";
import AddAddress from "@modules/account/components/address-card/add-address";
import CountrySelect from "@modules/checkout/components/country-select";
import Input from "@modules/common/components/input";
import { useActionState, useContext, useEffect, useState } from "react";
import useDeepCompareEffect, {
  useDeepCompareEffectNoCheck,
} from "use-deep-compare-effect";

export interface CheckoutHolidayGiftProps {
  customer: StoreCustomer;
  region: StoreRegion;
  page: CMSPageRecord;
}

function CustomerAddress(props: {
  address?: StoreCustomerAddress;
  region: StoreRegion;
}) {
  const address = props.address || ({ id: "" } as StoreCustomerAddress);

  const lines = [];
  const line1 = (address.address_1 || "").trim();
  const line2 = (address.address_2 || "").trim();
  if (line1.length > 0) {
    lines.push(line1);
  }

  if (line2.length > 0) {
    lines.push(line2);
  }

  const street = lines.join(" ");
  const city = address.city || "";
  const province = address.province || "";
  const postalCode = address.postal_code || "";
  const countryCode = address.country_code || "";
  const country = props.region.countries?.find(
    (r) => r.iso_2 === countryCode
  )?.display_name;

  return (
    <Radio
      className="group my-4 border-white border-solid border-[1px] data-[checked]:border-yellow-400 p-4"
      value={address.id}
      as="div"
    >
      <Label className=" uppercase text-4xl">
        {props.address
          ? `${address.postal_code}, ${country || address.country_code}`
          : "New Address"}
      </Label>
      <p>
        {props.address
          ? `${street}, ${city}, ${province} ${postalCode}, ${
              country || address.country_code?.toUpperCase()
            }`
          : "Provide your address information below"}
      </p>
    </Radio>
  );
}

function determineGiftType(metadata: Record<string, string | unknown>) {
  let sku = "NONE";
  let title = "NONE";
  let includes = [
    "Your seals earned, engraved onto metal cards",
    "Black Membership Card",
  ];
  if (metadata["discord.admin"] === true) {
    sku = HOLIDAY_GIFTS_2024.ACTIVE_FOUNDER;
    title = "Active Founder";
    includes.push(
      "Red Active Founder Card",
      "30z Engraved Cup",
      "Keepsake Box"
    );
  } else if (metadata["discord.retired"] === true) {
    sku = HOLIDAY_GIFTS_2024.RETIRED_FOUNDER;
    title = "Retired Founder";
    includes.push("Blue Membership Card", "Keepsake Box");
  } else if (metadata["discord.booster"] === true) {
    sku = HOLIDAY_GIFTS_2024.SERVER_BOOSTER;
    title = "Server Booster";
    includes.push("Keepsake Box");
  } else {
    sku = HOLIDAY_GIFTS_2024.NORMAL;
    title = "Normal";
  }
  return {
    sku,
    title,
    includes,
  };
}

export default function CheckoutHolidayGift(props: CheckoutHolidayGiftProps) {
  const { account } = useContext(AccountProviderContext);

  const [customer, setCustomer] = useState(props.customer);
  const [canClaim, setCanClaim] = useState(false);
  const [formState, formAction] = useActionState(requestHolidayGift, {
    success: false,
    error: null,
    response: {},
  });
  const [successState, setSuccessState] = useState(false);
  const [targetGift, setTargetGift] = useState(
    determineGiftType(customer?.metadata || {})
  );

  async function requestHolidayGift(
    state: Record<string, unknown>,
    formData: FormData
  ) {
    return await orderHolidayGift(formData);
  }

  const [selectedAddress, setSelectedAddress] = useState(
    customer.addresses.length > 0 ? customer.addresses[0].id : ""
  );

  useDeepCompareEffectNoCheck(() => {
    setCustomer(customer);
    setTargetGift(determineGiftType(account?.metadata || {}));
  }, [account]);

  useEffect(() => {
    if (successState) {
      console.log("Success!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState]);

  useEffect(() => {
    if (formState?.success) {
      setSuccessState(true);
    }
  }, [formState]);

  return (
    <>
      {" "}
      {props.page.hero ? (
        <Hero backgroundUrl={props.page.hero}>
          <H2 className="text-yellow-400 text-6xl shadow">
            Claim your Holiday Gift!
          </H2>
        </Hero>
      ) : (
        <></>
      )}
      <ContainerInner>
        <H2>Claim Your Holiday Gift</H2>
        <PortableBody blocks={props.page.body} />
        <div className="my-8">
          <p className="my-4">
            Based off your account information. You're getting the following:{" "}
          </p>
          <H3>{targetGift.title} Gift Pack</H3>
          <p>SKU: {targetGift.sku}</p>
          <ul className="list-decimal list-inside my-4">
            {targetGift.includes.map((item, idx) => (
              <li key={`holiday_gift_includes_${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
        <form className="my-8" action={formAction}>
          <Fieldset>
            <Legend>Choose your shipping address</Legend>
            <RadioGroup
              value={selectedAddress}
              onChange={setSelectedAddress}
              aria-label="Known Addresses"
              name="selectedAddress"
            >
              {customer.addresses.map((address, addressIndex) => (
                <Field className="" key={`active_address_id_${address.id}`}>
                  <CustomerAddress address={address} region={props.region} />
                </Field>
              ))}
              <Field key={"active_address_id_new"}>
                <CustomerAddress region={props.region} />
              </Field>
            </RadioGroup>
          </Fieldset>
          <Transition
            show={selectedAddress === ""}
            appear={true}
            enter="transition-all ease-in-out duration-300 transform"
            enterFrom="transform scale-95 opacity-0 max-h-0"
            enterTo="transform scale-100 opacity-100 max-h-[30rem]"
            leave="transition-all ease-in-out duration-800 transform"
            leaveFrom="transform scale-100 opacity-100 max-h-[30rem]"
            leaveTo="transform scale-95 opacity-0 max-h-0"
          >
            <div>
              <Fieldset className="my-4">
                <Legend>Enter your shipping address</Legend>
                <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-0 gap-x-4">
                  <Field>
                    <Input
                      label="First Name"
                      name="shipping_address.first_name"
                      type="text"
                      defaultValue={account?.first_name || ""}
                      required={true}
                    ></Input>
                  </Field>
                  <Field>
                    <Input
                      label="Last Name"
                      name="shipping_address.last_name"
                      type="text"
                    ></Input>
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 my-4 gap-y-4 gap-x-4">
                  <Field>
                    <Input
                      label="Address"
                      name="shipping_address.address_1"
                      required={true}
                      autoComplete="address-line-1"
                      data-testid="address-1-input"
                    />
                  </Field>
                  <Field>
                    <Input
                      label="Apartment, suite, etc."
                      name="shipping_address.address_2"
                      autoComplete="address-line-2"
                      data-testid="address-2-input"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 my-4 gap-y-4 gap-x-4">
                  <Field>
                    <Input
                      label="City"
                      name="shipping_address.city"
                      required={true}
                      autoComplete="address-city"
                      data-testid="address-city-input"
                    />
                  </Field>
                  <Field>
                    <Input
                      label="Postal Code"
                      name="shipping_address.postal_code"
                      autoComplete="address-postal"
                      data-testid="address-postal"
                      required={true}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 my-4 gap-y-4 gap-x-4">
                  <Field>
                    <Input
                      label="Province / State"
                      name="shipping_address.province"
                      autoComplete="address-level1"
                      data-testid="state-input"
                 
                      required={true}
                    />
                  </Field>
                  <Field>
                    <Select
                      name="shipping_address.country_code"
                      defaultValue="us"
                    >
                      <Select.Trigger className="h-[100%]">
                        <Select.Value placeholder="Country" />
                      </Select.Trigger>
                      <Select.Content>
                        {Object.keys(COUNTRY_CODES).map((code, idx) => (
                          <Select.Item
                            key={`country_code_claim_form_${code}`}
                            value={code.toLowerCase()}
                          >
                            {COUNTRY_CODES[code]}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Field>
                </div>
              </Fieldset>
              <div className="">
                {formState.error && (
                  <div
                    className="text-rose-500 text-small-regular py-2"
                    data-testid="address-error"
                  >
                    {formState.error}
                  </div>
                )}
              </div>
            </div>
          </Transition>
          <div className="w-auto md:max-w-[10rem] lg:max-w-[10rem]">
            <Button type="submit" intention={"normal"}>
              Claim!
            </Button>
          </div>
        </form>
      </ContainerInner>
    </>
  );
}
