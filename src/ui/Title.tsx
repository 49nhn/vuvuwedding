import { HomeIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react'


const TitlePage = () => {

    const router = useRouter();
    const breadcrumb = useMemo(() => {
        const path = router.asPath.split('/').slice(1);
        const breadcrumb = path.map((item, index) => {
            const link = path.slice(0, index + 1).join('/');
            return (
                <span key={index} className='flex'>
                    <span className='text-default-500 '> <ChevronRightIcon width={"1.5rem"}/> </span>
                    <Link href={`/${link}`} className='capitalize'>
                        {item}
                    </Link>
                </span>
            )
        })
        return breadcrumb;
    }, [router.asPath])

    return (
        <div className='w-full grid items-start bg-content1 shadow-small rounded-medium  dark:bg-content py-3 '>
            <div className='flex items-center ps-3'>
                <HomeIcon width={"1.5rem"} />
                {breadcrumb}
            </div>
        </div>
    )
}
export default TitlePage
