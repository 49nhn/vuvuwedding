import { Card } from '@nextui-org/react'
import React from 'react'
import MainLayout from '~/layouts/MainLayout'

const error = () => {
    return (
        <MainLayout>
            <Card>
                <h1>404</h1>
            </Card>
        </MainLayout>
    )
}

export default error