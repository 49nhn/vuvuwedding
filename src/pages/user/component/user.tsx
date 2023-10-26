import { Button, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, getKeyValue, useDisclosure, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from '@nextui-org/react';
import { GlobalConfig } from '~/config/GlobalConfig';
import { api } from '~/utils/api';
import { useMemo, useState } from 'react';
import { EyeIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import InputUI from '~/ui/Input';

const User = () => {
    {/* z.object({
                                username: z.string(),
                                password: z.string().min(8).max(24),
                                roleId: z.string(),
                                employee: z.object({
                                    jobname: z.string(),
                                    fullname: z.string(),
                                    name: z.string(),
                                    phone: z.string().nullable(),
                                    email: z.string().nullable(),
                                    address: z.string().nullable(),
                                    birthDate: z.date().default(new Date()),
                                    salary: z.number(),
                                    isSalesman: z.boolean(),
                                    }).nullable(), */}
    const username = InputUI({ label: "Username", Invalid: true, placeholder: "Enter your username" });
    const password = InputUI({ label: "Password", placeholder: "Enter your password", type: "password" });

    // LoadingDataAPI({ CreateTRPCNextBase: getEmployee })
    const [isVisible, setIsVisible] = useState(false);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = api.User.list.useQuery({ page: page, itemPerPage: 10, filter: null }, GlobalConfig.tanstackOption);
    const pages = useMemo(() => {
        return data?.total ? Math.ceil(data.total / data.itemPerPage) : 0;
    }, [data?.total, data?.itemPerPage]);

    const data1 = useMemo(() => {
        return data?.data ? data : { data: [], total: 0, itemPerPage: 0, page: 0 };
    }, [data])

    if (isError) <div>Error</div>

    const loadingState = isLoading || data?.data.length === 0 ? "loading" : "idle";

    return (
        <>
            <div className='flex w-full justify-end pb-2 gap-x-3'>
                <Input
                    isClearable
                    className="w-fit sm:max-w-[44%]"
                    placeholder="Search by name..."
                    startContent={<MagnifyingGlassIcon width={14} />}
                // value={filterValue}
                // onClear={() => onClear()}
                // onValueChange={onSearchChange}
                />

                <Button onPress={onOpen} >Open Modal</Button>
            </div>
            <Table aria-label="UserList" selectionMode='multiple' selectionBehavior='toggle'
                isStriped isHeaderSticky
                bottomContent={
                    data1.total > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    ) : null
                }>
                <TableHeader>
                    <TableColumn key="username"  >Username</TableColumn>
                    <TableColumn key="role">Role</TableColumn>
                    <TableColumn key="createdAt">Created At</TableColumn>
                    <TableColumn key="Action">Action</TableColumn>
                </TableHeader>
                <TableBody items={data1.data} loadingContent={<Spinner label='Loading...' />} loadingState={loadingState}>
                    {
                        (item?) => (
                            <TableRow key={item?.username}>
                                {(columnKey) => <TableCell>
                                    {getKeyValue(item, columnKey)}
                                    {columnKey === 'role' &&
                                        <div className="text-sm text-default-500">
                                            {item?.roles?.name}
                                        </div>}
                                    {columnKey === 'Action' && (
                                        <div className="relative flex gap-2">
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
                                    )}
                                </TableCell>}
                            </TableRow>
                        )}
                </TableBody>
            </Table>
            {/* ModalUser */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} backdrop="opaque" size='3xl' isDismissable={false} classNames={{
                backdrop: "bg-gradient-to-t from-zinc-900 o-zinc-900/10 backdrop-opacity-20"
            }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody className='grid grid-cols-2 md:auto-cols-min'>
                                {/* z.object({
                                username: z.string(),
                                password: z.string().min(8).max(24),
                                roleId: z.string(),
                                employee: z.object({
                                    jobname: z.string(),
                                    fullname: z.string(),
                                    name: z.string(),
                                    phone: z.string().nullable(),
                                    email: z.string().nullable(),
                                    address: z.string().nullable(),
                                    birthDate: z.date().default(new Date()),
                                    salary: z.number(),
                                    isSalesman: z.boolean(),
                                    }).nullable(), */}

                                <Input
                                    label="Password"
                                    placeholder="Enter your password"
                                    variant="underlined"
                                    name="password"
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                            {isVisible ? (
                                                <EyeIcon className="h-6" />
                                            ) : (
                                                <EyeSlashIcon className="h-6" />
                                            )}
                                        </button>
                                    }
                                    type={isVisible ? "text" : "password"}
                                    className="max-w-xs pb-4"
                                    classNames={{ input: "max-w-xs", label: "text-white" }}
                                />


                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </ >
    )
}


export default User