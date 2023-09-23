import { EyeIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Chip, useDisclosure, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@nextui-org/react';
import { useRouter } from 'next/router';
import type { ChangeEvent, FormEvent } from 'react';
import { GlobalConfig } from '~/config/GlobalConfig';
import MainLayout from '~/layouts/MainLayout';
import { InputUI } from '~/ui/Input';
import Loading from '~/ui/Loading';
import { api } from '~/utils/api';


const User = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const page = Number(router.query.page) || 1;
  const columns = [
    { name: "NAME", uid: "name" },
    { name: "ROLE", uid: "role" },
    { name: "ACTIONS", uid: "actions" },
  ]
  const { data, isLoading, isError } = api.User.list.useQuery({ page: page, itemPerPage: 10, filter: null }, GlobalConfig.tanstackOption);

  const { data: roles } = api.Role.listRoles.useQuery({ skip: 0, take: 10 }, GlobalConfig.tanstackOption);

  const newUser = api.User.create.useMutation();
  const handleOpen = () => {
    onOpen();
  }
  const handleChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement
    console.log(target.value);
  }
  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return <div>Error</div>
  }
  if (!data) {
    return <div>No data</div>
  }
  const onsubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as { username: string; password: string; roleId: string; };
    newUser.mutate(data)
    if (newUser.isSuccess) {
      onClose();
    }
  }
  return (
    <MainLayout>
      <div className="flex justify-between pb-3">
        <h1 className="text-2xl font-semibold">User</h1>
        <Button
          color="warning"
          onPress={() => handleOpen()}
          className="capitalize"
        >
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>
      <Modal backdrop={'blur'} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={onsubmit}>
                <ModalHeader className="flex flex-col gap-1">Add New User</ModalHeader>
                <ModalBody>
                  <div className="w-full flex flex-col  gap-4">
                    <InputUI label='Username' placeholder='enter username' onChange={(e) => handleChange(e)} />
                    <InputUI type="password" label='Password' placeholder='*********' />
                    <Select
                      name="role"
                      items={roles}
                      label="Select a role"
                      placeholder="Select a role"
                      className="max-w-xs"
                    >
                      {(role) => <SelectItem key={role.id}>{role.name}</SelectItem>}
                    </Select>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" color="primary" onPress={onClose}>
                    Save
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data.data}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell> {item.username}</TableCell>
              <TableCell>
                <Chip>
                  {item.roles.name}
                </Chip>
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
    </MainLayout >
  )
}
export default User