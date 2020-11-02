import React from 'react'
import foodImg from '../images/pexels-mariana-kurnyk-1775043.jpg';
import shopImg from '../images/pexels-ksenia-chernaya-3965557.jpg';
import serviceImg from '../images/pexels-maria-gloss-4197693.jpg';
import otherImg from '../images/pexels-oleg-magni-1005638.jpg';

function Discover() {
    return (
      <div className='discover'>
        <div>
          <h1>Discover</h1>
        </div>
        <div className='discover-cols'>
          <div className='discover-images-1'>
            <img src={foodImg}/>
            <h2>Food</h2>
          </div>
          <div className='discover-images-2'>
            <img src={shopImg}/>
            <h2>Shopping</h2>
          </div>
          <div className = 'discover-images-3'>
            <img src={serviceImg}/>
            <h2>Services</h2>
          </div>
          <div className = 'discover-images-4'>
            <img src={otherImg}/>
            <h2>More</h2>
          </div>
        </div>
      </div>
    )
  }

  export default Discover;