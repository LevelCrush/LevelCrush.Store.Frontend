"use client";

import { Field, Fieldset, Label, Legend } from "@headlessui/react";
import Button from "@levelcrush/elements/button";
import ContainerInner from "@levelcrush/elements/container_inner";
import { H4 } from "@levelcrush/elements/headings";
import { sdk } from "@lib/config";
import Input from "@modules/common/components/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export function FormControls(props: { message: string }) {
  const { pending } = useFormStatus();
  const disabled = props.message == "Sent!" || pending;

  return (
    <Fieldset disabled={disabled}>
      <Legend className={pending ? "text-gray-500" : ""}>
        Step 2. Enter your new password.
      </Legend>
      <Field className="my-4">
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="New Password"
            name="password"
            type="password"
            title="New password..."
            required
            data-testid="password-1"
          />
        </div>
      </Field>
      <Field className="my-4">
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Confirm New Password"
            name="passwordConfirm"
            type="password"
            title="Confirm password..."
            required
            data-testid="password-2"
          />
        </div>
      </Field>
      {props.message ? (
        <p className={props.message.includes("success") ? "text-green-500 mt-4 mb-8" : "text-yellow-400 mt-4 mb-8"}>{props.message}</p>
      ) : (
        <></>
      )}
      <Button type="submit" intention={!pending ? "normal" : "inactive"}>
        Reset password
      </Button>
    </Fieldset>
  );
}

export default function ResetPassword() {

  const [forgotRedirectTo , setForgotRedirectTo] = useState("");
  const [message, formAction] = useActionState(
    async (_currentState: unknown, formData: FormData) => {
      const password = formData.get("password") || "";
      const passwordConfirm = formData.get("passwordConfirm") || "";
      if (!password) {
        return "Please enter your new password";
      }

      if (password != passwordConfirm) {
        return "Your confirmation password does not match.";
      }

      try {
        const result = await fetch(
          `${
            process.env["NEXT_PUBLIC_MEDUSA_BACKEND_URL"]
          }/auth/customer/levelcrush-auth/update?token=${encodeURIComponent(
            (formData.get("token") as string) || ""
          )}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: ((formData.get("email") as string) || "").trim(),
              password: password,
            }),
          }
        );

        const json = await result.json();
        return json.success
          ? "Password reset successfully"
          : "Failed to reset password";
      } catch (err) {
        return `${err}`;
      }

      return "Idk I just work here. Reach out to primal or something";
    },
    null
  );

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setForgotRedirectTo(window.localStorage.getItem("forgotReturnTo") || "");
  }, []);

  return (
    <div className="w-full flex px-8 py-8 justify-center">
      <div
        className="max-w-sm w-full flex flex-col items-center justify-center"
        data-testid="reset-page"
      >
        <H4>Reset your password</H4>
        <form className="w-full my-4" action={formAction}>
          <input type="hidden" value={forgotRedirectTo} name="returnTo" />
          <input
            type="hidden"
            value={searchParams.get("token") || ""}
            name="token"
          />
          <input
            type="hidden"
            value={searchParams.get("email") || ""}
            name="email"
          />
          <FormControls message={message || ""} />
        </form>
      </div>
    </div>
  );
}
