import { Col, Image, InputNumber, Rate, Row } from 'antd'
import React, { use, useState } from 'react'
import imageProductSmall from '../../assets/images/product1Small.png'
import { WrapperAddressProduct, WrapperBtnQuanlityProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQuanlityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'

const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const onChange = (value) => {
        setNumProduct(Number(value))
    }
    const fetchGetProductDetails = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }

    }
    console.log("location", location)
    const handleChangeCount = (type) => {
        if (type === 'increase') {
            setNumProduct(numProduct + 1)
        } else {
            setNumProduct(numProduct - 1)
        }
    }
    const { isLoading, data: productDetails } = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetProductDetails,
        enabled: !!idProduct,
    })

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            // {
            //     name: { type: String, required: true },
            //     amount: { type: String, required: true, unique: true },
            //     image: { type: String, required: true },
            //     price: { type: Boolean, default: false, required: true },
            //     product: {
            //         type: mongoose.Schema.Types.ObjectId,
            //             ref: 'Product',
            //                 required: true,
            //             },
            // },
            dispatch(addOrderProduct({
                orderItems: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    discount: productDetails?.discount,
                    countInStock: productDetails?.countInStock
                }
            }))
        }
    }
    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image src={productDetails?.image} alt='image product' preview={false} />
                    <Row style={{ paddingTop: '10px ', justifyContent: 'space-between' }}>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                        </WrapperStyleColImage>
                    </Row>
                </Col>
                <Col span={14} style={{ paddingLeft: '10px' }}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                        <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>

                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến </span>
                        <span className='address'>{user?.address}</span>-
                        <span className='change-address'>Đổi địa chỉ</span>
                    </WrapperAddressProduct>
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: '10px' }}>Số lượng</div>
                        <WrapperQuanlityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease')}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber size='small' onChange={onChange} defaultValue={1} value={numProduct} />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase')}>
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />

                            </button>
                        </WrapperQuanlityProduct>

                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '220px',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            textButton={'Chọn mua'}
                            onClick={handleAddOrderProduct}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: '#fff',
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13,92,182)',
                                borderRadius: '4px'
                            }}
                            textButton={'Mua tra sau'}
                            styleTextButton={{ color: 'rgb(13,92,182)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </div>
                </Col>
            </Row>
        </Loading>
    )
}

export default ProductDetailsComponent