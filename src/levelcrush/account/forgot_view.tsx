"use client";

import { Field, Fieldset } from "@headlessui/react";
import Button from "@levelcrush/elements/button";
import { H4 } from "@levelcrush/elements/headings";
import { AccountProviderContext } from "@levelcrush/providers/account_provider";
import { sdk } from "@lib/config";
import { Label } from "@medusajs/ui";
import Input from "@modules/common/components/input";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFormStatus } from "react-dom";

function FormControls(props: { message: string }) {
  const { pending } = useFormStatus();
  const disabled = props.message == "Sent!" || pending;
  return (
    <Fieldset disabled={pending}>
      <Field>
        <div className="flex flex-col w-full gap-y-2">
          <Label className={pending ? "text-gray-500" : ""}>
            Step 1. Enter your email
          </Label>
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter the email address tied to the account..."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          {props.message ? <p className="text-yellow-400">{props.message}</p> : <></>}
          <Button type="submit" intention={!pending ? "normal" : "inactive"}>
            Send code to Email
          </Button>
        </div>
      </Field>
    </Fieldset>
  );
}

export default function ForgotView(props: {
  setCurrentView: Dispatch<SetStateAction<string>>;
}) {
  const [step, setStep] = useState(0);

  const [message, formAction] = useActionState(
    async (_currentState: unknown, formData: FormData) => {
      if (formData.has("email")) {
        await sdk.auth.resetPassword("customer", "levelcrush-auth", {
          identifier: formData.get("email") as string,
        });
        return "Sent!";
      } else {
        return "No email provided";
      }
    },
    null
  );

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.localStorage.setItem(
      "forgotReturnTo",
      searchParams.get("returnTo") || ""
    );
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "forgotReturnTo",
      searchParams.get("returnTo") || ""
    );
  }, [searchParams]);

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="forgot-page"
    >
      <H4>Forgot your password?</H4>
      <form className="w-full my-4" action={formAction}>
        <input
          type="hidden"
          value={searchParams.get("returnTo") || ""}
          name="returnTo"
        />
        <FormControls message={message || ""} />
      </form>
    </div>
  );
}
