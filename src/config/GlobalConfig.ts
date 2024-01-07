import { HomeIcon } from '@heroicons/react/20/solid'


export const GlobalConfig = {
    // ...other properties
    apiPath: "http://localhost:3000/api/trpc",
    AppName: "VuVu Wedding",
    tanStackQuery: {
        // ...other properties
        // role: UserRole;
    },

    tanstackOption: {
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        keepPreviousData: true,
        retry: false,
    },
    
}



// @ts-ignore



