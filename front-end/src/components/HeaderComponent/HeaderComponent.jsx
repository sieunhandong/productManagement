import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Popover } from 'antd';
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
import Search from 'antd/es/transfer/search';
import { CaretDownOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading';

function HeaderComponent({ isHiddenSearch = false, isHiddenCart = false }) {

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const navigate = useNavigate();

  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogout = async () => {
    setloading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setloading(false)

  }
  useEffect(() => {
    setloading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setloading(false)
  }, [user?.name, user?.avatar])


  const content = (
    <div>
      <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thong tin nguoi dung</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => navigate('/system/admin')}>Quan ly he thong</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={handleLogout}>Dang xuat</WrapperContentPopup>

    </div>
  )

  return (
    <div style={{ width: '100%', background: 'rgb(26,148,255)', display: 'flex', justifyContent: 'center' }}>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset' }}>
        <Col span={5}>
          <WrapperTextHeader>MiHoo</WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13} style={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonInputSearch
              size="large"
              textButton="Search"
              placeholder="Input search text"
            // onSearch={onSearch}
            />
          </Col>
        )}


        <Col span={6} style={{ display: "flex", gap: "20px", alignItems: 'center' }}>
          <Loading isLoading={loading}>
            <WrapperHeaderAccount>
              <div>
                {userAvatar ? (
                  <img src={userAvatar} alt='avatar'
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  ></img>
                ) : (
                  <UserOutlined style={{ fontSize: '30px' }} />

                )}
              </div>
              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click">
                    <div style={{ cursor: 'pointer' }}>{userName?.length ? userName : user?.email}</div>
                  </Popover>
                </>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall>Sign-in/Sign-up</WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Account</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}

            </WrapperHeaderAccount>
          </Loading>
          {!isHiddenCart && (
            <div>
              <Badge count={4} size='small'>
                <ShoppingCartOutlined style={{ fontSize: '30px', color: "#fff" }} />
              </Badge>
              <WrapperTextHeaderSmall>Gio Hang</WrapperTextHeaderSmall>
            </div>
          )}

        </Col>
      </WrapperHeader>
    </div>
  );
}

export default HeaderComponent;
