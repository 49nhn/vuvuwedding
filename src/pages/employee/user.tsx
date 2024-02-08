import type { NextPageWithLayout } from "~/pages/_app";
import React, { type ReactElement, ReactNode, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import MainLayout from "~/layouts/MainLayout";
import { api, UserOutput } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";
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
import MyInput from "~/ui/Input";

const columns = [
    {
        key: "actions",
        label: "Actions",
        width: 100,
    },
    { key: "fullName", label: "fullName", sortable: true },
    { key: "username", label: "username", sortable: true },
    { key: "email", label: "email", sortable: true },
    { key: "phone", label: "phone", sortable: true },
    { key: "address", label: "address", sortable: true },
    { key: "salary", label: "salary", sortable: true },
    { key: "birthday", label: "birthday", sortable: true },
    { key: "roles", label: "roles", sortable: true },

];
const INITIAL_VISIBLE_COLUMNS = ["fullName", "username", "email", "phone", "address", "salary", "birthday", "roles", "actions"];

type UserType = UserOutput[0] & {
    username: string;
    id: number;
}  | ReactNode
const User: NextPageWithLayout =
    () => {
        const [dataPost, setDataPost] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {
            username: "",
            password: "",
            fullName: "",
            email: "",
            phone: "",
            address: "",
            salary: 0,
            birthday: new Date(),
            roles: ""
        });
        const [filter, setFilter] = useState({});
        const [sort, setSort] = useState<{ field: string, order?: "asc" | "desc" | undefined }[]>([]);
        const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});
        const { search, TopContent, headerColumns } = TopTable({
            columns,
            INITIAL_VISIBLE_COLUMNS,
            onAdd: () => {
                setDataPost(null);
                onOpen();
            }
        });
        const { bottomContent, setLength, page, itemPerPage } = BottomTable()

        const createItem = api.User.create.useMutation(GlobalConfig.tanstackOption);
        const updateItem = api.User.update.useMutation(GlobalConfig.tanstackOption);
        const deleteItem = api.User.delete.useMutation(GlobalConfig.tanstackOption);
        const { data, isError, isLoading, refetch, isFetching } = api.User.getList.useQuery({
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

        // @ts-ignore
        const { RenderModal, onOpen, isOpen } = MyModal({
            Content: <div className="flex flex-col w-full  md:flex-nowrap gap-4">
                <Input label="Full Name" value={dataPost?.fullName} autoFocus
                       onValueChange={(value) => setDataPost({ fullName: value })}/>
                <Input label="Username" value={dataPost?.username} isRequired  
                       onValueChange={(value) => setDataPost({ username: value })}/>
                <Input  label="Password" value={dataPost?.password} isRequired { ...dataPost?.id ? { className: "hidden" } : {} }
                       onValueChange={(value) => setDataPost({ password: value })}/>
                <Input  label="Email" value={dataPost?.email}
                       onValueChange={(value) => setDataPost({ email: value })}/>
                <Input label="Phone" value={dataPost?.phone}
                       onValueChange={(value) => setDataPost({ phone: value })}/>
                <Input label="Address" value={dataPost?.address}
                       onValueChange={(value) => setDataPost({ address: value })}/>
                <Input label="Salary" value={dataPost?.salary} type="number" inputMode={"numeric"}
                       onValueChange={(value) => setDataPost({ salary: value })}/>
                <Input label="Birthday" value={dataPost?.birthday} type="date"
                       onValueChange={(value) => setDataPost({ birthday: new Date(value) })}/>
                <Input label="Roles" value={dataPost?.roles}
                       onValueChange={(value) => setDataPost({ roles: value })}/>
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

        const renderCell = useCallback((item: UserType, columnKey: React.Key) => {
            if (!item) return;
            const cellValue = item[columnKey as keyof UserType];
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
                                    // @ts-ignore
                                message={`Are you sure delete "${item.username}"?`}
                                onConfirmPopover={async () => {
                                    // @ts-ignore
                                    await deleteItem.mutateAsync(Number(item.id));
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
        // @ts-ignore
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

User.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title={"User"}>
            {page}
        </MainLayout>
    )
}
export default User

/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

