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
        { label: "Decor", href: "#", icon: HomeIcon, current: false },
        { label: "Photo", href: "#", icon: HomeIcon, current: false },
        { label: "MakeUp", href: "#", icon: HomeIcon, current: false },
        { label: "Wedding Fruit", href: "#", icon: HomeIcon, current: false },
        { label: "User", href: "/user/1", icon: HomeIcon, current: false },
    ],
    tanstackOption: {
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    }
};