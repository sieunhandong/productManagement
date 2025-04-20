import { createSlice } from '@reduxjs/toolkit'
import Item from 'antd/es/list/Item'


const initialState = {
    orderItems: [],
    shippingAddress: {},
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const orderItem = action?.payload?.orderItems
            const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem?.product)
            if (itemOrder) {
                itemOrder.amount += orderItem?.amount
            } else {
                state.orderItems.push(orderItem)
            }
        },
        increaseAmount: (state, action) => {
            const { isProduct } = action?.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === isProduct)
            itemOrder.amount++
        },
        decreaseAmount: (state, action) => {
            const { isProduct } = action?.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === isProduct)
            itemOrder.amount--
        },
        removeOrderProduct: (state, action) => {
            const { isProduct } = action?.payload
            const itemOrder = state?.orderItems?.filter((item) => item?.product !== isProduct)
            state.orderItems = itemOrder
        },
        removeAllOrderProduct: (state, action) => {
            const { listChecked } = action?.payload
            const itemOrders = state?.orderItems?.filter((item) => !listChecked?.includes(item?.product))
            state.orderItems = itemOrders
        }
    },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct, increaseAmount, decreaseAmount, removeOrderProduct, removeAllOrderProduct } = orderSlice.actions

export default orderSlice.reducer