import { NextUIProvider } from "@nextui-org/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {

  return (
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  );
};

export default api.withTRPC(MyApp);
