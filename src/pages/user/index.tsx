import { Button, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, getKeyValue } from '@nextui-org/react';
import { GlobalConfig } from '~/config/GlobalConfig';
import MainLayout from '~/layouts/MainLayout';
import { api } from '~/utils/api';
import { useMemo, useState } from 'react';
import { EyeIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Role } from '@prisma/client';

const User = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = api.User.list.useQuery({ page: page, itemPerPage: 10, filter: null }, GlobalConfig.tanstackOption);
  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / data.itemPerPage) : 0;
  }, [data?.total, data?.itemPerPage]);

  const data1 = useMemo(() => {
    return data?.data ? data : { data: [], total: 0, itemPerPage: 0, page: 0 };
  }, [data])

  if (isError) {
    return <div>Error</div>
  }
  const loadingState = isLoading || data?.data.length === 0 ? "loading" : "idle";
  return (
    <MainLayout title='User'>
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
        <Button size='md' className='bg-primary-500 hover:bg-primary-600 text-white'>Add User</Button>

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
        <TableBody items={data1.data} loadingContent={<Spinner />} loadingState={loadingState}>
          {(item) => (
            <TableRow key={item?.username}>
              {(columnKey) => <TableCell>
                {getKeyValue(item, columnKey)}
                {columnKey === 'role' &&
                  <div className="text-sm text-default-500">
                    {item?.roles.name}
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
    </MainLayout >
  )
}

export default User