import type { NextPageWithLayout } from "~/pages/_app";
import React, { type ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "~/layouts/MainLayout";
import { api, type UserInput, UserOutput, } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";
import { Button, Input, Select, SelectItem, type SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { TopTable } from "~/components/TopTable";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MyModal } from "~/components/Modal";
import { BottomTable } from "~/components/BottomTable";
import { toast } from "react-toastify";
import AreYouSure from "~/ui/MyPopover"
import { SubmitHandler, useForm } from "react-hook-form";

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
    { key: "roles", label: "roles" },

];
const INITIAL_VISIBLE_COLUMNS = ["fullName", "username", "email", "phone", "address", "salary", "birthday", "roles", "actions"];

const User: NextPageWithLayout = () => {
    const [filter, setFilter] = useState({});
    const [sort, setSort] = useState<{ field: string, order?: "asc" | "desc" | undefined }[]>([]);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});
    const { search, TopContent, headerColumns } = TopTable({
        columns,
        INITIAL_VISIBLE_COLUMNS,
        onAdd: () => {
            reset({
                username: "",
                password: "",
                fullName: "",
                email: "",
                phone: "",
                address: "",
                salary: 0,
            });
            onOpen();
        }
    });
    const { bottomContent, setLength, page, itemPerPage } = BottomTable()

    //Region API
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

    //Region Form
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<UserInput & { username: string, password: string, birthday: string }>({
        criteriaMode: "all",
    });
    const onSubmit: SubmitHandler<UserInput & { username: string, password: string }> = async (dataForm) => {

        const birthday = new Date(dataForm.birthday ?? new Date())
        if (dataForm?.id) {
            await updateItem.mutateAsync({
                ...dataForm,
                birthday
            }).catch((error) => {
                toast(error.message, { type: "error", position: "bottom-left" })
                throw new Error(error.message)
            })
        } else {
            await createItem.mutateAsync({
                ...dataForm,
                birthday
            }).catch((error) => {
                toast(error.message, { type: "error", position: "bottom-left" })
                throw new Error(error.message)
            })
        }
        toast("Save success", { type: "success", position: "bottom-left" })
        await refetch()
        onClose()
    };

    //Region Modal
    const { RenderModal, onOpen, isOpen, onClose } = MyModal({
        Content: <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full  md:flex-nowrap gap-4">
            <Input label="Full Name" {...register("fullName")} value={watch("fullName") ?? ""} autoFocus/>
            <Input label="Username" {...register("username", { required: "Username is required", })}
                   isInvalid={Boolean(errors.username)} errorMessage={errors.username?.message}
                   value={watch("username")}/>
            <Input label="Password" {...register("password")} value={watch("password") ?? ""}
                   {...watch("id") ? { className: "hidden" } : {}}            />
            <Input label="Email" {...register("email")} value={watch("email") ?? ""}/>
            <Input label="Phone" {...register("phone")} value={watch("phone") ?? ""}/>
            <Input label="Address" {...register("address")} value={watch("address") ?? ""}/>
            <Input label="Salary" {...register("salary", { valueAsNumber: true })}
                   value={`${watch("salary")}`} type="number" inputMode={"numeric"}/>
            <Input label="Birthday" {...register("birthday",
            )}
                   max={new Date().toISOString().split("T")[0]}
                   min={new Date(1900, 1, 1).toISOString().split("T")[0] ?? ""}
                   value={`${watch("birthday")}`} type="date"/>
            <Select label="Roles"
                    items={api.Role.getList.useQuery().data?.items}
                    placeholder="Select a role..."
                    selectionMode="multiple"
                    onSelectionChange={(value) => {
                        const roles = Array.from(value).map((role) => role.toString())
                        setValue("roles", roles)
                    }}
                    selectedKeys={watch("roles")?.map((role) => role.toString())}>
                {item =>
                    <SelectItem key={item.name} value={item.name}>
                        {item.name}
                    </SelectItem>}
            </Select>
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

    //Region Table
    const renderCell = useCallback((item: UserOutput, columnKey: React.Key): ReactNode => {
        if (!item) return;
        const cellValue = item[columnKey as keyof UserOutput];
        switch (columnKey) {
            case "actions":
                return (
                    <div className="flex flex-row gap-2">
                        <PencilIcon className="hover:cursor-pointer" onClick={() => {
                            reset({
                                id: item.id,
                                username: item.username,
                                fullName: item.fullName,
                                email: item.email,
                                phone: item.phone,
                                address: item.address,
                                salary: item.salary,
                                // @ts-ignore
                                birthday: item.birthday?.toISOString().split("T")[0] ?? undefined,
                                roles: item.roles ? item.roles.map((role) => role.name) : []
                            });
                            onOpen();
                        }} width={"1.2rem"}/>
                        <AreYouSure
                            button={<TrashIcon className="hover:cursor-pointer text-danger" width={"1.2rem"}/>}
                            message={`Are you sure delete "${item.username}"?`}
                            onConfirmPopover={async () => {
                                await deleteItem.mutateAsync(item.id).catch((error) => {
                                    toast(error.message, { type: "error", position: "bottom-left" })
                                    throw new Error(error.message)
                                });
                                toast("Delete success", { type: "success", position: "bottom-left" })
                                await refetch()
                            }}
                        />
                    </div>
                )
            case "birthday":
                return item.birthday?.toLocaleDateString("vi-VN");
            case "roles":
                return (cellValue as UserOutput["roles"]).map((role) => role.name).join(", ")
            default:
                return cellValue as ReactNode;
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

