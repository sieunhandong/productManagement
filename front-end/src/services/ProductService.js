import axios from "axios"

export const axiosJWT = axios.create()

export const getAllProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-all-product`)
    return res.data
}
export const createProduct = async (data) => {
    console.log('data', data)
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/product/create-product`,
        data
        // {
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${token}`,
        //     },
        // }

    )
    return res.data
}
export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/details-product/${id}`
    )
    return res.data
}
export const updateProduct = async (id, access_token, data) => {
    console.log('access_token', access_token)
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL_BACKEND}/product/update-product/${id}`
        , data,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        }
    )
    return res.data
}
export const deleteProduct = async (id, access_token) => {
    console.log('access_token', access_token)
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL_BACKEND}/product/delete-product/${id}`
        ,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        }
    )
    return res.data
}