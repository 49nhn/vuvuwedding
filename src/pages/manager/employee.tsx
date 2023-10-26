import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { Table, Pagination, TableHeader, TableColumn, TableBody, Spinner, TableRow, TableCell, getKeyValue, Tooltip } from '@nextui-org/react';
import { useMemo, useState } from 'react'
import { GlobalConfig } from '~/config/GlobalConfig';
import { api } from '~/utils/api';

const Employee = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = api.Employee.list.useQuery({ page: page, itemPerPage: 10, filter: null }, GlobalConfig.tanstackOption);
  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / data.itemPerPage) : 0;
  }, [data?.total, data?.itemPerPage]);

  const employeeList = useMemo(() => {
    return data?.data ? data : { data: [], total: 0, itemPerPage: 0, page: 0 };
  }, [data])
  if (isError) <div>Error</div>
  console.log(employeeList);

  const loadingState = isLoading ? "loading" : "idle";

  return (
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
          <TableColumn key="jobNames">Job Names</TableColumn>
          <TableColumn key="salesman">Salesman</TableColumn>
          <TableColumn key="birthday">Birthday</TableColumn>
          <TableColumn key="address">Address</TableColumn>
          <TableColumn key="phone">Phone</TableColumn>
          <TableColumn key="email">Email</TableColumn>
          <TableColumn key="Action">Action</TableColumn>


        </TableHeader>
        <TableBody items={employeeList.data} loadingContent={<Spinner label='Loading...' />} loadingState={loadingState}
          emptyContent="No data"
        >
          {
            (item?) => (
              <TableRow key={item?.id}>
                {(columnKey) => <TableCell>
                  {getKeyValue(item, columnKey)}

                  {columnKey === 'jobNames' &&
                    <div className="text-sm text-default-500">
                      {item?.jobNames}
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
            )

          }
        </TableBody>
      </Table>
    </div>
  )
}

export default Employee