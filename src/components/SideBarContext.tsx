import { Accordion, AccordionItem, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { AdjustmentsVerticalIcon, ArchiveBoxIcon, CogIcon, HomeIcon, UserGroupIcon, UsersIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Logo from "~/ui/Logo";
import React, { useEffect, useState } from "react";
import Link from "next/link";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const menuItems = [
    {
        title: "Dashboard",
        icon: <HomeIcon width="1.5rem"/>,
        href: "/",
    },
    {
        title: "MDM",
        icon: <CogIcon width="1.5rem"/>,
        subMenu: [
            {
                title: "User",
                icon: <UserGroupIcon width="1.5rem"/>,
                href: "/employee/user",
            },
            {
                title: "Role",
                icon: <UsersIcon width="1.5rem"/>,
                href: "/employee/role",
            },
            {
                title: "Permission",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/employee/permission"
            },
        ]
    },
    {
        ///inventory
        title: "Inventory",
        icon: <ArchiveBoxIcon width="1.5rem"/>,
        subMenu: [
            {
                title: "All",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/inventory/all"
            },
            {
                title: "Decorator",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/inventory/decorator"
            },
            {
                title: "Photo",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/inventory/photo"
            },
            {
                title: "Wedding Presents",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/inventory/weddingPresents"
            },
            {
                title: "Wedding dress",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/inventory/wedding-dress"
            },
        ]
    },
    {
        title: "Shows",
        icon: <ArchiveBoxIcon width="1.5rem"/>,
        subMenu: [
            {
                title: "All",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/shows/all"
            },
            {
                title: "Decoration",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/shows/decorator"
            },
            {
                title: "Photo",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/shows/photo"
            },
            {
                title: "Wedding Presents",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/shows/weddingPresents"
            },
            {
                title: "Makeup",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/shows/makeup"
            },
            {
                title: "Wedding dress",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/shows/weddingDress"
            },
            {
                title: "Wedding Flower",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/shows/weddingCar"
            },
            {
                title: "Other",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/shows/other"
            },
        ]
    }

]
const SidebarPro = () => {
    const [isCollapsed, setCollapsed] = useState(true);


    const renderMenuItems = () =>
        menuItems.map((item, index) => {
            if (item.subMenu) {
                return (
                    <ListboxItem key={index} className="h-fit py-0">
                        {
                            isCollapsed ? <Accordion isCompact itemClasses={{
                                base: "py-0 w-full",
                                title: "font-normal text-sm text-inherit",
                            }}>
                                <AccordionItem className="py-0 w-full " startContent={item.icon} key={index + 10}
                                               aria-label={item.title}
                                               title={item.title}>
                                    {item.subMenu.map((subItem, index) => (
                                        <Listbox key={index}
                                                 className="flex flex-col gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 overflow-visible">
                                            <ListboxItem key={index} className='z-10 '>
                                                <Link
                                                    className={classNames(isCollapsed ? '' : 'justify-center', 'flex items-center  ')}
                                                    href={subItem.href}>
                                                    {item.icon} {isCollapsed &&
                                                    <span className="ms-1.5">{subItem.title}</span>}
                                                </Link>
                                            </ListboxItem>
                                        </Listbox>
                                    ))}
                                </AccordionItem>
                            </Accordion> : <Popover placement='right-end'>
                                <PopoverTrigger>
                                    <p className={classNames(isCollapsed ? '' : 'justify-center', 'flex items-center py-3  gap-x-2')}>
                                        {item.icon} {isCollapsed && <span>{item.title}</span>}
                                    </p>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Listbox className="w-full">
                                        {item.subMenu.map((subItem, index) => (
                                            <ListboxItem key={index} className="w-full">
                                                <Link className='flex items-center '
                                                      href={subItem.href}>
                                                    {item.icon}
                                                    <span className="ms-1.5">{subItem.title}</span>
                                                </Link>
                                            </ListboxItem>
                                        ))}
                                    </Listbox>
                                </PopoverContent>
                            </Popover>
                        }
                    </ListboxItem>

                )
            } else {
                return (
                    <ListboxItem key={index} className='z-10 '>
                        <Link
                            className={classNames(isCollapsed ? '' : 'justify-center', 'flex items-center gap-x-2 ps-1')}
                            href={item.href}>
                            {item.icon} {isCollapsed && <span>{item.title}</span>}
                        </Link>
                    </ListboxItem>
                )
            }
        })
    return (
        <div className="max-h-screen-[2rem]">
            <div className='h-34 z-10 relative '>
                <div
                    className='flex items-center justify-center rounded-r-medium  py-3  bg-cyan-100/20 dark:bg-cyan-600/20'>
                    <Logo/>
                    {isCollapsed &&
                        <div className=''>
                            <p className="font-bold text-lg text-inherit">VUVU WEDDING</p>
                        </div>}
                </div>
                <ChevronRightIcon onClick={() => setCollapsed(!isCollapsed)}
                                  className={classNames(isCollapsed ? "transform rotate-180" : "transform rotate-0", "absolute -right-2 rounded-md bg-sky-600/30 -translate-y-1/2 w-6 h-6 text-inherit text-white p-1")}/>

            </div>
            <Listbox
                aria-label="Role Menu"
                className={classNames(isCollapsed ? "w-64" : "w-16 ", "h-screen flex flex-col  shadow-small bg-cyan-100/20 dark:bg-cyan-950/20 rounded-r-medium  p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 overflow-visible")}
                itemClasses={{
                    base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/20",
                }}>
                {renderMenuItems()}
            </Listbox>
        </div>
    )
}
export { SidebarPro }