import { createContext, type PropsWithChildren, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ChangeTheme from "~/ui/ChangeTheme";
import Head from "next/head";
import { GlobalConfig } from "~/config/GlobalConfig";
import { api, AuthOutput } from "~/utils/api";
import { useRouter } from "next/router";
import { Sidebar } from "~/components/SideBar";
import TitlePage from "~/ui/Title";

type Layout = PropsWithChildren & { title?: string }

export const AuthContext = createContext<AuthOutput | undefined>(undefined);

const MainLayout = ({ children, title = "" }: Layout) => {
    const pageTitle = `${title} | ${GlobalConfig.AppName}`
    const router = useRouter();

    const { data, isLoading, isError } = api.Auth.me.useQuery(undefined, GlobalConfig.tanstackOption);

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
                className="flex h-screen bg-gradient-to-t from-orange-400 to-sky-400 text-black dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-gray-700 dark:via-gray-900 dark:to-black dark:text-white">
                <Sidebar/>
                <div className="h-full flex flex-col w-full nextui-modal-content ">
                    <TitlePage/>
                    <div className=" w-full p-3 mx-auto overflow-y-scroll ">
                        <AuthContext.Provider value={
                            data
                        }>
                            {children}
                        </AuthContext.Provider>
                    </div>
                </div>
            </main>
            <ToastContainer/>
            <ChangeTheme/>
        </>
    );
};

export default MainLayout;
