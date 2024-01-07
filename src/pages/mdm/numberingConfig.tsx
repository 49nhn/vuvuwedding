import type { NextPageWithLayout } from "~/pages/_app";
import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "~/layouts/MainLayout";
import { api } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";
import { NumberingConfig } from '@prisma/client'
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger, Pagination,
    type SortDescriptor,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import { TopTable } from "~/components/TopTable";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const columns = [
    {
        key: "name",
        label: "Name",
        sortable: true,
    },
    {
        key: "prefix",
        label: "Prefix",
        sortable: true,
    },
    {
        key: "description",
        label: "Description",
        sortable: true,
    },
    {
        key: "suffix",
        label: "Suffix"
    },
    {
        key: "number",
        label: "Number",
        sortable: true,
    },
    {
        key: "actions",
        label: "Actions",
        width: 100,
    }

];
const INITIAL_VISIBLE_COLUMNS = ["name", "prefix", "description", "suffix", "number", "actions"];

const NumberingConfig: NextPageWithLayout = () => {
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({});
    const [itemPerPage, setItemPerPage] = useState<number>(10);
    const [sort, setSort] = useState<{ field: string, order?: "asc" | "desc" | undefined }[]>([]);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});
    const { search, RenderContent, headerColumns } = TopTable({
        countData: 2,
        columns,
        INITIAL_VISIBLE_COLUMNS
    })
    const { data, isError, isLoading } = api.NumberingConfig.getList.useQuery({
        page,
        itemPerPage,
        search,
        filter,
        sort
    }, GlobalConfig.tanstackOption)

    useEffect(() => {
        if (!sortDescriptor.column) return;
        // const newSort: { field: string, order?: "asc" | "desc" | undefined }[] = [...sort];
        // if (newSort.find((item) => item.field === sortDescriptor.column)) {
        //     newSort.find((item) => item.field === sortDescriptor.column)!.order = sortDescriptor.direction === "ascending" ? "asc" : "desc";
        //     setSort(newSort);
        //     return;
        // }
        // newSort.push({
        //     field: sortDescriptor.column as string,
        //     order: sortDescriptor.direction === "ascending" ? "asc" : "desc"
        // })
        setSort([{
            field: sortDescriptor.column as string,
            order: sortDescriptor.direction === "ascending" ? "asc" : "desc"
        }]);
    }, [sortDescriptor]);

    const renderCell = useCallback((item: NumberingConfig, columnKey: React.Key) => {
        const cellValue = item[columnKey as keyof NumberingConfig];
        switch (columnKey) {
            case "actions":
                return <div className="relative flex justify-end items-center gap-2">
                    <Dropdown className="bg-background border-1 border-default-200">
                        <DropdownTrigger>
                            <Button isIconOnly radius="full" size="sm" variant="light">
                                <EllipsisVerticalIcon className="text-zinc-950"/>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem>View</DropdownItem>
                            <DropdownItem>Edit</DropdownItem>
                            <DropdownItem>Delete</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            default:
                return cellValue;
        }
    }, [])

    const bottomContent = useMemo(() => {
        if (!data) return null;
        return (<div className="flex w-full items-center gap-x-3 justify-end">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={Math.ceil(data.total / itemPerPage)}
                onChange={(page) => setPage(page)}
            />
            <label className=" text-default-600 text-small">
                Rows per page:
                <select
                    className="bg-transparent outline-none text-default-600 text-small"
                    value={itemPerPage}
                    onChange={(e) => setItemPerPage(Number(e.target.value))}
                >
                    <option value="1">1</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select>
            </label>
        </div>)
    }, [page, itemPerPage, data?.total])

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error</div>;

    return (
        <div className='flex flex-col '>
            <Table aria-label="Example table with dynamic content" isCompact sortDescriptor={sortDescriptor}
                   onSortChange={setSortDescriptor}
                   topContent={RenderContent}
                   topContentPlacement="outside"
                   bottomContentPlacement={"outside"}
                   bottomContent={bottomContent}
            >
                <TableHeader columns={headerColumns}>
                    {(column) =>

                        <TableColumn allowsSorting={column.sortable}
                                     key={column.key}
                                     width={column.width}
                        >
                            {column.label}
                        </TableColumn>}
                </TableHeader>
                <TableBody items={data.data as NumberingConfig[]}>
                    {(item) => (
                        <TableRow key={item.id as number}>
                            {(columnKey) => <TableCell> {renderCell(item, columnKey)}
                            </TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

NumberingConfig.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}
export default NumberingConfig

/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

