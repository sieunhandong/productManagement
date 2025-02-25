import { Button } from 'antd'
import React from 'react'

const ButtonComponent = ({ size, styleButton, styleTextButton, textButton, ...rests }) => {
    return (
        <div>
            <Button
                style={ styleButton }
                size={size}
                {...rests}
            >
                <span style={{ styleTextButton }}>{textButton}</span>
            </Button>
        </div>
    )
}

export default ButtonComponent