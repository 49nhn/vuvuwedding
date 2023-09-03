/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type PropsWithChildren } from "react";
import NavBar from "~/components/NavBar";
import ChangeTheme from "~/ui/ChangeTheme";
import Head from "next/head";
import { GlobalConfig } from "~/config/GlobalConfig";

type Layout = PropsWithChildren & { title?: string }

const MainLayout = ({ children, title = "" }: Layout) => {
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
      <NavBar />
      <main className=" flex min-h-screen flex-col items-center justify-center">
        {children}
      </main>
      <ChangeTheme />
    </>
  );
};

export default MainLayout;
