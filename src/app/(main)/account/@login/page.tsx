import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Login to the Level Crush network",
}

export default function Login() {
  
  // lol for now this is it.
  // eventuially itll be good to implement the client side logic on this page
  // so it happens automatically
  //notFound();

  return <LoginTemplate />
}
