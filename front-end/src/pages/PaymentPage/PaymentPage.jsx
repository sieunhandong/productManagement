import React, { useEffect, useMemo, useState } from 'react';
import { Form, Radio } from 'antd';
import {
  WrapperLeft,
  WrapperRight, WrapperInfo, WrapperTotal, WrapperRadio, Lable
} from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { ModalComponent } from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useForm } from 'antd/es/form/Form';
import { useMutatioHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import * as PaymentService from '../../services/PaymentService'
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PaymentPage() {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [payment, setPayment] = useState('later_money')
  const [delivery, setDelivery] = useState('fast')
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [sdkReady, setSdkReady] = useState(false);
  const [clientId, setClientId] = useState(null);

  const [isModalUpdateInfo, setIsModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  })

  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (isModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        phone: user?.phone,
        address: user?.address
      })
    }
  }, [isModalUpdateInfo])


  const handleChangeAddress = () => {
    setIsModalUpdateInfo(true)
  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemSelectd?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result
  }, [order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemSelectd?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * (totalDiscount * cur.amount) / 100)
    }, 0)
    if (Number(result)) {
      return result
    }
    return 0
  }, [order])

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 200000 && priceMemo < 500000) {
      return 10000
    } else if (priceMemo >= 500000 || order?.orderItemSelectd?.length === 0) {
      return 0
    } else {
      return 20000
    }
  }, [priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo])

  const handleAddOrder = () => {
    if (user?.access_token && order?.orderItemSelectd && user?.name
      && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
      mutationAddOrder.mutate(
        {
          token: user?.access_token,
          orderItems: order?.orderItemSelectd,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: diliveryPriceMemo,
          totalPrice: totalPriceMemo,
          user: user?.id,
          email: user?.email
        }
      )
    }
  }
  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsModalUpdateInfo(false)
  }

  const mutationUpdate = useMutatioHooks(
    (data) => {
      const {
        id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        token,
        { ...rests }
      );
      return res;
    }
  )

  const mutationAddOrder = useMutatioHooks(
    (data) => {
      const {
        token,
        ...rests } = data
      const res = OrderService.createOrder(
        token,
        { ...rests }
      );
      return res;
    }
  )
  const { isPending, data } = mutationUpdate
  const { data: dataAdd, isPending: isPendingAddOrder, isSuccess, isError } = mutationAddOrder

  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {
      const arrayOrdered = []
      order?.orderItemSelectd?.forEach(element => {
        arrayOrdered.push(element.product)
      })
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
      message.success('Đặt hàng thành công')
      navigate('/order-success', {
        state: {
          delivery,
          payment,
          orders: order?.orderItemSelectd,
          totalPriceMemo: totalPriceMemo
        }
      })
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])


  const onSuccessPaypal = async (details, data) => {
    try {
      const res = await data.order.capture(); // <-- capture để thực hiện thanh toán
      mutationAddOrder.mutate(
        {
          token: user?.access_token,
          orderItems: order?.orderItemSelectd,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: diliveryPriceMemo,
          totalPrice: totalPriceMemo,
          user: user?.id,
          isPaid: true,
          paidAt: details.update_time,
          email: user?.email
        }
      )
    } catch (error) {
      console.error('❌ Error capturing payment:', error);
      message.error("Thanh toán thất bại qua PayPal.");
    }
  };


  const handleUpdateInfoUser = () => {
    const { name, phone, address, city } = stateUserDetails
    if (name && phone && address && city) {
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({
            ...user,
            name,
            phone,
            address,
            city
          }))
          setIsModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleDilivery = (e) => {
    setDelivery(e.target.value)
  }
  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig()
    setClientId(data);
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript()
    } else {
      setSdkReady(true)
    }
  }, [])

  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
      <Loading isLoading={isPendingAddOrder}>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h3>Thanh toán</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức giao hàng</Lable>
                  <WrapperRadio onChange={handleDilivery} value={delivery}>
                    <Radio value="fast"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="later_money">Thanh toán tiền mặt khi giao hàng</Radio>
                    <Radio value="paypal">Thanh toán bằng paypal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
            </WrapperLeft>

            <WrapperRight>
              <div style={{ width: '100%' }}>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ: </span>
                    <span style={{ fontWeight: 'bold' }}>{`${user?.address} ${user?.city}`}</span>
                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={handleChangeAddress}>Thay đổi</span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Tạm tính</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Giảm giá</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Phí giao hàng</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(diliveryPriceMemo)}</span>
                  </div>
                </WrapperInfo>

                <WrapperTotal>
                  <span>Tổng tiền</span>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'rgb(254,56,52)', fontSize: 24 }}>
                      {convertPrice(totalPriceMemo)}
                    </span>
                    <span style={{ fontSize: 11 }}>(Đã bao gồm VAT nếu có)</span>
                  </span>
                </WrapperTotal>
              </div>
              {payment === 'paypal' && sdkReady && clientId ? (
                <div style={{ width: '320px' }}>
                  <PayPalScriptProvider options={{ "client-id": clientId }}>
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: {
                              value: Math.round(totalPriceMemo).toString()
                            },
                          }],
                        });
                      }}
                      onApprove={onSuccessPaypal}
                      onError={() => {
                        alert('Thanh toán thất bại.')
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              ) : (
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  size={40}
                  styleButton={{
                    background: 'rgb(255, 57, 69)',
                    height: '48px',
                    width: '320px',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                  textbutton="Đặt hàng"
                  styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                />
              )}

            </WrapperRight>
          </div>
        </div>
        <ModalComponent forceRender title="Cập nhập thông tin giao hàng" open={isModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser}>
          <Loading isLoading={isPending} >
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name" />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please input your city!' }]}
              >
                <InputComponent value={stateUserDetails.city} onChange={handleOnChangeDetails} name="city" />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone!' }]}
              >
                <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone" />

              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name="address" />

              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  );
}

export default PaymentPage;
