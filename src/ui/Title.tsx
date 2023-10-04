import React, { type PropsWithChildren } from 'react'
type Layout = PropsWithChildren & { titleTop?: string }

const TitlePage = ({ titleTop}: Layout) => {
    return (
        <div className='w-full grid items-start bg-content1 shadow-small rounded-medium  dark:bg-content py-3 justify-center '>
            <h1 className='text-2xl font-bold'>{titleTop}</h1>
        </div>
    )
}
export default TitlePage
