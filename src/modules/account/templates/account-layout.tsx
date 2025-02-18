import React from "react";

import UnderlineLink from "@modules/common/components/interactive-link";

import AccountNav from "../components/account-nav";
import { HttpTypes } from "@medusajs/types";
import DiscordLink from "@levelcrush/discord_link";

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null;
  children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-transparent dark:bg-[rgba(0,0,0,.85)] flex flex-col ">
        <div className="flex flex-wrap py-12 gap-8">
          {customer ? <div className="flex-grow-0 flex-shrink-0 basis-auto w-full small:w-auto "><AccountNav customer={customer}/></div> : <></>}
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-center justify-center small:border-t border-gray-200 py-12 gap-8">
          <div>
            <h3 className="text-xl-semi mb-4">Got questions?</h3>
            <DiscordLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
