"use client";

import AccountButton from "@levelcrush/account/account_button";
import { H2, H3, H4 } from "@levelcrush/elements/headings";
import { AccountProviderContext } from "@levelcrush/providers/account_provider";
import { login } from "@lib/data/customer";
import { LOGIN_VIEW } from "@modules/account/templates/login-template";
import ErrorMessage from "@modules/checkout/components/error-message";
import { SubmitButton } from "@modules/checkout/components/submit-button";
import Input from "@modules/common/components/input";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { useActionState, useContext } from "react";

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void;
};

const Login = ({ setCurrentView }: Props) => {
  const { account, accountFetch } = useContext(AccountProviderContext);
  const [message, formAction] = useActionState(
    async (_currentState: unknown, formData: FormData) => {
      const res = await login(_currentState, formData);
      await accountFetch();
      return res;
    },
    null
  );

  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Hey there bud.</h1>
      <p className="text-center text-base-regular text-ui-fg-base my-4">
        Sign in to the Level Crush network.
      </p>
      <AccountButton type="discord" />

      <hr className="mt-4 border-b-[1px] w-full" />
      <H4 className="my-4">Login with email</H4>
      <form className="w-full" action={formAction}>
        <input
          type="hidden"
          value={searchParams.get("returnTo") || ""}
          name="returnTo"
        />
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          Sign in
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Forgot password?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.FORGOT)}
          className="underline"
          data-testid="forgot-button"
        >
          Reset it
        </button>
      </span>
    </div>
  );
};

export default Login;
