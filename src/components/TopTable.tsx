/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

import React, { useMemo, useState } from "react";
import {  Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Selection } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { SearchIcon } from "@nextui-org/shared-icons";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";

export const TopTable = ({ columns, INITIAL_VISIBLE_COLUMNS, onAdd }: {
    columns: { key: string, label: string, sortable?: boolean, width?: number }[],
    INITIAL_VISIBLE_COLUMNS: string[],
    onAdd: () => void,

}) => {
    const [search, setSearch] = useState<string|undefined>(undefined);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
    }, [visibleColumns]);
    const TopContent = useMemo(() => <div className='flex justify-between items-center'>
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
                <Button color="primary" onPress={onAdd}> New <PlusIcon/> </Button>
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
        , [search, visibleColumns])
    return {
        TopContent,
        search,
        headerColumns
    }
}
    
