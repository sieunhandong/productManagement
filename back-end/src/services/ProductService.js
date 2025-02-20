const Product = require("../models/ProductModel")


const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct

        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already'
                })
            }
            const createProduct = await Product.create({
                name, image, type, price, countInStock, rating, description
            })
            if (createProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createProduct
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }
            const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            console.log("User ID:", id);
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete User Success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = async (limit = 8, page = 0) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProuct = await Product.countDocuments()
            const users = await Product.find().limit(limit).skip(page * limit);
            resolve({
                status: 'OK',
                message: 'Get all products successfully',
                data: users,
                total: totalProuct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProuct / limit)
            });
        } catch (e) {
            reject(e);
        }
    });
}
const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The Product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: checkProduct
            })
        } catch (e) {
            reject(e)
        }
    })

}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct
}