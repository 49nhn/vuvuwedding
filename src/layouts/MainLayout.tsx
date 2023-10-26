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

  const { isLoading, isError } = api.Auth.me.useQuery(undefined, GlobalConfig.tanstackOption);
  useEffect(() => {
    console.log("Mounted");
  }, []);
  if (!router.isReady || isLoading) return <div>Loading...</div>
  if (isError) return void router.push('/auth/login')
  //
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex bg-gradient-to-t from-orange-400 to-sky-400 text-black dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black dark:text-white">
        <Sidebar />
        <div className="h-screen p-2 flex flex-col w-full ">
          <TitlePage titleTop={title} />
          <div className=" w-full h-full pt-3  mx-auto overflow-y-scroll ">
            {children}
          </div>
        </div>
      </main>
      <ChangeTheme />
    </>
  );
};

export default MainLayout;
