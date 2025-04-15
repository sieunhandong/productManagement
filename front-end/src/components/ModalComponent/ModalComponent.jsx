import { Modal } from 'antd'
import React from 'react'

export const ModalComponent = ({ title = 'Modal', isOpen = false, children, ...rest }) => {
    return (
        <Modal title={title} open={isOpen} {...rest}>{children}</Modal>
    )
}
