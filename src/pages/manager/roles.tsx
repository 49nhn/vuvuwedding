import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip } from "@nextui-org/react"
import { GlobalConfig } from "~/config/GlobalConfig";
import MainLayout from "~/layouts/MainLayout"
import Loading from "~/ui/Loading";
import { api } from "~/utils/api";

const roles = () => {
    const { data, isLoading, isError } = api.Role.listRoles.useQuery({ skip: 0, take: 10 }, GlobalConfig.tanstackOption);
    if (isLoading) return <Loading />
    if (isError) return <div>Error</div>


    const columns = [
        { name: "NAME", uid: "name" },
        { name: "USER", uid: "user" },
        { name: "ACTIONS", uid: "actions" },
    ]
    return (
        <MainLayout>
            <Table aria-label="table with custom cells">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={data}>
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <Chip>
                                    {item.name}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                {(item.User).map((user) => (
                                    <Chip key={user.id} className="mb-2 flex flex-wrap w-full"> {user.username } </Chip>
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
        </MainLayout>
    )
}

export default roles