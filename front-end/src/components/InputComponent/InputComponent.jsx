import { Input } from 'antd'
import React from 'react'

const InputComponent = ({ size, placeholder, bordered, style, ...rests }) => {
    return (
        <div>

            <Input size={size}
                placeholder={placeholder}
                bordered={false}
                style={style}
                {...rests}
            />
        </div>
    )
}

export default InputComponent