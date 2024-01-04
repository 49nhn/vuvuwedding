/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input} from '@nextui-org/react';
import {MagnifyingGlassIcon} from '@heroicons/react/20/solid';
import MainLayout from "~/layouts/MainLayout";
import {type NextPageWithLayout} from "~/pages/_app";
import {type ReactElement} from "react";

const User: NextPageWithLayout = () =>
    (
        <div className='flex w-full justify-end pb-2 gap-x-3'>
            <Input
                isClearable
                color='primary'
                className="w-fit sm:max-w-[44%]"
                placeholder="Search by name..."
                startContent={<MagnifyingGlassIcon width={14}/>}
                // value={filterValue}
                // onClear={() => onClear()}
                // onValueChange={onSearchChange}
            />
            <Dropdown placement='bottom-start'>
                <DropdownTrigger className='mb-3 self-end'>
                    <Button variant="shadow" color='primary'>
                        Action
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Dynamic Actions">
                    <DropdownItem key="newUser">
                        New User
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    )


User.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            <div className="h-[200vh]">
                {page}
            </div>
        </MainLayout>
    )
}
export default User