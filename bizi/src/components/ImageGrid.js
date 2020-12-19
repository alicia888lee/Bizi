import React from 'react'
import blankImg from '../images/noImage.png';
import busImg1 from '../images/pexels-andrea-piacquadio-3932730.jpg';
import busImg2 from '../images/pexels-rfstudio-4177755.jpg';
import busImg3 from '../images/pexels-justin-l-4060881.jpg';

function ImageGrid(){
    return (    
      <div className='imageContainer'>
        <div className="gridElement">
          <img className="gridImg" src={busImg1} />
          <div className="gridImgDescription">
            <h2>Meet John</h2>
            <h3>Owner of Juicery</h3>
            <div className="imgTextWrapper">
              <p>Lorem Ipsum Stuff</p>
            </div>
          </div>
        </div>
        <div className="gridElement">
          <img className="gridImg" src={busImg2} />
          <div className="gridImgDescription">
            <h2>Meet John</h2>
            <h3>Owner of Juicery</h3>
            <div className="imgTextWrapper">
              <p>Lorem Ipsum Stuff</p>
            </div>
          </div>          
        </div>
        <div className="gridElement">
          <img className="gridImg" src={busImg3} />
          <div className="gridImgDescription">
            <h2>Meet John</h2>
            <h3>Owner of Juicery</h3>
            <div className="imgTextWrapper">
              <p>Lorem Ipsum Stuff</p>
            </div>
          </div>
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank1' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank2' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank3' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank3' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank1' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank2' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank2' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank3' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank1' />
        </div>
      </div>
    )
  }

  export default ImageGrid