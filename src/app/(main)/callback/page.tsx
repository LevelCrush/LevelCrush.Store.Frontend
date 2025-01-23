import LoginHelper from "@levelcrush/account/login_helper";
import { Metadata } from "next";
import { CookiesProvider } from "next-client-cookies/server";

export const metadata: Metadata = {
  title: "Authenticate | Level Crush",
  description: "Authenticate into the level crush network",
};

export default function Login() {
  return (
    <CookiesProvider>
      <LoginHelper />
    </CookiesProvider>
  );
}
