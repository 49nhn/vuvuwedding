import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Spinner, Pagination, Checkbox } from "@nextui-org/react"
import { type ChangeEvent, useMemo, useState } from "react";
import { GlobalConfig } from "~/config/GlobalConfig";
import { api } from "~/utils/api";
import type { Permission } from '@prisma/client'
type PermissionProps = Permission & { isAllow: boolean }
const Permision = () => {
    const update = api.Permission.update.useMutation(GlobalConfig.tanstackOption);
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = api.Role.list.useQuery({ page: page, itemPerPage: 10, filter: null }, GlobalConfig.tanstackOption);

    const pages = useMemo(() => {
        return data?.total ? Math.ceil(data.total / data.itemPerPage) : 0;
    }, [data?.total, data?.itemPerPage]);
    const permissions = useMemo(() => {
        return data?.data ? data : { data: [], total: 0, itemPerPage: 0, page: 0 };
    }, [data])
    const loadingState = isLoading || data?.data.length === 0 ? "loading" : "idle";

    if (isError) return <div>error</div>


    const updatePermission = (id: string, e: ChangeEvent<HTMLInputElement>) => {
        const isAllow = e.target.checked;
        console.log(id, isAllow);
        try {
            update.mutate({ id, isAllow });
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Table aria-label="PermissionList"
                isStriped isHeaderSticky
                bottomContent={
                    permissions.total > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={(page) => setPage(page)} />
                        </div>
                    ) : null
                }>
                <TableHeader>
                    <TableColumn key="name" >Name</TableColumn>
                    <TableColumn key="user">Permisson</TableColumn>
                    <TableColumn key="Action">Action</TableColumn>

                </TableHeader>
                <TableBody items={permissions.data} loadingContent={<Spinner label='Loading...' />} loadingState={loadingState}>
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                {item.name}
                            </TableCell>
                            <TableCell className="gap-x-2 flex flex-nowrap">
                                {item.Permissions.map((e: PermissionProps) => (
                                    <Checkbox defaultSelected={e.isAllow} key={e.id} color="success" onChange={(event) => updatePermission(e.id, event)} >
                                        {e.name}
                                    </Checkbox>
                                ))}
                            </TableCell>
                            <TableCell width={"2.2rem"}>
                                <div className="relative flex items-center justify-center gap-2">
                                    <Tooltip content="Details">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                            <EyeIcon className='w-5 h-5' />
                                        </span>
                                    </Tooltip>
                                    <Tooltip content="Edit user" >
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                            <PencilIcon className='w-5 h-5' onClick={() => console.log('click')} />
                                        </span>
                                    </Tooltip>
                                    <Tooltip color="danger" content="Delete user">
                                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                            <TrashIcon className='w-5 h-5' />
                                        </span>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default Permision