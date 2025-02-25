import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperImageStyle, WrapperPriceText, WrapperReportText } from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo1.png'

const CardComponent = () => {
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '200px', height: '200px' }}
            style={{ width: "200px" }}
            bodyStyle={{ padding: "10px" }}
            cover={<img alt="example" src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/471448470_1733966243839756_1525582861501174235_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH4hXJoaWz8atVuJYMO0KqnpgIYm0eNa06mAhibR41rTuUBRBJVerqta3rGUo3mrSndHaSav1Om_nnVFcwaV-94&_nc_ohc=J5UPZMyOyJ0Q7kNvgGlQ7it&_nc_oc=AdikklombUNMZqQVK4hoo0aIbPHfvb7A0Rq9nMXDVGEmXo2Dnq041yWjc17MvXGox8k&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AXVHUV3jsYjrOdsVWcJZe68&oh=00_AYDsv8OjYlSu_Xm_FaTzOCST0kS1lANJ8U4EZvIIMbljyw&oe=67C39A45" />}
        >
            <WrapperImageStyle src={logo} alt="logo" />
            <StyleNameProduct>Iphone</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>4.96</span><StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                </span>
                <span> | Da ban 1000+</span>
            </WrapperReportText>
            <WrapperPriceText> Vô Giá
                <WrapperDiscountText> -5%</WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>

    )
}

export default CardComponent