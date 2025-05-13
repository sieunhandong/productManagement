import axios from "axios"

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/sign-in`, data)
    return res.data
}
export const signUpUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/sign-up`, data)
    return res.data
}
export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/get-details/${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        }
    )
    return res.data
}
export const deleteUser = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL_BACKEND}/user/delete-user/${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        }
    )
    return res.data
}
export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/getAll`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        }
    )
    return res.data
}
export const refreshToken = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/refresh-token`,
        {}, // ✅ Body rỗng, vì refresh token nằm trong cookie
        {
            withCredentials: true, // 🔥 QUAN TRỌNG: Cho phép gửi cookie
            headers: {
                "Content-Type": "application/json"
            }
        });
    return res.data;
};
export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/log-out`);
    return res.data;
};
export const updateUser = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL_BACKEND}/user/update-user/${id}`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};
export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/upload-avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data; // { message, url }
};
export const deleteManyUser = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/delete-many`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        }
    )
    return res.data
}