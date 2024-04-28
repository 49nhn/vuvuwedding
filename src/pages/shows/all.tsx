import type { NextPageWithLayout } from "~/pages/_app";
import React, { ReactElement, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import MainLayout, { AuthContext } from "~/layouts/MainLayout";
import { api, ShowsInput, ShowsOutput, } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";
import { Accordion, AccordionItem, Button, Card, CardBody, Input, Select, SelectItem, type SortDescriptor, Spacer, Spinner, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@nextui-org/react";
import { TopTable } from "~/components/TopTable";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MyModal } from "~/components/Modal";
import { BottomTable } from "~/components/BottomTable";
import { toast } from "react-toastify";
import AreYouSure from "~/ui/MyPopover"
import { SubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "@nextui-org/input";
import { ShowStore } from "~/store/ShowStore";
import { MdmStore } from "~/store/MdmStore";

const columns = [
    {
        key: "actions",
        label: "Actions",
        width: 100,
    },
    { key: "title", label: "Title", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "price", label: "Price", sortable: true },
    { key: "book", label: "Book", sortable: true },
    { key: "salesMan", label: "SalesMan", sortable: true },

];
const INITIAL_VISIBLE_COLUMNS = ["title", "date", "price", "book", "salesMan", "actions"];

const All: NextPageWithLayout = () => {
    const [filter, setFilter] = useState({});
    const [countDecor, setCountDecor] = useState(1);
    const currentUser = useContext(AuthContext);
    const [sort, setSort] = useState<{ field: string, order?: "asc" | "desc" | undefined }[]>([]);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});
    const { search, TopContent, headerColumns } = TopTable({
        columns,
        INITIAL_VISIBLE_COLUMNS,
        onAdd: () => {
            reset({
                createdBy: currentUser?.username,
                title: "Title",
            });

            onOpen();
        }
    });
    const { bottomContent, setLength, page, itemPerPage } = BottomTable()

    //Region API
    const createItem = api.Shows.create.useMutation(GlobalConfig.tanstackOption);
    const updateItem = api.Shows.update.useMutation(GlobalConfig.tanstackOption);
    const deleteItem = api.Shows.delete.useMutation(GlobalConfig.tanstackOption);
    const { data, isError, isLoading, refetch, isFetching } = api.Shows.getList.useQuery({
        page,
        itemPerPage,
        search,
        filter,
        sort
    }, GlobalConfig.tanstackOption)
    const salesMan = api.User.getList.useQuery({
        page,
        itemPerPage,
        search,
        filter,
        sort
    }, GlobalConfig.tanstackOption).data?.items ?? []
    const packAncestral = api.PackAncestral.getList.useQuery({
        page,
        itemPerPage,
        search,
        filter,
        sort
    }, GlobalConfig.tanstackOption).data?.items ?? []
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
    } = useForm<ShowsInput & { createdBy: string | undefined, id: number | undefined }>({
        criteriaMode: "all",
    });
    const onSubmit: SubmitHandler<ShowsInput> = async (dataForm) => {
        console.log(watch())
        await createItem.mutateAsync(dataForm).catch((error) => {
            toast(error.message, { type: "error", position: "bottom-left" })
            throw new Error(error.message)
        })
        toast("Save success", { type: "success", position: "bottom-left" })
        // await refetch()
        // onClose()
    };

    const RenderFormDecorations = (): ReactNode => {
        return Array.from({ length: countDecor }).map((_, index) =>
            (
                <Accordion defaultExpandedKeys={"all"} key={index} isCompact>
                    <AccordionItem title={`Decoration ${index} -  ${watch(`decorations.${index}.title`)} `} key={index}>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 flex flex-col gap-2">
                                <Input label="title" {...register(`decorations.${index}.title`)}
                                       value={watch(`decorations.${index}.packAncestralId`) ? `${watch(`decorations.${index}.title`)}  - ${watch(`decorations.${index}.dateShowStart`)} / ${packAncestral.find(item => item.id == watch(`decorations.${index}.packAncestralId`))?.name} / ${watch(`decorations.${index}.price`)}` : ''}/>
                                <Textarea label="Description" {...register(`decorations.${index}.description`)}
                                          minRows={4} maxRows={7}/>

                                <div className="flex gap-2">
                                    <Select label={<p>Ceremony Type <span className={"text-danger"}>*</span></p>}
                                            {...register(`decorations.${index}.ceremonyType`, {
                                                setValueAs: (value) => {
                                                    return Number(value)
                                                }
                                            })}
                                            placeholder="Select ceremony type..."
                                            selectionMode="single"
                                            onSelectionChange={(value) => {
                                                if (Array.from(value).map((item) => Number(item))[0] === 2) {
                                                    setValue(`decorations.${index}.title`, ` ${watch(`brideName`)} - ${watch(`groomName`)} / ${MdmStore.CeremonyType.find((item) => item.id === Array.from(value).map((item) => Number(item))[0])?.name}`)
                                                } else {
                                                    setValue(`decorations.${index}.title`, ` ${watch(`groomName`)} - ${watch(`brideName`)} / ${MdmStore.CeremonyType.find((item) => item.id === Array.from(value).map((item) => Number(item))[0])?.name}`)
                                                }
                                            }}
                                            items={MdmStore.CeremonyType}
                                            isInvalid={Boolean(errors.decorations?.message && errors.decorations)}
                                            errorMessage={errors.decorations?.message}>
                                        {item =>
                                            <SelectItem key={item.id} value={item.id}>
                                                {item.name}
                                            </SelectItem>}
                                    </Select>
                                    <Select datatype={"Number"}
                                            label={<p>Pack Ancestral <span className={"text-danger"}>*</span></p>}
                                            {...register(`decorations.${index}.packAncestralId`, {
                                                setValueAs: (value) => {
                                                    return Number(value)
                                                }
                                            })}
                                            placeholder="Select a Pack Ancestral..."
                                            selectionMode="single"
                                            items={packAncestral}
                                    >
                                        {item =>
                                            <SelectItem key={item.id} value={item.id}>
                                                {`${item.name} `}
                                            </SelectItem>}
                                    </Select>
                                    <Input label="Date" type="date" {...register(`decorations.${index}.dateShowStart`)}
                                           onValueChange={(value) => {
                                               console.log(value)
                                           }}
                                    />
                                    <Input label="Price"
                                           type="number" {...register(`decorations.${index}.price`, {
                                        valueAsNumber: true,
                                    })} />
                                </div>
                            </div>
                            <h3 className="col-span-2 font-bold">
                                Information
                            </h3>
                            <div className={"flex flex-col gap-2"}>
                                <Input label="Tone rèm" {...register(`decorations.${index}.tone_rem`)}/>
                                <Input label="Tone hoa" {...register(`decorations.${index}.tone_hoa`)}/>
                                <Input label="Số phông" {...register(`decorations.${index}.so_phong`)}/>
                                <Input label="Bàn ghế" {...register(`decorations.${index}.ban_ghe`)}/>
                                <Input label="Bàn thờ" {...register(`decorations.${index}.ban_tho`)}/>
                                <Input label="Trụ quả" {...register(`decorations.${index}.tru_qua`)}/>
                                <Input label="Khung" {...register(`decorations.${index}.khung`)}/>
                                <Input label="Cổng" {...register(`decorations.${index}.cong`)}/>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <Input label="Chử Hỷ" {...register(`decorations.${index}.chu_hy`)}/>
                                <Input
                                    label="Chai nước / Đĩa bánh / Ly tách  " {...register(`decorations.${index}.chai_nuoc`)}/>
                                <Input label="Cắm hoa" {...register(`decorations.${index}.cam_hoa`)}/>
                                <Input label="Đèn" {...register(`decorations.${index}.den`)}/>
                                <Input label=" Trải bàn" {...register(`decorations.${index}.trai_ban`)}/>
                                <Input label="Lưng ghế" {...register(`decorations.${index}.lung_ghe`)}/>
                                <Input label="Rạp/ dù / Quạt" {...register(`decorations.${index}.rap`)}/>
                                <Input label="Bàn tròn" {...register(`decorations.${index}.ban_tron`)}/>
                            </div>
                        </div>
                    </AccordionItem>
                </Accordion>
            ))
    }

    //Region Modal
    const { RenderModal, onOpen, isOpen, onClose } = MyModal({
        Content: <form onSubmit={handleSubmit(onSubmit)} className="static md:flex-nowrap gap-4">
            <div className="grid grid-cols-3 gap-3  ">
                <h2 className={"col-span-3 text-xl font-semibold"}>
                    Information
                </h2>
                <div className={"flex flex-col gap-2"}>
                    <Input label="Groom Name" value={watch("groomName")} {...register("groomName")}  />
                    <Input label="Groom Phone" value={watch("groomPhone")} {...register("groomPhone")} />
                    <Input label="Groom Address" value={watch("groomAddress")} {...register("groomAddress")} />
                    <Input label="Title" value={watch("title")} {...register("title")} />
                </div>
                <div className={"flex flex-col gap-2"}>
                    <Input label="Bride Name" value={watch("brideName")} {...register("brideName")} />
                    <Input label="Bride Phone" value={watch("bridePhone")} {...register("bridePhone")} />
                    <Input label="Bride Address" value={watch("brideAddress")} {...register("brideAddress")} />
                    <Textarea label="Description" value={watch("description")} {...register("description")} minRows={4}
                              maxRows={7}/>

                </div>
                <div className={"flex flex-col gap-2"}>
                    <Select label={<p>Salesman <span className={"text-danger"}>*</span></p>}
                            placeholder="Select a Salesman..."
                            selectionMode="multiple"
                            items={salesMan}
                            isInvalid={Boolean(errors.saleManId?.message && errors.saleManId)}
                            onSelectionChange={(value) => setValue("saleManId", Array.from(value).map((item) => Number(item)))}
                            errorMessage={errors.saleManId?.message}>
                        {item =>
                            <SelectItem key={item.id} value={item.id}>
                                {`${item.username} - ${item.fullName}`}
                            </SelectItem>}
                    </Select>
                    <Input label="Creator Name" value={watch("createdBy")} {...register("createdBy")}
                           defaultValue={watch("createdBy")} readOnly/>
                    <Input label="Other Contact" value={watch("otherContact")} {...register("otherContact")} />
                    <div className={"flex gap-x-1"}>
                        <Select label={<p>Status <span className={"text-danger"}>*</span></p>}
                                value={watch("status")} {...register("status", {
                            valueAsNumber: true,
                        })}
                                placeholder="Select status..."
                                selectionMode="single"
                                items={ShowStore.Status}
                                defaultSelectedKeys={[0]}
                                onSelectionChange={(value) =>
                                    reset({
                                        ...watch(),
                                        status: Number(Array.from(value)[0])
                                    })}
                                isInvalid={Boolean(errors.decorations?.message && errors.decorations)}
                                errorMessage={errors.decorations?.message}>
                            {item =>
                                <SelectItem key={item.id} value={item.id} color="primary">
                                    {item.label}
                                </SelectItem>
                            }
                        </Select>
                        <Input label="Total Price" type="number" inputMode="numeric"
                               value={`${watch("totalPrice")}`} {...register("totalPrice", {
                            valueAsNumber: true,
                        })} />
                    </div>
                    <div className="flex gap-x-1">
                        <Input label="Deposits" type="number" inputMode="numeric"
                               value={`${watch("deposits")}`} {...register("deposits", {
                            valueAsNumber: true,
                        })} />
                        <Input label="Balance" type="number" inputMode="numeric"
                               value={`${watch("balance")}`} {...register("balance", {
                            valueAsNumber: true,
                        })} />
                    </div>
                </div>
                <h2 className={"col-span-3 text-xl font-semibold"}>
                    Books
                </h2>
                <div className="flex w-full flex-col col-span-3">
                    <Tabs aria-label="Options" color={"primary"}>
                        <Tab key="decorations" title="Decorations">
                            <Card>
                                <CardBody>
                                    {RenderFormDecorations()}
                                    <Button color="primary" onClick={() => setCountDecor(countDecor + 1)}
                                            className={"w-fit"}><PlusIcon/> </Button>
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="photos" title="Photos">
                            <Card>
                                <CardBody>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="weddingPresents" title="Wedding Presents">
                            <Card>
                                <CardBody>
                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                                    mollit anim id est laborum.
                                </CardBody>
                            </Card>
                        </Tab>

                        <Tab key="makeUp" title="Make Up">
                            <Card>
                                <CardBody>
                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt
                                    mollit anim id est laborum.
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="weddingDress" title="Wedding Dress">
                            <Card>
                                <CardBody>
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                    culpa
                                    qui officia deserunt mollit anim id est laborum.
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="weddingFlower" title="Wedding Flower">
                            <Card>
                                <CardBody>
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                    aliquip
                                    ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                                    velit
                                    esse cillum dolore eu fugiat nulla pariatur.
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="others" title="Others">
                            <Card>
                                <CardBody>
                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt
                                    mollit anim id est laborum.
                                </CardBody>
                            </Card>
                        </Tab>

                    </Tabs>
                </div>
            </div>
            <Spacer y={8}/>
            <div className={"flex items-end absolute bottom-2 right-3 justify-end gap-x-3"}>
                <Button color="default" className={"w-fit item"} onPress={() => onClose()}>Cancel</Button>
                <Button color="primary" className={"w-fit item"} type="submit">Save</Button>
            </div>
        </form>
        ,
        title: "Create Show",
        option: {
            size: "full"
        }
    })
    useEffect(() => {
        if (!sortDescriptor.column) return;
        setSort([{
            field: sortDescriptor.column as string,
            order: sortDescriptor.direction === "ascending" ? "asc" : "desc"
        }]);
    }, [sortDescriptor]);

    //Region Table
    const renderCell = useCallback((item: ShowsOutput, columnKey: React.Key): ReactNode => {
        if (!item) return;
        const cellValue = item[columnKey as keyof ShowsOutput];
        switch (columnKey) {
            case "actions":
                return (
                    <div className="flex flex-row gap-2">
                        <PencilIcon className="hover:cursor-pointer" onClick={() => {
                            reset(item);
                            console.log(watch())
                            onOpen();
                        }} width={"1.2rem"}/>
                        <AreYouSure
                            button={<TrashIcon className="hover:cursor-pointer text-danger" width={"1.2rem"}/>}
                            message={`Are you sure delete "${item.title}"?`}
                            onConfirmPopover={async () => {
                                await deleteItem.mutateAsync(Number(item.id));
                                toast("Delete success", { type: "success", position: "bottom-left" })
                                await refetch()
                            }}
                        />
                    </div>
                )
            default:
                return cellValue as ReactNode;
        }
    }, [])
    const loadingState = isLoading || isFetching ? "loading" : "idle";
    if (isError) return <div>Error</div>
        ;
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

All.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title={"All"}>
            {page}
        </MainLayout>
    )
}
export default All

/*
 * Copyright (c) 2024.
 * @49nhn
 */

