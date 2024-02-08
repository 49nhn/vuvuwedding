import React, { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

type Props = {
    title?: string;
    button?: JSX.Element;
    message?: string;
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
    onConfirmPopover: () => void;
    onCancel?: () => void;
};
const AreYouSure = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const message = props.message ?? "Are you sure?";
    const Confirm = () => {
        props.onConfirmPopover();
    }

    return (
        <Popover placement="bottom-start" isOpen={isOpen} radius={"sm"} onClose={() => {setIsOpen(false)}}>
            <PopoverTrigger onClick={() => setIsOpen(true)}>
                {props.button ?? ""}
            </PopoverTrigger>
            <PopoverContent className={"w-auto"}>
                <div className="flex flex-row w-full gap-x-3 ">
                    <div className='text-small  text-danger-300'>
                        <p>
                            {message}
                        </p>
                    </div>
                    <div className={"flex flex-row gap-x-1.5"}>
                        <CheckCircleIcon className={"hover:cursor-pointer text-success"} width={"1.5rem"}
                                         onClick={Confirm}/>
                        <XCircleIcon className={"hover:cursor-pointer "} width={"1.5rem"}
                                     onClick={() => setIsOpen(false)}/>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default AreYouSure