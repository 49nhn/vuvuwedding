import type { NextPageWithLayout } from "~/pages/_app";
import React, { type ReactElement, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import MainLayout from "~/layouts/MainLayout";
import { api } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";
import { Permission } from '@prisma/client'
import {
    Input,
    type SortDescriptor,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import { TopTable } from "~/components/TopTable";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MyModal } from "~/components/Modal";
import { BottomTable } from "~/components/BottomTable";
import { toast } from "react-toastify";
import AreYouSure from "~/ui/MyPopover"

const columns = [
    {
        key: "actions",
        label: "Actions",
        width: 100,
    },
    {
        key: "name",
        label: "Name",
        sortable: true,
    },
];
const INITIAL_VISIBLE_COLUMNS = ["name", "description", "permissions", "actions"];

const Permission: NextPageWithLayout = () => {
    const [dataPost, setDataPost] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {});
    const [filter] = useState({});
    const [sort, setSort] = useState<{ field: string, order?: "asc" | "desc" | undefined }[]>([]);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});
    const { search, TopContent, headerColumns } = TopTable({
        columns,
        INITIAL_VISIBLE_COLUMNS,
        onAdd: () => {
            setDataPost({
                id: undefined,
                name: "",
            })
            onOpen();
        }
    });
    const { bottomContent, setLength, page, itemPerPage } = BottomTable()

    const createItem = api.Permission.create.useMutation(GlobalConfig.tanstackOption);
    const updateItem = api.Permission.update.useMutation(GlobalConfig.tanstackOption);
    const deleteItem = api.Permission.delete.useMutation(GlobalConfig.tanstackOption);
    const { data, isError, isLoading, refetch, isFetching } = api.Permission.getList.useQuery({
        page,
        itemPerPage,
        search,
        filter,
        sort
    }, GlobalConfig.tanstackOption)

    const items = useMemo(() => {
        if (!data) return [];
        return data?.items ?? []
    }, [data, isError, isLoading]);

    useEffect(() => setLength(data?.total ?? 0), [isLoading, isFetching]);

    const { RenderModal, onOpen, isOpen } = MyModal({
        Content: <div className="flex flex-col w-full  md:flex-nowrap gap-4">
            <Input label="Name" defaultValue={dataPost?.name}
                   onValueChange={(value) => setDataPost({ name: value })}/>
        </div>,
        callBack: async () => {
            if (dataPost?.id) {
                await updateItem.mutateAsync(dataPost)
            } else {
                await createItem.mutateAsync(dataPost)
            }
            toast("Save success", { type: "success", position: "bottom-left" })
            await refetch()
        }
    })
    useEffect(() => {
        if (!sortDescriptor.column) return;
        setSort([{
            field: sortDescriptor.column as string,
            order: sortDescriptor.direction === "ascending" ? "asc" : "desc"
        }]);
    }, [sortDescriptor]);

    const renderCell = useCallback((item: Permission, columnKey: React.Key) => {
        const cellValue = item[columnKey as keyof Permission];
        switch (columnKey) {
            case "actions":
                return (
                    <div className="flex flex-row gap-2">
                        <PencilIcon className="hover:cursor-pointer" onClick={() => {
                            setDataPost(item);
                            onOpen();
                        }} width={"1.2rem"}/>
                        <AreYouSure
                            button={<TrashIcon className="hover:cursor-pointer text-danger" width={"1.2rem"}/>}
                            message={`Are you sure delete "${item.name}"?`}
                            onConfirmPopover={async () => {
                                await deleteItem.mutateAsync(item.id);
                                toast("Delete success", { type: "success", position: "bottom-left" })
                                await refetch()
                            }}
                        />
                    </div>
                )
            default:
                return cellValue;
        }
    }, [])
    const loadingState = isLoading || isFetching ? "loading" : "idle";
    if (isError) return <div>Error</div>;

    return (
        <div className='flex flex-col '>
            {isOpen && RenderModal}
            <Table aria-label="Example table with dynamic content" isCompact sortDescriptor={sortDescriptor}
                   onSortChange={setSortDescriptor}
                   isHeaderSticky
                   topContent={TopContent}
                   topContentPlacement="outside"
                   bottomContentPlacement={"outside"}
                   bottomContent={bottomContent}
            >
                <TableHeader className="flex justify-center" columns={headerColumns}>
                    {(column) =>

                        <TableColumn allowsSorting={column.sortable}
                                     key={column.key}
                                     width={column.width}
                        >
                            {column.label}
                        </TableColumn>}
                </TableHeader>
                <TableBody items={items} loadingContent={<Spinner label='Loading...'/>} loadingState={loadingState}>
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

Permission.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}
export default Permission

/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

