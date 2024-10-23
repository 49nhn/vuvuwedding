import type { NextPageWithLayout } from "~/pages/_app";
import React, { ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "~/layouts/MainLayout";
import { SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { TopTable } from "~/components/TopTable";
import { BottomTable } from "~/components/BottomTable";
import { api } from "~/utils/api";
import { GlobalConfig } from "~/config/GlobalConfig";
import { MyModal } from "~/components/Modal";
import { Decoration } from "@prisma/client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import AreYouSure from "~/ui/MyPopover";
import { toast } from "react-toastify";

const columns = [
    {
        key: "actions",
        label: "Actions",
        width: 100,
    },
    {
        key: "ceremonyType",
        label: "Ceremony Type",
        sortable: true,
    },
    {
        key: "title",
        label: "title",
        sortable: true,
    }, {
        key: "timeline",
        label: "Time Line",
        sortable: true,
    },
    {
        key: "address",
        label: "Address",
        sortable: true,
    },
    {
        key: "pack",
        label: "Pack"
    },
    {
        key: "salesMan",
        label: "salesMan",
        sortable: true,
    },

];
const INITIAL_VISIBLE_COLUMNS = ["ceremonyType", "title", "timeline", "address", "pack", "salesMan", "actions"];

const Decoration: NextPageWithLayout = () => {
    const [filter] = useState({});
    const [sort, setSort] = useState<{ field: string, order?: "asc" | "desc" | undefined }[]>([]);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});
    const { search, TopContent, headerColumns } = TopTable({
        columns,
        INITIAL_VISIBLE_COLUMNS,
        onAdd: () => {
            // setDataPost({
            //     id: undefined,
            //     name: "",
            // })
            onOpen();
        }
    });
    const { bottomContent, setLength, page, itemPerPage } = BottomTable()

    const { data, isError, isLoading, refetch, isFetching } = api.Decoration.getList.useQuery({
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

    // useEffect(() => setLength(data?.total ?? 0), [isLoading, isFetching]);
    const { RenderModal, onOpen, isOpen, onClose } = MyModal({
        Content: <form>
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

    const renderCell = useCallback((item: Decoration, columnKey: React.Key): ReactNode => {
        const cellValue = item[columnKey as keyof Decoration];
        switch (columnKey) {
            case "actions":
                return (
                    <div className="flex flex-row gap-2">
                        <PencilIcon className="hover:cursor-pointer" onClick={() => {
                            onOpen();
                        }} width={"1.2rem"}/>
                        <AreYouSure
                            button={<TrashIcon className="hover:cursor-pointer text-danger" width={"1.2rem"}/>}
                            message={`Are you sure delete "${item.title}"?`}
                            onConfirmPopover={async () => {
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

Decoration.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout title="Decoration">
            <div className="h-[200vh]">
                {page}
            </div>
        </MainLayout>
    )
}
export default Decoration