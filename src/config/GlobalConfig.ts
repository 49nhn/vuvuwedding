import { HomeIcon } from '@heroicons/react/20/solid'



export const GlobalConfig = {
    // ...other properties
    AppName: "VuVu Wedding",
    tanStackQuery: {
        // ...other properties
        // role: UserRole;
    },
    menuItems: [
        { label: "Home", href: "#", icon: HomeIcon, current: true },
        { label: "Content", href: "#", icon: HomeIcon, current: false },
        { label: "About", href: "#", icon: HomeIcon, current: false },
    ],
    tanstackOption: {
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        keepPreviousData: true,
        retry: false,
    }
};