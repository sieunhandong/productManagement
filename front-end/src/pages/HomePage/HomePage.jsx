import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slide1 from '../../assets/images/slide1.png';
import slide2 from '../../assets/images/slide2.png';
import slide3 from '../../assets/images/slide3.png';
import slide4 from '../../assets/images/emyeu.png';
import CardComponent from '../../components/CardComponent/CardComponent';
function HomePage() {
  const arr = ['TV', 'Tu lanh', 'Lap top']
  return (
    <>
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <WrapperTypeProduct>
          {arr.map((item) => {
            return (
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>
      </div>
      <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
        <div id="container" style={{ height: '1000px', width: '1270px', margin: "0 auto" }}>
          <SliderComponent arrImages={[slide1, slide2, slide3, slide4]} />
          <WrapperProducts>
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
          </WrapperProducts>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
            <WrapperButtonMore textButton="Xem them" type="outline" styleButton={{
              border: '1px solid rgb(11,116,229)', color: 'rgb(11,116,229)',
              width: '240px', height: '38px', borderRadius: '4px'
            }}
              styleTextButton={{ fontWeight: 500 }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage