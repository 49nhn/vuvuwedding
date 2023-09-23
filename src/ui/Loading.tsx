import { Spinner } from '@nextui-org/react'
import React from 'react'

const Loading = () => {
    return (
        <div className='grid place-content-center h-screen min-w-full' >
            <Spinner label="Loading..." color="warning" />
        </div>
    )
}

export default Loading