/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

import { api } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";


export  const MdmApi = (page: number,
                    itemPerPage: number,
                    search: string | null,
                    filter: object,
                    sort:never[]) => {
    const {data,isLoading,isError} = api.NumberingConfig.getList.useQuery({
        page,
        itemPerPage,
        search,
        filter,
        sort,
    }, GlobalConfig.tanstackOption);
    return {data,isLoading,isError}
}