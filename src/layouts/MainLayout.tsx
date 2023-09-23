/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type PropsWithChildren } from "react";
import NavBar from "~/components/NavBar";
import ChangeTheme from "~/ui/ChangeTheme";
import Head from "next/head";
import { GlobalConfig } from "~/config/GlobalConfig";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Loading from "~/ui/Loading";
import Sidebar from "~/components/Sidebar";

type Layout = PropsWithChildren & { title?: string }

const MainLayout = ({ children, title = "" }: Layout) => {
  const pageTitle = `${title} | ${GlobalConfig.AppName}`
  const router = useRouter();

  const { data, isLoading, isError } = api.Auth.me.useQuery(undefined, GlobalConfig.tanstackOption);
  useEffect(() => {
    console.log("Mounted");
  }, []);
  if (!router.isReady || isLoading) return <div className="min-h-screen"> <Loading /> </div>
  if (isError) return void router.push('/auth/login')
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-row  mx-auto gap-3">
        <Sidebar />
        <div className="basis-full w-100 mx-auto py-3 pe-3">
          {children}
        </div>
      </main>
      <ChangeTheme />
    </>
  );
};

export default MainLayout;
