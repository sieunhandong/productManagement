import React, { useEffect, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import * as OrderCervice from '../../services/OrderService'
import { orderContant } from '../../contant'
import PieChartComponent from './PieChart'
import { convertPrice } from '../../utils'



export const OrderAdmin = () => {
    const [rowSelected, setRowSelected] = useState('');
    const user = useSelector((state) => state.user);

    const getAllOrder = async () => {
        const res = await OrderCervice.getAllOrder(user?.access_token)
        return res
    }

    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
    const { isLoading: isLoadingOrder, data: orders } = queryOrder

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }}
                onKeyDown={(e) => e.stopPropagation()}>
                <InputComponent
                    // ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        // onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value).toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    // setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
    });


    const columns = [
        {
            title: 'User Name',
            dataIndex: 'useName',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.useName.length - b.useName.length,
            ...getColumnSearchProps('useName'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Paied',
            dataIndex: 'isPaid',
            sorter: (a, b) => a.isPaid.length - b.isPaid.length,
            ...getColumnSearchProps('isPaid'),
        },
        {
            title: 'Shipped',
            dataIndex: 'isDelivered',
            sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
            ...getColumnSearchProps('isDelivered'),
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
            ...getColumnSearchProps('paymentMethod'),
        },
        // {
        //     title: 'Ship Method',
        //     dataIndex: 'paymentMethod',
        //     sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
        //     ...getColumnSearchProps('paymentMethod'),
        // },

        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
            ...getColumnSearchProps('totalPrice'),
        },
    ];
    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        console.log('order', order)
        return {
            ...order,
            key: order._id,
            useName: order?.shippingAddress?.fullName,
            phone: order?.shippingAddress?.phone,
            address: order?.shippingAddress?.address,
            paymentMethod: orderContant.payment[order?.paymentMethod],
            isPaid: order?.isPaid ? 'Yes' : 'No',
            isDelivered: order?.isDelivered ? 'Yes' : 'No',
            totalPrice: convertPrice(order?.totalPrice),
        }
    })

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ height: 200, width: 200 }}>
                <PieChartComponent data={orders?.data} />
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    columns={columns}
                    isLoading={isLoadingOrder}
                    data={dataTable}
                />
            </div>
        </div>
    )
}
