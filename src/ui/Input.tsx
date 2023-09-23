import { Input } from "@nextui-org/react"
import type { ChangeEventHandler } from "react"

export const InputUI = ({
    onChange,
    onValueChange,
    label,
    placeholder,
    type }:
    { onChange?: ChangeEventHandler, onValueChange?: ((value: string) => void) | undefined, label?: string, placeholder?: string, type?: string }) => {
    const handleOnChange = onChange;
    const handleOnValueChange = onValueChange;
    const name = label?.toLowerCase();

    return (
        <Input name={name} labelPlacement="inside"  radius='md' size='md' type={type} className="max-w-full" variant="bordered" label={label} placeholder={placeholder} onChange={handleOnChange} onValueChange={handleOnValueChange} />
    )
}

