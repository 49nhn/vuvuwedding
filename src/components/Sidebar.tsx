import Link from 'next/link';
import React, { useState } from 'react'
import Logo from '~/ui/Logo';
import { GlobalConfig } from "~/config/GlobalConfig";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from '@nextui-org/react';
import { api } from '~/utils/api';


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
const Sidebar = () => {
    const { data, isLoading, isError, isSuccess } = api.Auth.me.useQuery(undefined, GlobalConfig.tanstackOption);
    const logout = api.Auth.logout.useMutation();
    const handleLogout = () => {
        console.log('logout');
        logout.mutate();
        logout && setTimeout(() => window.location.assign('/auth/login'), 2e3);
    }
    return (
        <div className='flex flex-col border-small px-1 py-2 drop-shadow-md rounded-small border-default-200 dark:border-default-100'>
            <div className='flex justify-between'>
                <Link href="/" className="flex items-center gap-2 text-current ">
                    <Logo />
                </Link>
            </div>

            <ul className="list-inside pt-6">
                {GlobalConfig.menuItems.map((item) => (
                    <li key={item.label} className="list-item hover:bg-slate-700  px-3 py-2 ">
                        <Link
                            className={classNames(item.current ? "text-orange-500 dark:text-green-300 " : "text-current", "w-full ")}
                            href={item.href}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default Sidebar