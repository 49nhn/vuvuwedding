/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type PropsWithChildren } from "react";
import NavBar from "~/components/NavBar";
import ChangeTheme from "~/ui/ChangeTheme";
import Head from "next/head";
import { GlobalConfig } from "~/config/GlobalConfig";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Sidebar from "~/components/SideBar";

type Layout = PropsWithChildren & { title?: string }

const MainLayout = ({ children, title = "" }: Layout) => {
  const pageTitle = `${title} | ${GlobalConfig.AppName}`
  const router = useRouter();

  const { data, isLoading, isError } = api.Auth.me.useQuery(undefined, GlobalConfig.tanstackOption);
  useEffect(() => {
    console.log("Mounted");
  }, []);
  if (!router.isReady || isLoading) return <div>Loading...</div>
  if (isError) return void router.push('/auth/login')
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <NavBar /> */}
      <main className="flex gap-3">
        <Sidebar />
        <div className="h-screen bg-content1 shadow-small rounded-medium  dark:bg-content mx-auto flex flex-col w-full">
          <h1 className="m-4 text-sky-400 text-xl font-mono">
            {title}
          </h1>
          <div className=" items-start mx-5 ">
            {children}
          </div>
        </div>
      </main>
      <ChangeTheme />
    </>
  );
};

export default MainLayout;
