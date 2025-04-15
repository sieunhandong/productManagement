import React from 'react'
import { WrapperHeader } from './style'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'

export const AdminUser = () => {
    return (
        <div>
            <WrapperHeader>Quan ly nguoi dung</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}><PlusOutlined style={{ fontSize: '40px' }} /></Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent />
            </div>
        </div>
    )
}
