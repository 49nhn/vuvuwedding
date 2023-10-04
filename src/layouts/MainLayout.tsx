/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type PropsWithChildren } from "react";
import ChangeTheme from "~/ui/ChangeTheme";
import Head from "next/head";
import { GlobalConfig } from "~/config/GlobalConfig";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Sidebar from "~/components/SideBar";
import TitlePage from "~/ui/Title";

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
      <main className="flex gap-3">
        <Sidebar />
        <div className="h-screen flex flex-col gap-y-3 w-full">
          <TitlePage titleTop={title} />
          <div className=" p-6 bg-content1 shadow-small rounded-medium w-full h-full  dark:bg-content mx-auto overflow-y-scroll ">
            {children}
          </div>
        </div>
      </main>
      <ChangeTheme />
    </>
  );
};

export default MainLayout;
