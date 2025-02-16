import ResetPassword from "@levelcrush/account/reset_password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Level Crush",
  description: "Reset your password",
};

export default async function ResetPage() {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-transparent dark:bg-[rgba(0,0,0,.85)] flex flex-col justify-center">
          <ResetPassword />    
      </div>
    </div>
  );
}
