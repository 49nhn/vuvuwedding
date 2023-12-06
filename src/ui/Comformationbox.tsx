import React from 'react'

import { Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react'
type Props = {
    title?: string;
    element?: React.ReactNode | string;
    message?: string;
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
    onConfirm?: () => void;
    onCancel?: () => void;

};

const Comformationbox = (props: Props) => {
    const [isClose, setIsClose] = React.useState(false);
    const message = props.message ?? "Are you sure?";
    const Confirm = () => {
        props.onConfirm?.();
        setIsClose(false);
    }
    return (
        <Popover placement="bottom-start" isOpen={isClose} >
            <PopoverTrigger onClick={() => setIsClose(true)} className='hover:cursor-pointer'>
                {props.element ?? <Button size='sm' color={props.color} > {props.title} </Button>}
            </PopoverTrigger>
            <PopoverContent>
                <p className='text-small font-bold mb-2'>
                    {message}
                </p>
                <div className='flex justify-between gap-x-4'>
                    <Button size='sm' color='success' onPress={Confirm}> Confirm </Button>
                    <Button size='sm' color='danger' onPress={() => setIsClose(false)} > Cancel</Button>
                </div>
            </PopoverContent>
        </Popover>
    );

}

export default Comformationbox