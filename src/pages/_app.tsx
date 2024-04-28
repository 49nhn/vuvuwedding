import { NextUIProvider } from "@nextui-org/react";
import { type AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { type NextPage } from "next";
import { type ReactElement, type ReactNode } from "react";
import MainLayout from "~/layouts/MainLayout";
import Page from "~/pages/index";


export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}
const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => page)
    
    return (
        getLayout(
            <NextUIProvider>
                <Component {...pageProps} />
            </NextUIProvider>
        )
    );
};


export default api.withTRPC(MyApp);
