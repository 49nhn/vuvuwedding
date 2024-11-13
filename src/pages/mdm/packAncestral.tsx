import type { NextPageWithLayout } from "~/pages/_app";
import React, { type ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "~/layouts/MainLayout";
import { api, PackAncestralInput } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";
import { type PackAncestral } from '@prisma/client'
import { Button, Input, Select, SelectItem, type SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { TopTable } from "~/components/TopTable";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MyModal } from "~/components/Modal";
import { BottomTable } from "~/components/BottomTable";
import { toast } from "react-toastify";
import AreYouSure from "~/ui/MyPopover"
import { SubmitHandler, useForm } from "react-hook-form";
import { MdmStore } from "~/store/MdmStore";

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
        key: "flowerGateType",
        label: "Flower Gate Type",
        sortable: true,
    },
    {
        key: "flower",
        label: "Flower",
        sortable: true,
    },
    {
        key: "flowerTable",
        label: "Flower Table",
        sortable: true,
    },
    {
        key: "priceStart",
        label: "Price Start",
        sortable: true,
    },
    {
        key: "priceEnd",
        label: "Price End",
        sortable: true,
    },
];
const INITIAL_VISIBLE_COLUMNS = ["name", "flowerGateType", "flower", "flowerTable", "priceStart", "priceEnd", "actions"];

const PackAncestral: NextPageWithLayout = () => {

    const [filter] = useState({});
    const [sort, setSort] = useState<{ field: string, order?: "asc" | "desc" | undefined }[]>([]);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});
    const { search, TopContent, headerColumns } = TopTable({
        columns,
        INITIAL_VISIBLE_COLUMNS,
        onAdd: () => {
            reset({
                name: "",
                priceStart: 0,
                priceEnd: 0

            });
            onOpen();
        }
    });
    const { bottomContent, setLength, page, itemPerPage } = BottomTable()

    const createItem = api.PackAncestral.create.useMutation(GlobalConfig.tanstackOption);
    const updateItem = api.PackAncestral.update.useMutation(GlobalConfig.tanstackOption);
    const deleteItem = api.PackAncestral.delete.useMutation(GlobalConfig.tanstackOption);
    const { data, isError, isLoading, refetch, isFetching } = api.PackAncestral.getList.useQuery({
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

        formState: { errors },
    } = useForm<PackAncestralInput>({
        criteriaMode: "all",
    });
    const onSubmit: SubmitHandler<PackAncestralInput> = async (data) => {
        console.log(data as PackAncestralInput)
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

    const { RenderModal, onOpen, isOpen, onClose } = MyModal({
        Content: <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full  md:flex-nowrap gap-4">
            <Input label={<p>Name <span className={"text-danger"}>*</span>
            </p>} {...register("name", { required: "Name is required", })}
                   isInvalid={Boolean(errors.name)} errorMessage={errors.name?.message} autoFocus
                   value={watch("name")}/>
            <Select label={<p>Flower Gate Type <span className={"text-danger"}>*</span></p>}
                    {...register("flowerGateType", {
                        required: "Flower Gate Type is required",
                        valueAsNumber: true,
                    })}
                    placeholder="Select a flower Gate Type..."
                    selectionMode="single"
                    onSelectionChange={(value) =>
                        reset({
                            ...watch(),
                            flowerGateType: Number(Array.from(value)[0])
                        })}
                    selectedKeys={`${watch("flowerGateType")}`}
                    items={MdmStore.Flower}
                    isInvalid={Boolean(errors.flowerGateType?.message && errors.flowerGateType)}
                    errorMessage={errors.flowerGateType?.message}>
                {item =>
                    <SelectItem key={item.id} value={item.id}>
                        {item.name}
                    </SelectItem>}
            </Select>
            <Select label={<p>Flower <span className={"text-danger"}>*</span></p>}
                    {...register("flower", {
                        required: "Flower is required",
                        valueAsNumber: true
                    })}
                    placeholder="Select a flower Gate Type..."
                    selectionMode="single"
                    onSelectionChange={(value) =>
                        reset({
                            ...watch(),
                            flower: Number(Array.from(value)[0])
                        })}
                    selectedKeys={`${watch("flower")}`}
                    items={MdmStore.Flower}
                    isInvalid={Boolean(errors.flower?.message && errors.flower)}
                    errorMessage={errors.flower?.message}>
                {item =>
                    <SelectItem key={item.id} value={item.id}>
                        {item.name}
                    </SelectItem>}
            </Select>
            <Select label={<p>Flower Table <span className={"text-danger"}>*</span></p>}  {...register("flowerTable", {
                required: "Flower Table is required",
                valueAsNumber: true
            })}
                    isInvalid={Boolean(errors.flowerTable)} errorMessage={errors.flowerTable?.message}
                    value={`${watch("flowerTable")}`}
                    placeholder="Select a flower table..."
                    selectionMode="single"
                    onSelectionChange={(value) =>
                        reset({
                            ...watch(),
                            flowerTable: Number(Array.from(value)[0])
                        })}
                    selectedKeys={`${watch("flowerTable")}`}
                    items={MdmStore.Flower}>
                {item =>
                    <SelectItem key={item.id} value={item.id}>
                        {item.name}
                    </SelectItem>}
            </Select>
            <Input label="Price Start"  {...register("priceStart", {
                required: "Price Start is required",
                valueAsNumber: true,
            })}
                   type={"number"}
                   inputMode={"decimal"}
                   endContent={<span className={"text-sm"}>triệu VNĐ </span>}
                   isInvalid={Boolean(errors.priceStart)} errorMessage={errors.priceStart?.message}
                   value={`${watch("priceStart")}`}/>
            <Input label="Price End"  {...register("priceEnd", {
                required: "Price End is required",
                valueAsNumber: true,
            })}
                   endContent={<span className={"text-sm"}>triệu VNĐ </span>}
                   type={"number"}
                   inputMode={"decimal"}
                   isInvalid={Boolean(errors.priceEnd)} errorMessage={errors.priceEnd?.message}
                   value={`${watch("priceEnd")}`}/>
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

    const renderCell = useCallback((item: PackAncestral, columnKey: React.Key) => {
        const cellValue = item[columnKey as keyof PackAncestral];
        if (columnKey === "actions")
            return (
                <div className="flex flex-row gap-2">
                    <PencilIcon className="hover:cursor-pointer" onClick={() => {
                        reset(item);
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

        if (["flowerGateType", "flower", "flowerTable"].includes(columnKey as string)) {
            return MdmStore.Flower.find((x) => x.id === cellValue)?.name;
        }
        if (columnKey === "priceStart" || columnKey === "priceEnd") {
            return <p>
                {cellValue} <span>  triệu VNĐ   </span>
            </p>
        }
        return cellValue;
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

PackAncestral.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title={"Pack Ancestral"}>
            {page}
        </MainLayout>
    )
}
export default PackAncestral

/*
 * Copyright (c) 2024. 
 * @49nhn 
 */



