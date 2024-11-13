import { ChevronRightIcon, HomeIcon, UserIcon } from '@heroicons/react/20/solid';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react'
import { GlobalConfig } from '~/config/GlobalConfig';
import { api } from '~/utils/api';

const TitlePage = () => {
    const { data, isLoading, isError, isSuccess } = api.Auth.me.useQuery(undefined, GlobalConfig.tanstackOption);
    const logout = api.Auth.logout.useMutation();

    const handleLogout = () => {
        logout.mutate();
        logout && setTimeout(() => window.location.assign('/auth/login'), 2e3);
    }
    const router = useRouter();
    const breadcrumb = useMemo(() => {
        const path = router.asPath.split('/').slice(1);
        const breadcrumb = path.map((item, index) => {
            const link = path.slice(0, index + 1).join('/');
            return (
                <span key={index} className='flex'>
                    <span className='text-default-500  '> <ChevronRightIcon width={"1.5rem"}/> </span>
                    <Link href={`/${link}`} className='capitalize'>
                        {item}
                    </Link>
                </span>
            )
        })
        return breadcrumb;
    }, [router.asPath])

    return (
        <div className='shadow-small rounded-medium  py-1 mx-1 flex items-center'>
            <div className='w-full grid items-start '>
                <div className='flex items-center ps-3'>
                    <Link href={'/'}>
                        <HomeIcon width={"1.5rem"}/>
                    </Link>
                    {breadcrumb}
                </div>
            </div>
            <div className='pe-2'>
                {(isLoading || isError) && <Spinner size="lg"/>}
                {isSuccess && !data?.username ?
                    <div className="lg:flex">
                        <Link href="#">Login</Link>
                    </div> :
                    <div className="lg:flex shadow-small rounded-medium ">
                        <Dropdown>
                            <DropdownTrigger className='data-[hover=true]:bg-default-100/80'>
                                <UserIcon className='w-10 p-2'/>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownItem key="username" variant="bordered"> {data?.username} </DropdownItem>
                                <DropdownItem key="profiles">
                                    <Link href="/auth/profiles">
                                        Profiles
                                    </Link>
                                </DropdownItem>
                                <DropdownItem key="logout" className="text-danger" color="danger"
                                              onClick={handleLogout}>
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                }
            </div>
        </div>
    )
}
export default TitlePage
