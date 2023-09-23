import { Button,  Link, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Spinner } from "@nextui-org/react";
import { useState } from "react";
import { GlobalConfig } from "~/config/GlobalConfig";
import Logo from "~/ui/Logo"
import { api } from "~/utils/api";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const NavBar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data, isLoading, isError, isSuccess } = api.Auth.me.useQuery(undefined, GlobalConfig.tanstackOption);
    const logout = api.Auth.logout.useMutation();
    const handleLogout = () => {
        console.log('logout');
        logout.mutate();
        logout && setTimeout(() => window.location.assign('/auth/login'), 2e3);
    }

    return (
        <Navbar shouldHideOnScroll onMenuOpenChange={setIsMenuOpen} isBordered >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Link href="/" className="flex items-center gap-2 text-current ">
                        <Logo />
                        <div>
                            <p className="font-bold text-inherit">VUVU</p>
                            <p className="font-bold text-inherit">WEDDING</p>
                        </div>
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {GlobalConfig.menuItems.map((item, index) => (
                    <NavbarItem key={`${item.label}-${index}`}>
                        <Link
                            className={classNames(item.current ? "text-orange-500 dark:text-green-300 " : "text-current", "w-full")}
                            href={item.href}
                        >
                            {item.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent justify="end">
                {(isLoading || isError) && <Spinner size="lg" />}
                {
                    isSuccess && !data?.username ?
                        <NavbarItem className="lg:flex">
                            <Link href="#">Login</Link>
                        </NavbarItem> :
                        <NavbarItem className="lg:flex">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button variant="bordered" > {data?.username} </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="profiles">Profiles</DropdownItem>
                                    <DropdownItem key="logout" className="text-danger" color="danger" onClick={handleLogout} >
                                        Logout
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                }
            </NavbarContent>
            <NavbarMenu>
                {GlobalConfig.menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item.label}-${index}`}>
                        <Link
                            color={item.current ? "primary" : "foreground"}
                            className="w-full"
                            href={item.href}
                            size="sm"
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    )
}

export default NavBar

