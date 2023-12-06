import Link from 'next/link';
import React, { useState } from 'react'
import Logo from '~/ui/Logo';
import { GlobalConfig } from "~/config/GlobalConfig";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Listbox, ListboxItem, Spinner } from '@nextui-org/react';
import { api } from '~/utils/api';
import { UserIcon, NewspaperIcon, CameraIcon, PaintBrushIcon, BuildingOffice2Icon, UserGroupIcon } from "@heroicons/react/20/solid"


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
const Sidebar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true)
    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen)
        console.log(isMenuOpen);
    }
    return (
        <Listbox
            aria-label="User Menu"
            onAction={(key) => console.log(key)}
            className={classNames(isMenuOpen ? "w-64" : "w-16 ", "h-screen flex flex-col  shadow-small rounded-r-medium  p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 overflow-visible")}
            itemClasses={{ base: "px-3 py-6 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80" }}>
            <ListboxItem key="" className='h-34 z-10 ' onClick={handleMenuOpen} >
                <div className='flex items-center'>
                    <Logo />
                    {isMenuOpen &&
                        <div className=''>
                            <p className="font-bold text-lg text-inherit">VUVU</p>
                            <p className="font-bold text-lg text-inherit">WEDDING</p>
                        </div>}
                </div>
            </ListboxItem>
            <ListboxItem key="Dashboard">
                <Link href={"/"} className={classNames(isMenuOpen ? '' : 'justify-center', 'flex items-center  gap-x-2')}>
                    <NewspaperIcon className='w-8' />  {isMenuOpen && <span>Dashboard</span>}
                </Link>
            </ListboxItem>
            <ListboxItem key="Decor">
                <Link href={"/"} className={classNames(isMenuOpen ? '' : 'justify-center', 'flex items-center  gap-x-2')}>
                    <BuildingOffice2Icon className='w-8' />  {isMenuOpen && <span>Decor</span>}
                </Link>
            </ListboxItem>
            <ListboxItem key="Photo">
                <Link href={"/"} className={classNames(isMenuOpen ? '' : 'justify-center', 'flex items-center  gap-x-2')}>
                    <CameraIcon className='w-8' />  {isMenuOpen && <span>Photo</span>}
                </Link>
            </ListboxItem>
            <ListboxItem key="MakeUp">
                <Link href={"/"} className={classNames(isMenuOpen ? '' : 'justify-center', 'flex items-center  gap-x-2')}>
                    <PaintBrushIcon className='w-8' />  {isMenuOpen && <span>MakeUp</span>}
                </Link>
            </ListboxItem>
            <ListboxItem key="User">
                <Link href={"/user"} className={classNames(isMenuOpen ? '' : 'justify-center', 'flex items-center  gap-x-2')}>
                    <UserGroupIcon className='w-8' />  {isMenuOpen && <span>User</span>}
                </Link>
            </ListboxItem>
            <ListboxItem key="Manager">
                <Dropdown>
                    <DropdownTrigger>
                        <p className={classNames(isMenuOpen ? '' : 'justify-center', 'flex items-center  gap-x-2')}>
                            <PaintBrushIcon className='w-8' />  {isMenuOpen && <span>Manager</span>}
                        </p>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Action event example" onAction={(key) => alert(key)}>
                        <DropdownItem key="new">New file</DropdownItem>
                        <DropdownItem key="copy">Copy link</DropdownItem>
                        <DropdownItem key="edit">Edit file</DropdownItem>
                        <DropdownItem key="delete" className="text-danger" color="danger">
                            Delete file
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </ListboxItem>
        </Listbox>
    )
}

export default Sidebar