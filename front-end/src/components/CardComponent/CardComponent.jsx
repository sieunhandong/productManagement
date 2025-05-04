import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperImageStyle, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo1.png'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils';


const CardComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, selled, discount, id } = props
    const navigate = useNavigate();
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable
            styles={{
                root: { width: '200px' },
                head: { backgroundColor: '#f0f2f5', height: '200px' }, // Thay vì dùng headStyle
                body: { padding: '10px' }
            }}
            cover={<img alt="example" src={image} />}
            onClick={() => countInStock !== 0 && handleDetailsProduct(id)}
            disabled={countInStock === 0}
        >
            <WrapperImageStyle src={logo} alt="logo" />
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating}</span><StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                </span>
                <WrapperStyleTextSell> | Đã bán {selled || 1000}+</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
                <WrapperDiscountText> - {discount || 5}%</WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>

    )
}

export default CardComponent