import type { NextPageWithLayout } from "~/pages/_app";
import React, { ReactElement, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import MainLayout, { AuthContext } from "~/layouts/MainLayout";
import { api, ShowsInput, ShowsOutput, } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";
import { Accordion, AccordionItem, Card, CardBody, Image, Input, Select, SelectItem, type SortDescriptor, Spacer, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { TopTable } from "~/components/TopTable";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MyModal } from "~/components/Modal";
import { BottomTable } from "~/components/BottomTable";
import { toast } from "react-toastify";
import AreYouSure from "~/ui/MyPopover"
import { SubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { ShowStore } from "~/store/ShowStore";
import { MdmStore } from "~/store/MdmStore";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Chip } from "@nextui-org/chip";
import { DateInput } from "@nextui-org/date-input";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { getDay } from "~/utils/formatDate";
import { UploadDropzone } from "~/utils/uploadthing";
import { OurFileRouter } from "~/server/uploadthing";

type FormType = ShowsInput & {
    createdBy: string | undefined,
    id: number,
    salesMan: { id: number; fullName: string | null; phone: string | null; }[],
    _count: {
        decorations: number,
        photos: number,
        weddingPresents: number,
        makeups: number,
        weddingDresses: number,
        weddingFlowers: number,
        others: number
    }
}

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
    const [countRender, setCountRender] = useReducer((state: {
        photos: number[];
        decorations: number[];
        weddingPresents: number[];
        makeups: number[];
        weddingDresses: number[];
        weddingFlowers: number[];
        others: number[];
    }, action: { type: string, value: number[] }) => {
        switch (action.type) {
            case "photos":
                return { ...state, photos: action.value }
            case "decorations":
                return { ...state, decorations: action.value }
            case "weddingPresents":
                return { ...state, weddingPresents: action.value }
            case "makeups":
                return { ...state, makeups: action.value }
            case "weddingDresses":
                return { ...state, weddingDresses: action.value }
            case "weddingFlowers":
                return { ...state, weddingFlowers: action.value }
            case "others":
                return { ...state, others: action.value }
            default:
                return state;
        }
    }, {
        photos: [],
        decorations: [],
        weddingPresents: [],
        makeups: [],
        weddingDresses: [],
        weddingFlowers: [],
        others: []
    });

    const currentUser = useContext(AuthContext);
    const [sort, setSort] = useState<{ field: string, order?: "asc" | "desc" | undefined }[]>([]);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});
    const { search, TopContent, headerColumns } = TopTable({
        columns,
        INITIAL_VISIBLE_COLUMNS,
        onAdd: () => {
            reset({
                createdBy: currentUser?.username,
                status: 0,
                totalPrice: 0,
                deposits: 0,
                balance: 0,
            });
            setCountRender({ type: "decorations", value: [] })
            setCountRender({ type: "photos", value: [] })
            setCountRender({ type: "weddingPresents", value: [] })
            setCountRender({ type: "makeups", value: [] })
            setCountRender({ type: "weddingDresses", value: [] })
            setCountRender({ type: "weddingFlowers", value: [] })
            setCountRender({ type: "others", value: [] })
            onOpen();
        }
    });
    const { bottomContent, setLength, page, itemPerPage } = BottomTable()

    //Region API
    const createItem = api.Shows.create.useMutation(GlobalConfig.tanstackOption);
    const updateItem = api.Shows.update.useMutation(GlobalConfig.tanstackOption);
    const deleteItem = api.Shows.delete.useMutation(GlobalConfig.tanstackOption);
    const removePhoto = api.Photo.delete.useMutation(GlobalConfig.tanstackOption);
    const removeDecoration = api.Decoration.delete.useMutation(GlobalConfig.tanstackOption);
    const removeWeddingDress = api.WeddingDress.delete.useMutation(GlobalConfig.tanstackOption);
    const removeWeddingFlower = api.WeddingFlower.delete.useMutation(GlobalConfig.tanstackOption);
    const removeWeddingPresent = api.WeddingPresent.delete.useMutation(GlobalConfig.tanstackOption);
    const removeMakeUp = api.MakeUp.delete.useMutation(GlobalConfig.tanstackOption);
    const removeOther = api.Other.delete.useMutation(GlobalConfig.tanstackOption);
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
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormType>({
        criteriaMode: "all",
        mode: "onBlur",
    });
    const onSubmit: SubmitHandler<FormType> = async (dataForm) => {
        if (dataForm.id) {
            await updateItem.mutateAsync(dataForm).catch((error) => {
                toast(error.message, { type: "error", position: "bottom-left" })
                throw new Error(error.message)
            })
            toast("Update success", { type: "success", position: "bottom-left" })
            await refetch()
            onClose()
            return;
        }
        await createItem.mutateAsync(dataForm).catch((error) => {
            toast(error.message, { type: "error", position: "bottom-left" })
            throw new Error(error.message)
        })
        toast("Save success", { type: "success", position: "bottom-left" })
        await refetch()
        onClose()
    };

    const RenderFormDecorations = useCallback(() =>
        countRender.decorations.map((_, index) =>
            (
                <Accordion key={index} isCompact>
                    <AccordionItem title={`${watch(`decorations.${index}.title`) ?? `Decoration  ${index}`} `}
                                   key={index}
                                   onPress={() => { }}
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 flex flex-col gap-2">
                                <Input label="title" {...register(`decorations.${index}.title`)}
                                       value={watch(`decorations.${index}.title`)}/>
                                <Textarea label="Description" {...register(`decorations.${index}.description`)}
                                          minRows={4} maxRows={7}/>
                                <div className="flex gap-2">
                                    <Select label={<p>Ceremony Type <span className={"text-danger"}>*</span></p>}
                                            selectedKeys={[`${watch(`decorations.${index}.ceremonyType`)}`]}
                                            placeholder="Select ceremony type..."
                                            selectionMode="single"
                                            onSelectionChange={(value) => {
                                                setValue(`decorations.${index}.ceremonyType`, Array.from(value).map((item) => Number(item))[0] ?? 0)
                                                setValue(`decorations.${index}.title`, MdmStore.CeremonyType.find((item) => item.id === Number(Array.from(value).map((item) => Number(item))[0]))?.name ?? "")
                                            }}
                                            items={MdmStore.CeremonyType}
                                            isInvalid={Boolean(errors.decorations?.message && errors.decorations)}
                                            errorMessage={errors.decorations?.message}>
                                        {item =>
                                            <SelectItem key={item.id} value={item.id}>
                                                {item.name}
                                            </SelectItem>}
                                    </Select>
                                    <Select
                                        label={<p>Pack Ancestral <span className={"text-danger"}>*</span></p>}
                                        placeholder="Select a Pack Ancestral..."
                                        selectionMode="single"
                                        selectedKeys={[`${watch(`decorations.${index}.packAncestralId`)}`]}
                                        items={packAncestral}
                                        onSelectionChange={(value) =>
                                            setValue(`decorations.${index}.packAncestralId`, Array.from(value).map((item) => String(item))[0])}
                                    >
                                        {item =>
                                            <SelectItem key={item.id} value={item.id}>
                                                {`${item.name} `}
                                            </SelectItem>}
                                    </Select>
                                    <I18nProvider locale="vi-VN">
                                        <DateInput
                                            label={<p>Date <span className={"text-danger"}>*</span></p>}
                                            granularity={"minute"}
                                            hideTimeZone
                                            startContent={<span
                                                className="text-gray-500 flex text-xs">{
                                                getDay(watch(`decorations.${index}.dateShowStart`)) ?? ""
                                            }
                                     </span>}
                                            onChange={(value) => {
                                                setValue(`decorations.${index}.dateShowStart`, value.toDate())
                                            }}
                                            value={parseAbsoluteToLocal(watch(`decorations.${index}.dateShowStart`)?.toISOString() ?? new Date().toISOString())}
                                        />
                                    </I18nProvider>
                                    <Input label="Price"
                                           endContent={<span className="text-gray-500 flex text-xs">triệu vnd</span>}
                                           type="number"
                                           inputMode={"numeric"}
                                           value={`${watch(`decorations.${index}.price`)}`}
                                           {...register(`decorations.${index}.price`, {
                                               valueAsNumber: true,
                                           })} />
                                </div>
                            </div>
                            <h3 className="col-span-2 font-bold">
                                Information
                            </h3>
                            <div className={"flex flex-col gap-2"}>
                                <Input label="Tone rèm" {...register(`decorations.${index}.tone_rem`)}
                                       value={watch(`decorations.${index}.tone_rem`)}/>
                                <Input label="Tone hoa" {...register(`decorations.${index}.tone_hoa`)}
                                       value={watch(`decorations.${index}.tone_hoa`)}/>
                                <Input label="Số phông" {...register(`decorations.${index}.so_phong`)}
                                       value={watch(`decorations.${index}.so_phong`)}/>
                                <Input label="Bàn ghế" {...register(`decorations.${index}.ban_ghe`)}
                                       value={watch(`decorations.${index}.ban_ghe`)}/>
                                <Input label="Bàn thờ" {...register(`decorations.${index}.ban_tho`)}
                                       value={watch(`decorations.${index}.ban_tho`)}/>
                                <Input label="Trụ quả" {...register(`decorations.${index}.tru_qua`)}
                                       value={watch(`decorations.${index}.tru_qua`)}/>
                                <Input label="Khung" {...register(`decorations.${index}.khung`)}
                                       value={watch(`decorations.${index}.khung`)}/>
                                <Input label="Cổng" {...register(`decorations.${index}.cong`)}
                                       value={watch(`decorations.${index}.cong`)}/>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <Input label="Chử Hỷ" {...register(`decorations.${index}.chu_hy`)}
                                       value={watch(`decorations.${index}.chu_hy`)}/>
                                <Input
                                    label="Chai nước / Đĩa bánh / Ly tách  " {...register(`decorations.${index}.chai_nuoc`)}
                                    value={watch(`decorations.${index}.chai_nuoc`)}/>
                                <Input label="Cắm hoa" {...register(`decorations.${index}.cam_hoa`)}
                                       value={watch(`decorations.${index}.cam_hoa`)}/>
                                <Input label="Đèn" {...register(`decorations.${index}.den`)}
                                       value={watch(`decorations.${index}.den`)}/>
                                <Input label=" Trải bàn" {...register(`decorations.${index}.trai_ban`)}
                                       value={watch(`decorations.${index}.trai_ban`)}/>
                                <Input label="Lưng ghế" {...register(`decorations.${index}.lung_ghe`)}
                                       value={watch(`decorations.${index}.lung_ghe`)}/>
                                <Input label="Rạp/ dù / Quạt" {...register(`decorations.${index}.rap`)}
                                       value={watch(`decorations.${index}.rap`)}/>
                                <Input label="Bàn tròn" {...register(`decorations.${index}.ban_tron`)}
                                       value={watch(`decorations.${index}.ban_tron`)}/>
                            </div>
                            <h3 className="col-span-2 font-bold">
                                Image
                            </h3>
                            <div className={"flex gap-2"}>
                                <div>
                                    {
                                        watch(`decorations.${index}.image`) ?
                                            watch(`decorations.${index}.image`).map((item, index) => (
                                                <Image key={index} src={item.url} width={100} height={100}/>
                                            )) : null
                                    }
                                </div>
                                
                                <UploadDropzone<keyof OurFileRouter>
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        // Do something with the response
                                        console.log("Files: ", res);
                                        alert("Upload Completed");
                                    }}
                                    appearance={{
                                        button:
                                            "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed p-2 rounded" +
                                            " bg-primary-500" +
                                            " bg-none after:bg-orange-400",
                                        container: "w-max rounded-md border-cyan-30 py-3",
                                        allowedContent:
                                            "flex h-8 flex-col items-center justify-center text-white",
                                    }}
                                    onUploadError={(error: Error) => {
                                        alert(`ERROR! ${error.message}`);
                                    }}
                                    onUploadBegin={(name) => {
                                        // Do something once upload begins
                                        console.log("Uploading: ", name);
                                    }}
                                    onDrop={(acceptedFiles) => {
                                        // Do something with the accepted files
                                        console.log("Accepted files: ", acceptedFiles);
                                        setValue(`decorations.${index}.image`,[])
                                    }}
                                />
                            </div>
                        </div>
                    </AccordionItem>
                </Accordion>
            )), [countRender.decorations])

    const RenderTabForm = useCallback((type: "photos" | "weddingPresents" | "makeups" | "weddingDresses" | "weddingFlowers" | "others") => {
        return countRender[type].map((item, index, array) => {
            if (!watch(`${type}.${index}.dateShowStart`))
                setValue(`${type}.${index}.dateShowStart`, new Date)

            return <Accordion key={index} isCompact>
                <AccordionItem title={
                    <div className="flex justify-between  content-between">
                        <h3>
                            {type} {item}
                        </h3>
                        <AreYouSure
                            button={<TrashIcon className="hover:cursor-pointer hover:text-red-900 text-danger"
                                               width={"1.2rem"}/>}
                            message={`Are you sure delete "${watch(`${type}.${index}.title`)}"?`}
                            onConfirmPopover={async () => {
                                if (watch(`${type}.${index}.id`))
                                    switch (type) {
                                        case "makeups":
                                            await removeMakeUp.mutateAsync(Number(watch(`${type}.${index}.id`)));
                                            break
                                        case "photos":
                                            await removePhoto.mutateAsync(watch(`${type}.${index}.id`) as string);
                                            break
                                        case "others":
                                            await removeOther.mutateAsync(Number(watch(`${type}.${index}.id`)));
                                            break
                                        case "weddingPresents":
                                            await removeWeddingPresent.mutateAsync(Number(watch(`${type}.${index}.id`)));
                                            break
                                        case "weddingDresses":
                                            await removeWeddingDress.mutateAsync(Number(watch(`${type}.${index}.id`)));
                                            break
                                        case "weddingFlowers":
                                            await removeWeddingFlower.mutateAsync(Number(watch(`${type}.${index}.id`)));
                                            break
                                    }
                                toast("Delete success", { type: "success", position: "bottom-left" })
                                setCountRender({
                                    type: type,
                                    value: array.filter((e) => e !== item)
                                })
                                setValue(type, watch(`${type}`)?.filter((e) => e !== watch(`${type}.${index}`)) ?? [])
                            }}
                        />
                    </div>}
                               key={index}>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <Input className={"w-full"} label="title" {...register(`${type}.${index}.title`)}
                                   value={watch(`${type}.${index}.title`) ?? `${type}  ${index}`}/>
                            <div className={"flex gap-2"}>
                                <I18nProvider locale="vi-VN">
                                    <DateInput
                                        label={<p>Date <span className={"text-danger"}>*</span></p>}
                                        granularity={"minute"}
                                        hideTimeZone
                                        startContent={<span
                                            className="text-gray-500 flex text-xs">{
                                            getDay(watch(`${type}.${index}.dateShowStart`)) ?? ""
                                        }
                                    </span>}
                                        onChange={(value) => {
                                            console.log(value)
                                            setValue(`${type}.${index}.dateShowStart`, value.toDate())
                                        }}
                                        defaultValue={parseAbsoluteToLocal(watch(`${type}.${item}.dateShowStart`)?.toISOString() ?? new Date().toISOString())}
                                    />
                                </I18nProvider>
                                <Input label="Price"
                                       endContent={<span className="text-gray-500 flex text-xs">triệu vnd</span>}
                                       type="number"
                                       inputMode={"numeric"}
                                       value={`${watch(`${type}.${index}.price`)}`}
                                       {...register(`${type}.${index}.price`, {
                                           valueAsNumber: true,
                                       })} />
                            </div>
                        </div>
                        <Textarea label="Description" {...register(`${type}.${index}.description`)}
                                  minRows={4} maxRows={7}/>
                    </div>
                </AccordionItem>
            </Accordion>
        })
    }, [countRender.photos, countRender.weddingPresents, countRender.makeups, countRender.weddingDresses, countRender.weddingFlowers, countRender.others])

    //Region Modal
    const { RenderModal, onOpen, isOpen, onClose } = MyModal({
        Content: <form onSubmit={handleSubmit(onSubmit)} className="static md:flex-nowrap gap-4">
            <div className="grid grid-cols-3 gap-3  ">
                <h2 className={"col-span-3 text-xl font-semibold"}>
                    Information
                </h2>
                <div className={"flex flex-col gap-2"}>
                    <Input label={<p>Groom Name <span className={"text-danger"}>*</span></p>}
                           {...register("groomName", {
                               required: "Groom Name is required"
                           })}
                           value={watch("groomName")}
                           errorMessage={errors.groomName?.message}
                    />
                    <Input label="Groom Phone" value={watch("groomPhone")} {...register("groomPhone")} />
                    <Input label="Groom Address" value={watch("groomAddress")} {...register("groomAddress")} />
                    <Input label={<p>Title <span className={"text-danger"}>*</span></p>}
                           value={watch("title")}
                           {...register("title", {
                               required: "Title is required"
                           })}
                           errorMessage={errors.title?.message}
                    />
                </div>
                <div className={"flex flex-col gap-2"}>
                    <Input label={<p>Bride Name <span className={"text-danger"}>*</span></p>}
                           value={watch("brideName")}
                           errorMessage={errors.brideName?.message}
                           {...register("brideName")} />
                    <Input label="Bride Phone" value={watch("bridePhone")} {...register("bridePhone")} />
                    <Input label="Bride Address" value={watch("brideAddress")} {...register("brideAddress")} />
                    <Textarea label="Description" value={watch("description")} {...register("description")} minRows={4}
                              maxRows={7}/>

                </div>
                <div className={"flex flex-col gap-2"}>
                    <Select label={<p>Salesman <span className={"text-danger"}>*</span></p>}
                            placeholder="Select a Salesman..."
                            selectionMode="multiple"
                            isInvalid={Boolean(errors.salesManId?.message && errors.salesManId)}
                            defaultSelectedKeys={watch("salesMan")?.map((item) => `${item.id}`) ?? []}
                            items={salesMan}
                            onSelectionChange={(value) => setValue("salesManId", Array.from(value).map((item) => String(item)))}
                            errorMessage={errors.salesManId?.message}>
                        {item =>
                            <SelectItem key={item.id} value={item.id}>
                                {`${item.username} - ${item.fullName}`}
                            </SelectItem>}
                    </Select>
                    <Input label="Creator Name" value={watch("createdBy")} {...register("createdBy")}
                           defaultValue={watch("createdBy")} readOnly/>
                    <Input label="Other Contact" value={watch("otherContact")} {...register("otherContact")} />
                    <div className={"flex gap-x-1"}>
                        <Select
                            label={<p>Status <span className={"text-danger"}>*</span></p>}
                            value={watch("status")}
                            placeholder="Select status..."
                            selectionMode="single"
                            items={ShowStore.Status}
                            selectedKeys={[`${watch("status")}`]}
                            onSelectionChange={(value) =>
                                setValue("status", Array.from(value).map((item) => Number(item))[0] ?? 0)}
                            isInvalid={Boolean(errors.decorations?.message && errors.decorations)}
                            errorMessage={errors.decorations?.message}>
                            {item =>
                                <SelectItem key={item.id} value={item.id} color="primary">
                                    {item.label}
                                </SelectItem>
                            }
                        </Select>
                        <Input label="Total Price" type="number" inputMode="decimal"
                               value={`${watch("totalPrice")}`}
                               {...register("totalPrice", {
                                   valueAsNumber: true,
                                   min: 0,
                               })}
                               endContent={<span className="text-gray-500 flex text-xs">triệu vnd</span>}
                               onValueChange={(value) =>
                                   setValue("balance", Number(value) - watch("deposits"))
                               }
                               step={0.1}
                               datatype={"decimal"}
                               min={0}
                        />
                    </div>
                    <div className="flex gap-x-1">
                        <Input label="Deposits" type="number" inputMode="numeric"
                               step={0.1}
                               min={0}
                               readOnly={watch("status") !== 1}
                               max={watch("totalPrice")}
                               value={`${watch("deposits")}`}
                               endContent={<span className="text-gray-500 flex text-xs">triệu vnd</span>}
                               {...register("deposits", {
                                   valueAsNumber: true,
                                   min: 0,
                                   max: watch("totalPrice")
                               })}
                               isInvalid={Boolean(errors.deposits?.message && errors.deposits)}
                               errorMessage={errors.deposits?.message}
                               onValueChange={(value) =>
                                   setValue("balance", watch("totalPrice") - Number(value))
                               }
                        />
                        <Input label="Balance" type="number" inputMode="numeric"
                               endContent={<span className="text-gray-500 flex text-xs">triệu vnd</span>}
                               value={`${watch("balance")}`}
                               {...register("balance", {
                                   valueAsNumber: true
                               })}
                               readOnly={true}
                        />
                    </div>
                </div>
                <h2 className={"col-span-3 text-xl font-semibold"}>
                    Books
                </h2>
                <div className="w-full col-span-3">
                    <Tabs aria-label="Options" isVertical={true} color={"primary"} classNames={{
                        panel: "w-full",
                        tab: "justify-start",
                    }}>
                        <Tab key="decorations"
                             title={<div className="flex items-center gap-2" color="danger">Decorations
                                 <Chip size="sm" variant="faded">{countRender.decorations.length ?? 0}</Chip>
                             </div>}>
                            <Card>
                                <CardBody>
                                    {RenderFormDecorations()}
                                    <Button color="primary" onClick={() =>
                                        setCountRender({
                                            type: "decorations",
                                            value: [...countRender.decorations, (countRender.decorations[countRender.decorations.length - 1] ?? 0) + 1]
                                        })}
                                            className={"w-fit mt-2"}><PlusIcon/> </Button>
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="photos" title={
                            <div className="flex items-center gap-2" color="danger">Photos
                                <Chip size="sm" variant="faded">{countRender.photos.length ?? 0}</Chip>
                            </div>
                        }>
                            <Card>
                                <CardBody>
                                    {RenderTabForm("photos")}
                                    <Button color="primary" onClick={() => {
                                        let value = [...countRender.photos, (countRender.photos[countRender.photos.length - 1] ?? 0) + 1]
                                        setCountRender({
                                            type: "photos",
                                            value: value
                                        })
                                    }}
                                            className={"w-fit mt-2"}><PlusIcon/> </Button>

                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="weddingPresents" title={
                            <div className="flex items-center gap-2" color="danger">Wedding Presents
                                <Chip size="sm" variant="faded">{countRender.weddingPresents.length ?? 0}</Chip>
                            </div>
                        }>
                            <Card>
                                <CardBody>
                                    {RenderTabForm("weddingPresents")}
                                    <Button color="primary" onClick={() =>
                                        setCountRender({
                                            type: "weddingPresents",
                                            value: [...countRender.weddingPresents, (countRender.weddingPresents[countRender.weddingPresents.length - 1] ?? 0) + 1]
                                        })}
                                            className={"w-fit mt-2"}><PlusIcon/> </Button>
                                </CardBody>
                            </Card>
                        </Tab>

                        <Tab key="makeups" title={
                            <div className="flex items-center gap-2" color="danger">Make Up
                                <Chip size="sm" variant="faded">{countRender.makeups.length ?? 0}</Chip>
                            </div>
                        }>
                            <Card>
                                <CardBody>
                                    {RenderTabForm("makeups")}
                                    <Button color="primary" onClick={() =>
                                        setCountRender({
                                            type: "makeups",
                                            value: [...countRender.makeups, (countRender.makeups[countRender.makeups.length - 1] ?? 0) + 1]
                                        })}
                                            className={"w-fit mt-2"}><PlusIcon/> </Button>
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="weddingDresses" title={
                            <div className="flex items-center gap-2" color="danger">Wedding Dress
                                <Chip size="sm" variant="faded">{countRender.weddingDresses.length ?? 0}</Chip>
                            </div>
                        }>
                            <Card>
                                <CardBody>
                                    {RenderTabForm("weddingDresses")}
                                    <Button color="primary" onClick={() =>
                                        setCountRender({
                                            type: "weddingDresses",
                                            value: [...countRender.weddingDresses, (countRender.weddingDresses[countRender.weddingDresses.length - 1] ?? 0) + 1]
                                        })}
                                            className={"w-fit mt-2"}><PlusIcon/> </Button>
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="weddingFlower" title={
                            <div className="flex items-center gap-2" color="danger">Wedding Flower
                                <Chip size="sm" variant="faded">{countRender.weddingFlowers.length ?? 0}</Chip>
                            </div>
                        }>
                            <Card>
                                <CardBody>
                                    {RenderTabForm("weddingFlowers")}
                                    <Button color="primary" onClick={() =>
                                        setCountRender({
                                            type: "weddingFlowers",
                                            value: [...countRender.weddingFlowers, (countRender.weddingFlowers[countRender.weddingFlowers.length - 1] ?? 0) + 1]
                                        })}
                                            className={"w-fit mt-2"}><PlusIcon/> </Button>
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="others" title={
                            <div className="flex items-center gap-2" color="danger">Others
                                <Chip size="sm" variant="faded">{countRender.others.length ?? 0}</Chip>
                            </div>
                        }>
                            <Card>
                                <CardBody>
                                    {RenderTabForm("others")}
                                    <Button color="primary" onClick={() =>
                                        setCountRender({
                                            type: "others",
                                            value: [...countRender.others, (countRender.others[countRender.others.length - 1] ?? 0) + 1]
                                        })}
                                            className={"w-fit mt-2"}><PlusIcon/> </Button>
                                </CardBody>
                            </Card>
                        </Tab>

                    </Tabs>
                </div>
            </div>
            <Spacer y={8}/>
            <div className={"flex items-end absolute bottom-2 right-3 justify-end gap-x-3"}>
                <Button color="default" className={"w-fit item"} isLoading={isSubmitting}
                        onPress={() => onClose()}>Cancel</Button>
                <Button color="primary" className={"w-fit item"} isLoading={isSubmitting} type="submit">Save</Button>
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

    const renderCell = useCallback((item: ShowsOutput, columnKey: React.Key): ReactNode => {
        if (!item) return;
        const cellValue = item[columnKey as keyof ShowsOutput];
        switch (columnKey) {
            case "actions":
                return (
                    <div className="flex flex-row gap-2">
                        <PencilIcon className="hover:cursor-pointer" onClick={(e) => {
                            e.defaultPrevented = false;
                            setCountRender({
                                type: "photos",
                                value: Array.from({ length: item._count.photos }).map((_, index) => index)
                            })
                            setCountRender({
                                type: "weddingPresents",
                                value: Array.from({ length: item._count.weddingPresents }).map((_, index) => index)
                            })
                            setCountRender({
                                type: "makeups",
                                value: Array.from({ length: item._count.makeups }).map((_, index) => index)
                            })
                            setCountRender({
                                type: "weddingDresses",
                                value: Array.from({ length: item._count.weddingDresses }).map((_, index) => index)
                            })
                            setCountRender({
                                type: "weddingFlowers",
                                value: Array.from({ length: item._count.weddingFlowers }).map((_, index) => index)
                            })
                            setCountRender({
                                type: "others",
                                value: Array.from({ length: item._count.others }).map((_, index) => index)
                            })
                            setCountRender({
                                type: "decorations",
                                value: Array.from({ length: item._count.decorations }).map((_, index) => index)
                            })
                            // @ts-ignore
                            reset({
                                ...item,
                                salesManId: item.salesMan.map((item) => item.id)
                            });
                            onOpen();
                        }} width={"1.2rem"}/>
                        <AreYouSure
                            button={<TrashIcon className="hover:cursor-pointer text-danger" width={"1.2rem"}/>}
                            message={`Are you sure delete "${item.title}"?`}
                            onConfirmPopover={async () => {
                                await deleteItem.mutateAsync(item.id);
                                toast("Delete success", { type: "success", position: "bottom-left" })
                                await refetch()
                            }}
                        />
                    </div>
                )
            case "salesMan":
                return item.salesMan.map((item) => item.fullName).join(", ")
            case "book":
                return item.decorations?.map((item) => item.title).join(", ")
            case "date":
                return new Date(cellValue as string).toLocaleDateString()
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

