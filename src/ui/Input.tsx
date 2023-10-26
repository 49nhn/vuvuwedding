import { Input } from '@nextui-org/react'
import React, { type HTMLInputTypeAttribute, useState } from 'react'

type InputProps = {
    label?: string,
    type?: HTMLInputTypeAttribute,
    name?: string,
    placeholder?: string,
    variant?: "underlined" | "flat" | "faded" | "bordered" | undefined
    Invalid?: true | false,
}
const InputUI = (props?: InputProps | undefined) => {
    const inputProps = {
        label: props?.label ?? undefined,
        type: props?.type ?? "text",
        name: props?.name ?? props?.label?.toLocaleLowerCase().split(" ").join("_") ?? "",
        placeholder: props?.placeholder ?? "ssss",
        variant: props?.variant ?? "underlined",
        Invalid: props?.Invalid ?? false,
    }
    const [value, setValue] = useState("")
    const [isInvalid, setIsInvalid] = useState(false)
    const handlerOnchange = (e: string) => {
        setValue(e)
        if (e.length > 0) {
            setIsInvalid(false)
        } else {
            setIsInvalid(true)
        }
    }
    const Element =
        <Input
            label={inputProps.label}
            name={inputProps.name}
            placeholder={inputProps.placeholder}
            variant={inputProps.variant}
            isRequired={inputProps.Invalid}
            type={inputProps.type}
            isInvalid={inputProps.Invalid}
            onValueChange={(e) => handlerOnchange(e)}
            color={isInvalid ? "danger" : undefined}
            errorMessage={isInvalid && "Please enter a valid"}
            onClear={() => console.log("input cleared")}
        />
    return { Element, value }
}
export default InputUI