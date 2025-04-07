import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { useQuery } from '@tanstack/react-query';
import { isJsonString } from './utils';
import { jwtDecode } from "jwt-decode";
import * as UserService from './services/UserService'
import { useDispatch } from 'react-redux'
import { updateUser } from './redux/slides/userSlide';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const { storageData, decoded } = handleDecoded()
    console.log('decoded', decoded)
    console.log('storageData', storageData)
    if (decoded?.id) {
      handleGetDetailsUser(decoded.id, storageData)
    }
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

  // Hàm refresh token khi hết hạn
  const handleRefreshToken = async () => {
    try {
      const res = await UserService.refreshToken();
      console.log('res', res)
      if (res?.access_token) {
        localStorage.setItem('access_token', JSON.stringify(res.access_token));
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
      // console.log('User info:', res?.data);
      if (res?.data) {
        dispatch(updateUser({ ...res.data, access_token: token }));
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
  //   console.log('res', res)
  // }
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
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
    </div>
  )
}

export default App