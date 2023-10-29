import { Select } from '@nextui-org/react'
import React from 'react'
type TOption = {
    label?: string,
    value?: string,
    disabled?: boolean,
    children?: TOption[]

}
const SelectUI = (option, data?:any) => {


    const rederSelect = () => {
        return (
            <Select variant="underlined" isRequired label="Favorite Animal" className="max-w-xs"            >

                {
                    data?.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                            {role.name}
                        </SelectItem>
                    ))
                }
            </Select>
        )
    }
}

export default SelectUI