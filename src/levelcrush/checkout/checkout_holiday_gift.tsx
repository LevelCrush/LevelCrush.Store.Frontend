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
import ContainerInner from "@levelcrush/elements/container_inner";
import { H2 } from "@levelcrush/elements/headings";
import { AccountProviderContext } from "@levelcrush/providers/account_provider";
import COUNTRY_CODES from "@levelcrush/sdk/country_codes";
import { orderHolidayGift } from "@levelcrush/sdk/server_actions";
import { HOLIDAY_GIFTS_2024 } from "@levelcrush/skus";
import {
  StoreCustomer,
  StoreCustomerAddress,
  StoreRegion,
} from "@medusajs/types";
import { Button, Label, Select } from "@medusajs/ui";
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

export default function CheckoutHolidayGift(props: CheckoutHolidayGiftProps) {
  const { account } = useContext(AccountProviderContext);

  const [customer, setCustomer] = useState(props.customer);
  const [canClaim, setCanClaim] = useState(false);
  const [formState, formAction] = useActionState(requestHolidayGift, null);
  const [canEdit, setCanEdit] = useState(true);

  async function requestHolidayGift(state: unknown, formData: FormData) {
    await orderHolidayGift(formData, HOLIDAY_GIFTS_2024.ACTIVE_FOUNDER);
  }

  const [selectedAddress, setSelectedAddress] = useState(
    customer.addresses.length > 0 ? customer.addresses[0].id : ""
  );

  useDeepCompareEffectNoCheck(() => {
    setCustomer(customer);
  }, [account]);

  useEffect(() => {
    if (selectedAddress === "") {
      setCanClaim(!canEdit);
    } else {
      setCanClaim(true);
    }
  }, [selectedAddress, canEdit]);

  return (
    <ContainerInner>
      <H2>Claim Your Holiday Gift</H2>
      <p>Lorem Ipsum</p>
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
            <Fieldset className="my-4" disabled={!canEdit}>
              <Legend>Enter your shipping address</Legend>
              <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-0 gap-x-4">
                <Field>
                  <Input
                    label="First Name"
                    name="shipping_address.first_name"
                    type="text"
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
                    disabled={!canEdit}
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

            <Button
              className="mb-8"
              type="button"
              onClick={() => {
                setCanEdit(!canEdit);
              }}
            >
              {canEdit ? "Confirm" : "Edit"}
            </Button>
          </div>
        </Transition>
        <Button type="submit" disabled={!canClaim}>
          Claim!
        </Button>
      </form>
    </ContainerInner>
  );
}
