import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    orderItems: [],
    orderItemSelectd: [],
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
            const itemOrderSelected = state?.orderItemSelectd?.find((item) => item?.product === isProduct)
            itemOrder.amount++;
            if (itemOrderSelected) {
                itemOrderSelected.amount++;
            }
        },
        decreaseAmount: (state, action) => {
            const { isProduct } = action?.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === isProduct)
            const itemOrderSelected = state?.orderItemSelectd?.find((item) => item?.product === isProduct)
            itemOrder.amount--;
            if (itemOrderSelected) {
                itemOrderSelected.amount--;
            }
        },
        removeOrderProduct: (state, action) => {
            const { isProduct } = action?.payload
            const itemOrder = state?.orderItems?.filter((item) => item?.product !== isProduct)
            const itemOrderSelected = state?.orderItemSelectd?.filter((item) => item?.product !== isProduct)
            state.orderItems = itemOrder;
            state.orderItemSelectd = itemOrderSelected;
        },
        removeAllOrderProduct: (state, action) => {
            const { listChecked } = action?.payload
            const itemOrders = state?.orderItems?.filter((item) => !listChecked?.includes(item?.product))
            const itemOrdersSelected = state?.orderItems?.filter((item) => !listChecked?.includes(item?.product))
            state.orderItems = itemOrders
            state.orderItemSelectd = itemOrdersSelected
        },
        selectedOrder: (state, action) => {
            const { listChecked } = action?.payload
            const orderSelected = []
            state.orderItems.forEach((order) => {
                if (listChecked.includes(order?.product)) {
                    orderSelected.push(order)
                }
            })
            state.orderItemSelectd = orderSelected
        }
    },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct,
    increaseAmount,
    decreaseAmount,
    removeOrderProduct,
    removeAllOrderProduct,
    selectedOrder } = orderSlice.actions

export default orderSlice.reducer