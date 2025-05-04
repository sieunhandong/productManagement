
const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        console.log('req.body', req.body)
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = req.body
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createOrder,
}