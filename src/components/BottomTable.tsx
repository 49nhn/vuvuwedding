/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

import React, { useMemo, useState } from "react";
import { Pagination } from "@nextui-org/react";

export const BottomTable = () => {
    const [itemPerPage, setItemPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [length, setLength] = useState<number>(0);
    const bottomContent = useMemo(() =>
        (
            <div className={"flex justify-between"}>
                <p className=" text-default-600 text-small w-full">Total: {length} record</p>
                <div className="flex w-full items-center gap-x-3 justify-end">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={Math.ceil(length / itemPerPage)}
                        onChange={(page) => setPage(page)}
                    />
                    <label className=" text-default-600 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-600 text-small"
                            value={itemPerPage}
                            onChange={(e) => setItemPerPage(Number(e.target.value))}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </label>
                </div>
            </div>), [length, page, itemPerPage])
    return {
        bottomContent,
        setLength,
        page,
        itemPerPage
    }
}
    
