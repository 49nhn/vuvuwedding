import {
    Accordion,
    AccordionItem,
    Listbox,
    ListboxItem,
    Popover,
    PopoverContent,
    PopoverTrigger, ScrollShadow
} from "@nextui-org/react";
import {
    AdjustmentsVerticalIcon,
    ArchiveBoxIcon,
    ChevronRightIcon,
    CogIcon,
    HomeIcon,
    UserGroupIcon,
    UsersIcon
} from "@heroicons/react/24/outline";
import Logo from "~/ui/Logo";
import React, { useState } from "react";
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
                title: "Numbering Config",
                icon: <UserGroupIcon width="1.5rem"/>,
                href: "/mdm/numberingConfig",
            },
            {
                title: "Role",
                icon: <UsersIcon width="1.5rem"/>,
                href: "/mdm/role",
            },
            {
                title: "Permission",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/mdm/permission"
            }, 
            {
                title: "Pack Ancestral",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/mdm/packAncestral"
            },
        ]
    },
    {
        title: "Employee",
        icon: <CogIcon width="1.5rem"/>,
        subMenu: [
            {
                title: "User",
                icon: <UserGroupIcon width="1.5rem"/>,
                href: "/employee/user",
            },
            {
                title: "Department",
                icon: <UsersIcon width="1.5rem"/>,
                href: "/employee/department",
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
                title: "Decoration",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/inventory/decoration"
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
                href: "/inventory/weddingDress"
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
                href: "/shows/decoration"
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
                href: "/shows/weddingFlower"
            },
            {
                title: "Other",
                icon: <AdjustmentsVerticalIcon width="1.5rem"/>,
                href: "/shows/other"
            },
        ]
    }
]
export const Sidebar = () => {
    const [isCollapsed, setCollapsed] = useState(true);
    let renderMenuItems = () =>
        menuItems.map((item, index) => {
            if (item.subMenu) {
                return (
                    <ListboxItem key={index} textValue={item.title} className="h-auto py-0">
                        {
                            isCollapsed ? <Accordion isCompact selectionMode={"single"} itemClasses={{
                                base: "py-0 w-full",
                                title: "font-normal text-sm text-inherit",
                            }}>
                                <AccordionItem className="py-0 " startContent={item.icon} key={item.title}
                                               aria-label={item.title}
                                               title={item.title}>
                                    {item.subMenu.map((subItem, index) => (
                                        <Listbox key={index}
                                                 aria-label={subItem.title}
                                                 className="flex flex-col gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 overflow-visible">
                                            <ListboxItem textValue={subItem.title} key={index} className='z-10 '>
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
                                <PopoverContent className="bg-cyan-100/80 dark:bg-blue-950/50">
                                    <Listbox className="w-full ">
                                        {item.subMenu.map((subItem, index) => (
                                            <ListboxItem key={index} textValue={subItem.title} className="w-full" title={subItem.title}>
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
                    <ListboxItem key={index} textValue={item.title} className='z-10 '>
                        <Link
                            className={classNames(isCollapsed ? '' : 'justify-center', 'flex items-center gap-x-2 ps-1')}
                            href={item.href}>
                            {item.icon} {isCollapsed && <span>{item.title}</span>}
                        </Link>
                    </ListboxItem>
                )
            }
        });
    return (
        <div className="max-h-screen">
            <div className=' z-10 relative border-b-blue-900  '>
                <div
                    className='flex items-center justify-center rounded-r-medium  py-3 max-h-[9vh]  bg-cyan-100/20 dark:bg-blue-950/10'>
                    <Logo/>
                    {isCollapsed &&
                        <div className=''>
                            <p className="font-bold text-lg text-inherit">VUVU WEDDING</p>
                        </div>}
                </div>
                <ChevronRightIcon onClick={() => setCollapsed(!isCollapsed)}
                                  className={classNames(isCollapsed ? "transform rotate-180" : "transform rotate-0", "absolute -right-2  z-50 rounded-md bg-sky-600/30 -translate-y-1/2 w-6 h-6 text-inherit text-white p-1")}/>

            </div>
            <ScrollShadow className={" w-full relative shadow-small bg-cyan-100/20 dark:bg-blue-950/5 rounded-r-medium"} hideScrollBar>
                <Listbox selectionMode="none"
                         aria-label="Role Menu"
                         title="Role Menu"
                         className={classNames(isCollapsed ? "w-64" : "w-16 ", " h-[91vh] flex flex-col    p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 overflow-visible")}
                         itemClasses={{
                             base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/20",
                         }}
                         
                >
                    {renderMenuItems()}
                </Listbox>
            </ScrollShadow>
        </div>
    )
}
