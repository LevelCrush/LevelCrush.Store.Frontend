"use client";

import { Dispatch, SetStateAction, useState } from "react";

import Register from "@modules/account/components/register";
import Login from "@modules/account/components/login";
import ForgotView from "@levelcrush/account/forgot_view";

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
  FORGOT = "forgot",
}

function renderView(
  currentView: string = "sign-in",
  setCurrentView: Dispatch<SetStateAction<string>>
) {
  switch (currentView) {
    case  LOGIN_VIEW.SIGN_IN:
      return <Login setCurrentView={setCurrentView} />;
    case LOGIN_VIEW.FORGOT:
      return <ForgotView setCurrentView={setCurrentView} />
  } 
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in");

  return (
    <div className="w-full flex justify-center px-8 py-8">
      {renderView(currentView, setCurrentView)}
    </div>
  );
};

export default LoginTemplate;
