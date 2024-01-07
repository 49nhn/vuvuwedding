/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

import React, { useMemo, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Selection } from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export const TopTable = ({ countData, columns, INITIAL_VISIBLE_COLUMNS }: {
    countData: number,
    columns: { key: string, label: string, sortable?: boolean, width?: number }[],
    INITIAL_VISIBLE_COLUMNS: string[]

}) => {
    const [search, setSearch] = useState<string>("");
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
    }, [visibleColumns]);
    const RenderContent = useMemo(() => <div className='flex justify-between items-center'>
            <Input
                isClearable
                classNames={{
                    base: "w-fit sm:max-w-[44%] ",
                    input: "text-default-600 text-small"
                }}
                placeholder="Search by name..."
                size="sm"
                startContent={<SearchIcon width={14}/>}
                value={search}
                variant="faded"
                onClear={() => setSearch("")}
                onValueChange={(value) => setSearch(value)}
            />
            <div className="flex gap-x-3 h-full ">
                <Dropdown>
                    <DropdownTrigger className="hidden sm:flex">
                        <Button
                            endContent={<ChevronDownIcon width={16}/>}
                            size="md"
                            variant="flat"
                        >
                            Columns
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={false}
                        selectedKeys={visibleColumns}
                        selectionMode="multiple"
                        onSelectionChange={setVisibleColumns}
                    >
                        {columns.map((column) => (
                            <DropdownItem key={column.key} className="capitalize">
                                {(column.label)}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
                
            </div>
        </div>
        , [search, countData,  visibleColumns])
    return {
        RenderContent,
        search,
        headerColumns
    }
}
    
