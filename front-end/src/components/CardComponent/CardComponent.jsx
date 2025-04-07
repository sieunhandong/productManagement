import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperImageStyle, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo1.png'

const CardComponent = () => {
    return (
        <WrapperCardStyle
            hoverable
            styles={{
                root: { width: '200px' },
                head: { backgroundColor: '#f0f2f5', height: '200px' }, // Thay vì dùng headStyle
                body: { padding: '10px' }
            }}
            cover={<img alt="example" src="https://scontent.fhan5-10.fna.fbcdn.net/v/t39.30808-6/487377101_1798238307412549_1515310109920661297_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=QZjSR7xAq80Q7kNvwEXBKng&_nc_oc=Adn9r3kFItrfcYFAmKdyZ-QAEHLzuaM8RSdDX69c485HBOPNKCEDvC2g-CrlivQI3Q4&_nc_zt=23&_nc_ht=scontent.fhan5-10.fna&_nc_gid=truIlaziJW1xsYo0OAzXSQ&oh=00_AfEGnmmbTqmp7wOAKnrPHw6ugZpMnYjAs_CA1z_J_o4qDg&oe=67F9CD24" />}
        >
            <WrapperImageStyle src={logo} alt="logo" />
            <StyleNameProduct>Iphone</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>4.96</span><StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
                </span>
                <WrapperStyleTextSell> | Da ban 1000+</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>Vo Gia</span>
                <WrapperDiscountText> -5%</WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>

    )
}

export default CardComponent