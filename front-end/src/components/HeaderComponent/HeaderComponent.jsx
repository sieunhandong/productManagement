import React from 'react';
import { Col } from 'antd';
import { WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
import Search from 'antd/es/transfer/search';
import { CaretDownOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
function HeaderComponent() {
  return (
    <WrapperHeader>
      <Col span={6}>
        <WrapperTextHeader>MiHoo</WrapperTextHeader>
      </Col>
      <Col span={12}>
        <ButtonInputSearch
          size='large'
          textButton="Search"
          placeholder="Input search text"
        // onSearch={onSearch}
        />
      </Col>

      <Col span={6} style={{ display: "flex", gap: "20px", alignItems: 'center' }}>
        <WrapperHeaderAccount>
          <div>
            <UserOutlined style={{ fontSize: '30px' }} />
          </div>
          <div>
            <WrapperTextHeaderSmall>Sign-in/Sign-up</WrapperTextHeaderSmall>
            <div>
              <WrapperTextHeaderSmall>Account</WrapperTextHeaderSmall>
              <CaretDownOutlined />
            </div>
          </div>
        </WrapperHeaderAccount>
        <div>
          <ShoppingCartOutlined style={{ fontSize: '30px', color: "#fff" }} />
          <WrapperTextHeaderSmall>Gio Hang</WrapperTextHeaderSmall>
        </div>
      </Col>
    </WrapperHeader>
  );
}

export default HeaderComponent;
