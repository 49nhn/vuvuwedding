import type { NextPageWithLayout } from "~/pages/_app";
import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "~/layouts/MainLayout";
import { api, PermissionInput } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";
import { type Permission } from '@prisma/client'
import { Input, type SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { TopTable } from "~/components/TopTable";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MyModal } from "~/components/Modal";
import { BottomTable } from "~/components/BottomTable";
import { toast } from "react-toastify";
import AreYouSure from "~/ui/MyPopover"
import { Button } from "@nextui-org/button";
import { SubmitHandler, useForm } from "react-hook-form";

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
    {
        key: "description",
        label: "Description",
        sortable: true,
    },
];
const INITIAL_VISIBLE_COLUMNS = ["name", "description", "permissions", "actions"];

const Permission: NextPageWithLayout = () => {
    const [filter] = useState({});
    const [sort, setSort] = useState<{ field: string, order?: "asc" | "desc" | undefined }[]>([]);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});
    const { search, TopContent, headerColumns } = TopTable({
        columns,
        INITIAL_VISIBLE_COLUMNS,
        onAdd: () => {
            reset({
                id: undefined,
                name: "",
            });
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
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<PermissionInput>({
        criteriaMode: "all",
    });
    const onSubmit: SubmitHandler<PermissionInput> = async (data) => {
        if (data?.id) {
            await updateItem.mutateAsync(data).catch((error) => {
                toast(error.message, { type: "error", position: "bottom-left" })
                throw new Error(error.message)
            })
        } else {
            await createItem.mutateAsync(data).catch((error) => {
                toast(error.message, { type: "error", position: "bottom-left" })
                throw new Error(error.message)
            })
        }
        toast("Save success", { type: "success", position: "bottom-left" })
        await refetch()
        onClose()
    };
    const items = useMemo(() => {
        if (!data) return [];
        return data?.items ?? []
    }, [data, isError, isLoading]);

    useEffect(() => setLength(data?.total ?? 0), [isLoading, isFetching]);

    const { RenderModal, onOpen, isOpen, onClose } = MyModal({
        title: "Permission",
        Content: <form className="flex flex-col w-full  md:flex-nowrap gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input label={<p>Name <span className={"text-danger"}>*</span></p>}
                   {...register("name", {
                       required: "Name is required",
                   })}
                   isInvalid={Boolean(errors.name)} errorMessage={errors.name?.message}
                   value={watch("name")}/>
            <div className={"flex items-end justify-end gap-x-3"}>
                <Button color="default" className={"w-fit item"} onPress={() => onClose()}>Cancel</Button>
                <Button color="primary" className={"w-fit item"} type="submit">Save</Button>
            </div>
        </form>,
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
                            reset({
                                id: item.id,
                                name: item.name,
                            });
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
                        <TableRow key={item.id}>
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

