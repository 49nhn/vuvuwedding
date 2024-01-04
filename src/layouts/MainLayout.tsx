import { useEffect, type PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ChangeTheme from "~/ui/ChangeTheme";
import Head from "next/head";
import { GlobalConfig } from "~/config/GlobalConfig";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { SidebarPro } from "~/components/SideBarContext";
import TitlePage from "~/ui/Title";

type Layout = PropsWithChildren & { title?: string }

const MainLayout = ({ children, title = "" }: Layout) => {
    const pageTitle = `${title} | ${GlobalConfig.AppName}`
    const router = useRouter();

    const { isLoading, isError } = api.Auth.me.useQuery(undefined, GlobalConfig.tanstackOption);
    useEffect(() => {
        if (isError) {
            void router.push('/auth/login')
        }
    }, [isError, router])
    if (!router.isReady || isLoading) return <div>Loading...</div>
    //
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main
                className="flex bg-gradient-to-t from-orange-400 to-sky-400 text-black dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black dark:text-white">
                <SidebarPro/>
                <div className="h-screen flex flex-col w-full ">
                    <TitlePage/>
                    <div className=" w-full h-full p-3 mx-auto overflow-y-scroll ">
                        {children}
                    </div>
                </div>
            </main>
            <ToastContainer/>
            <ChangeTheme/>
        </>
    );
};

export default MainLayout;
