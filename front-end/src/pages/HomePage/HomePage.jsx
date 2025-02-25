import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slide1 from '../../assets/images/slide1.png';
import slide2 from '../../assets/images/slide2.png';
import slide3 from '../../assets/images/slide3.png';
import slide4 from '../../assets/images/emyeu.png';
import CardComponent from '../../components/CardComponent/CardComponent';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
function HomePage() {
  const arr = ['TV', 'Tu lanh', 'Lap top']
  return (
    <>
      <div style={{ padding: '0 120px' }}>
        <WrapperTypeProduct>
          {arr.map((item) => {
            return (
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>
      </div>
      <div id="container" style={{ backgroundColor: '#efefef', padding: '0 120px', height: "1000px" }}>
        <SliderComponent arrImages={[slide1, slide2, slide3, slide4]} />
        <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
          <CardComponent />
        </div>
        <NavbarComponent />
      </div>
    </>
  )
}

export default HomePage