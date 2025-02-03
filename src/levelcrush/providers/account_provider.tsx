"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { StoreCustomer } from "@medusajs/types";
import { retrieveCustomer } from "@lib/data/customer";
import { usePathname, useSearchParams } from "next/navigation";

export type GenericCallback = () => Promise<void>;

export const AccountProviderContext = createContext({
  account: null as StoreCustomer | null,
  accountFetch: async (): Promise<void> => {},
});

export function AccountProvider(props: React.PropsWithChildren<{}>) {
  const [account, setAccount] = useState(null as StoreCustomer | null);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();



  async function fetchAccount() {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
        const acc = await retrieveCustomer("no-store");
        setAccount(acc);
    } catch(err) {
        setAccount(null);
    } finally { 
        setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [pathname, searchParams]);

  return (
    <AccountProviderContext.Provider
      value={{
        account: account,
        accountFetch: fetchAccount,
      }}
    >
      {props.children}
    </AccountProviderContext.Provider>
  );
}

export default AccountProvider;
