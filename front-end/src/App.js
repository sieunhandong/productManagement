import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { useQuery } from '@tanstack/react-query';
import { isJsonString } from './utils';
import { jwtDecode } from "jwt-decode";
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/slides/userSlide';
import { store } from './redux/store'
import Loading from './components/LoadingComponent/Loading';
import 'antd/dist/reset.css';
function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    setIsLoading(true)
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded.id, storageData)
    }
    setIsLoading(false)
  }, [])

  // Hàm decode token từ localStorage
  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token');
    let decoded = {};

    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };
  // Hàm cập nhật access_token vào Redux mà vẫn giữ thông tin cũ
  const updateAccessTokenInRedux = (token) => {
    const currentUser = store.getState().user;
    dispatch(updateUser({ ...currentUser, access_token: token }));
  };
  // Hàm refresh token khi hết hạn
  const handleRefreshToken = async () => {
    try {
      const res = await UserService.refreshToken();
      if (res?.access_token) {
        localStorage.setItem('access_token', JSON.stringify(res.access_token));
        // Cập nhật Redux luôn
        updateAccessTokenInRedux(res.access_token);
        return res.access_token;
      }
    } catch (error) {
      console.error("Lỗi refresh token:", error);
    }
    return null;
  };

  // Interceptor tự động refresh token khi cần
  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date();
    let { decoded, storageData } = handleDecoded();

    if (decoded?.exp < currentTime.getTime() / 1000) {
      console.log("Token hết hạn, đang refresh...");
      const newToken = await handleRefreshToken();
      if (newToken) {
        storageData = newToken;
      }
    }
    config.headers['Authorization'] = `Bearer ${storageData}`;
    return config;
  }, (err) => {
    return Promise.reject(err);
  });

  // Hàm lấy thông tin user
  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      if (res?.data) {
        dispatch(updateUser({ ...res.data, access_token: token }));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
    }
  };

  // const handleDecoded = () => {
  //   let storageData = localStorage.getItem('access_token')
  //   let decoded = {}
  //   if (storageData && isJsonString(storageData)) {
  //     storageData = JSON.parse(storageData)
  //     decoded = jwtDecode(storageData)
  //   }
  //   return { decoded, storageData }
  // }


  // UserService.axiosJWT.interceptors.request.use(async (config) => {
  //   const currentTime = new Date()
  //   const { decoded } = handleDecoded()

  //   if (decoded?.exp < currentTime.getTime() / 1000) {
  //     const data = await UserService.refreshToken()
  //     config.headers['Authorization'] = `Bearer ${data?.access_token}`
  //   }
  //   return config;
  // }, (err) => {
  //   return Promise.reject(err)
  // })

  // const handleGetDetailsUser = async (id, token) => {
  //   const res = await UserService.getDetailsUser(id, token)
  //   dispatch(updateUser({ ...res?.data, access_token: token }))
  // }
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Loading isLoading={isLoading} style={{ backgroundColor: '#ccc' }}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const isCheckAuth = !route.isPrivate || user.isAdmin
              if (!isCheckAuth) return null;
              const Layout = route.isShowHeader ? DefaultComponent : React.Fragment;
              return (
                <Route key={route.path} path={route.path} element={
                  <Layout>
                    <Page />
                  </Layout>
                } />
              )
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  )
}

export default App