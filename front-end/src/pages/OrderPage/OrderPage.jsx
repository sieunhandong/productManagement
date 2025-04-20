import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  WrapperLeft, WrapperStyleHeader, WrapperListOrder,
  WrapperItemOrder, WrapperPriceDiscount, WrapperCountOrder,
  WrapperRight, WrapperInfo, WrapperTotal
} from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import imag from '../../assets/images/product1.png';

function OrderPage({ count = 1 }) {
  const [quantity, setQuantity] = useState(10);
  const price = 121;
  const discountPrice = 230;
  const totalPrice = price * quantity;

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: 'flex' }}>
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={{ display: 'inline-flex', width: '390px', gap: 4 }}>
                <Checkbox />
                <span>Tất cả ({count} sản phẩm)</span>
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 65 }}>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined style={{ cursor: 'pointer' }} />
              </div>
            </WrapperStyleHeader>

            <WrapperListOrder>
              <WrapperItemOrder>
                <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Checkbox />
                  <img src={imag} alt="product" style={{ width: 77, height: 77, objectFit: 'cover' }} />
                  <div>name sản ooamr</div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 65 }}>
                  <span>
                    <span style={{ fontSize: 13, color: '#242424' }}>{price}đ</span>
                    <WrapperPriceDiscount>{discountPrice}đ</WrapperPriceDiscount>
                  </span>

                  <WrapperCountOrder>
                    <button style={{ border: 'none', background: 'transparent' }} onClick={handleMinus}>
                      <MinusOutlined style={{ cursor: 'pointer' }} />
                    </button>
                    <span style={{ margin: '0 8px' }}>{quantity}</span>
                    <button style={{ border: 'none', background: 'transparent' }} onClick={handlePlus}>
                      <PlusOutlined style={{ cursor: 'pointer' }} />
                    </button>
                  </WrapperCountOrder>

                  <span style={{ color: 'rgb(255,66,78)', fontSize: 13 }}>{totalPrice}đ</span>
                  <DeleteOutlined style={{ cursor: 'pointer' }} />
                </div>
              </WrapperItemOrder>
            </WrapperListOrder>
          </WrapperLeft>

          <WrapperRight>
            <div style={{ width: '100%' }}>
              <WrapperInfo>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tạm tính</span>
                  <span style={{ fontSize: 13 }}>0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Giảm giá</span>
                  <span style={{ fontSize: 13 }}>0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Thuế</span>
                  <span style={{ fontSize: 13 }}>0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Phí giao hàng</span>
                  <span style={{ fontSize: 13 }}>0</span>
                </div>
              </WrapperInfo>

              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'rgb(254,56,52)', fontSize: 24 }}>
                    {String(totalPrice).padStart(4, '0')}đ
                  </span>
                  <span style={{ fontSize: 11 }}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>

            <ButtonComponent
              size={40}
              styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '220px',
                border: 'none',
                borderRadius: '4px'
              }}
              textButton="Mua hàng"
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            />
          </WrapperRight>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
