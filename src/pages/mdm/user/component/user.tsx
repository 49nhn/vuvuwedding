import { Button, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, getKeyValue, useDisclosure, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Select, SelectItem, type Selection, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { GlobalConfig } from '~/config/GlobalConfig';
import { api } from '~/utils/api';
import { useMemo, useState } from 'react';
import { EyeIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import InputUI from '~/ui/Input';
import Error from '~/ui/Error';
import { toast } from 'react-toastify';

const User = () => {
    const roleList = api.Role.getlistRoleName.useQuery();
    const jobnameList = api.Employee.getJobCategory.useQuery();
    const addUser = api.User.create.useMutation(GlobalConfig.tanstackOption)
    const deleteUser = api.Employee.deleteEmployee.useMutation(GlobalConfig.tanstackOption)

    const [roleId, setRoleId] = useState("");
    const [password, setPassword] = useState("");
    const [jobName, setjobName] = useState<Selection>(new Set([]))
    const username = InputUI({ label: "Username", Invalid: true, placeholder: "Enter your username" });
    const fullname = InputUI({ label: "Fullname", placeholder: "Enter your fullname" });
    const phone = InputUI({ label: "Phone", placeholder: "Enter your phone" });
    const email = InputUI({ label: "Email", placeholder: "Enter your email" });
    const address = InputUI({ label: "Address", placeholder: "Enter your address" });
    const birthDate = InputUI({ label: "BirthDate", placeholder: "Enter your birthDate", type: 'date' });
    const salary = InputUI({ label: "Salary", placeholder: "Enter your salary", type: 'number' });
    const [page, setPage] = useState(1);
    const { data, isLoading, isError, failureReason } = api.Employee.list.useQuery({ page: page, itemPerPage: 10, filter: null }, GlobalConfig.tanstackOption)
    const pages = useMemo(() => {
        return data?.total ? Math.ceil(data.total / data.itemPerPage) : 0;
    }, [data?.total, data?.itemPerPage]);

    const employeeList = useMemo(() => {
        return data?.data ? data : { data: [], total: 0, itemPerPage: 0, page: 0 };
    }, [data])
    const [isVisible, setIsVisible] = useState(false);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const toggleVisibility = () => setIsVisible(!isVisible);

    const handlerSubmit = () => {
        addUser.mutate({
            username: username.value,
            password: password,
            roleId: roleId,
            employee: {
                jobCatelogyName: Array.from(jobName).map((item) => item.toString()) ?? undefined,
                fullname: fullname?.value ?? undefined,
                phone: phone?.value ?? undefined,
                email: email?.value ?? undefined,
                address: address?.value ?? undefined,
                birthDate: new Date(birthDate?.value) ?? undefined,
                salary: Number(salary.value),
                isSalesman: false
            } ?? undefined
        })
        if (addUser.isSuccess) {
            toast.success("🦄 Wow so easy!");
            return onClose()
        }
        if (addUser.isError) {
            toast.error(Error(addUser.failureReason));
        }
    }

    if (roleList.isLoading) return <div>Loading...</div>
    if (jobnameList.isLoading) return <div>Loading...</div>
    if (roleList.isError) return <div>Error</div>
    if (jobnameList.isError) return <div>Error</div>

    if (isError) Error(failureReason);

    return (
        <>
            <div className='flex w-full justify-end pb-2 gap-x-3'>
                <Input
                    isClearable
                    color='primary'
                    className="w-fit sm:max-w-[44%]"
                    placeholder="Search by name..."
                    startContent={<MagnifyingGlassIcon width={14} />}
                // value={filterValue}
                // onClear={() => onClear()}
                // onValueChange={onSearchChange}
                />
                <Dropdown placement='bottom-start' >
                    <DropdownTrigger className='mb-3 self-end'>
                        <Button variant="shadow" color='primary' >
                            Action
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Dynamic Actions">
                        <DropdownItem key="newUser" onPress={onOpen}>
                            New User
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

            </div>
            <div>

                <Table aria-label="employeeList" selectionMode='multiple' selectionBehavior='toggle'
                    isStriped isHeaderSticky
                    bottomContent={
                        employeeList.total > 0 ? (
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
                        <TableColumn key="username" >Username</TableColumn>
                        <TableColumn key="fullName">Full Name</TableColumn>
                        <TableColumn key="salary">Salary</TableColumn>
                        <TableColumn key="jobName">Job Names</TableColumn>
                        <TableColumn key="salesman">Salesman</TableColumn>
                        <TableColumn key="birthday">Birthday</TableColumn>
                        <TableColumn key="address">Address</TableColumn>
                        <TableColumn key="phone">Phone</TableColumn>
                        <TableColumn key="email">Email</TableColumn>
                        <TableColumn key="role">Role</TableColumn>
                        <TableColumn key="Action">Action</TableColumn>
                    </TableHeader>
                    <TableBody items={employeeList.data.map((item) => {
                        return {
                            ...item,
                            username: item.users,
                            jobNames: item.jobNames?.map((job) => job),
                            salesman: item.salesman ? 'Yes' : 'No',
                            birthday: item.birthday.toLocaleDateString(),
                        }
                    })}
                        loadingContent={<Spinner label='Loading...' />} isLoading={isLoading}
                        emptyContent="No data">
                        {(item?) => (
                            <TableRow key={item?.id}  >
                                {(columnKey) => <TableCell>
                                    {columnKey === 'jobName' &&
                                        item?.jobNames?.map((job, index) => {
                                            return (
                                                <Chip className="" key={index}>
                                                    {job}
                                                </Chip>
                                            )
                                        })}
                                    <p>{getKeyValue(item, columnKey)}</p>
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
                                                    <TrashIcon className='w-5 h-5' onClick={() => deleteUser.mutate({ id: item?.id })} />
                                                </span>
                                            </Tooltip>
                                        </div>
                                    )}
                                </TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* ModalUser */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} backdrop="opaque" size='3xl' isDismissable={false} classNames={{
                backdrop: "bg-gradient-to-t from-zinc-900 o-zinc-900/10 backdrop-opacity-20"
            }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add User</ModalHeader>
                            <ModalBody className='grid grid-cols-2 md:auto-cols-min'>
                                {username.Element}
                                <Input label="Password" placeholder="Enter your password" variant="underlined" onValueChange={setPassword} name="password"
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                            {isVisible ? (<EyeIcon className="h-6" />) : (<EyeSlashIcon className="h-6" />)}
                                        </button>
                                    }
                                    type={isVisible ? "text" : "password"}
                                    className="max-w-xs pb-4"
                                    classNames={{ input: "max-w-xs", label: "text-white" }}
                                />
                                <Select variant="underlined" isRequired label="Role" className="max-w-xs" onChange={(e) => setRoleId(e.target.value)}>
                                    {roleList.data.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select variant="underlined" selectionMode="multiple" isRequired label="Job Type" onSelectionChange={setjobName} className="max-w-xs">
                                    {jobnameList.data.map((item) => (
                                        <SelectItem key={item.name} value={item.name}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {fullname.Element}
                                {phone.Element}
                                {email.Element}
                                {address.Element}
                                {birthDate.Element}
                                {salary.Element}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onClick={handlerSubmit}>
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