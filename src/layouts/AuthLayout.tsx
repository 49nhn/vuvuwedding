/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type PropsWithChildren } from "react";
import ChangeTheme from "~/ui/ChangeTheme";
import Head from "next/head";
import { GlobalConfig } from "~/config/GlobalConfig";

type Layout = PropsWithChildren & { title?: string }
const authStyle: React.CSSProperties = {
    backgroundImage: "url('/images/auth-bg.webp')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
};

const AuthLayout = ({ children, title = "" }: Layout) => {
    const pageTitle = `${title} | ${GlobalConfig.AppName}`
    useEffect(() => {
        console.log("Mounted");
    }, []);
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className=" flex min-h-screen flex-col items-center justify-center " style={authStyle}>
                {children}
            </main>
            <ChangeTheme />
        </>
    );
};

export default AuthLayout;
