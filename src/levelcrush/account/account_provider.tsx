"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { StoreCustomer } from "@medusajs/types";
import { retrieveCustomer } from "@lib/data/customer";

export const AccountProviderContext = createContext({
  account: null as StoreCustomer | null,
});

export function AccountProvider(props: React.PropsWithChildren<{}>) {
  const [account, setAccount] = useState(null as StoreCustomer | null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    retrieveCustomer().then((res) => {
        setAccount(res);
    }).catch((err) => {
        setAccount(null);
    }).finally(() => {
        setIsLoading(false);
    });
  }, []);

  return (
    <AccountProviderContext.Provider
      value={{
        account: account,
      }}
    >
      {props.children}
    </AccountProviderContext.Provider>
  );
}

export default AccountProvider;
