// Create a Providers component to wrap your application with all the components requiring 'use client', such as next-nprogress-bar or your different contexts...
'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressBarProvider = ({ children} : any) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="linear-gradient(90deg, #22D3EE, #FACC15)"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default ProgressBarProvider;