import { axiosJWT } from "./UserService"

// export const createProduct = async (data) => {
//     const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/product/create-product`,
//         data
//     )
//     return res.data
// }

export const createOrder = async (access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL_BACKEND}/order/create`
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