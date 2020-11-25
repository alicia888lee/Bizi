import React from 'react'
import { Link } from "react-router-dom";

import busImg1 from '../images/pexels-andrea-piacquadio-3932730.jpg';
import busImg2 from '../images/pexels-rfstudio-4177755.jpg';
import busImg3 from '../images/pexels-justin-l-4060881.jpg';
import hands from '../images/hands.jpg';


function ReadStories() {
    return (
      <div className='read-stories'>
        <div>
          <h1>Read Business Stories</h1>
        </div>
        <div className='bus-cols'>
          <div>
            <img id='bus1' src={busImg1}/>
            <h2>Business 1</h2>
            <p>Lorem ipsum dolor sit amet, consectetur...</p>
          </div>
          <div>
            <img id='bus2' src={busImg2}/>
            <h2>Business 2</h2>
            <p>Lorem ipsum dolor sit amet, consectetur...</p>
          </div>
          <div>
            <img id='bus3' src={busImg3}/>
            <h2>Business 3</h2>
            <p>Lorem ipsum dolor sit amet, consectetur...</p>
          </div>
        </div>
        <div className='read-more-col'>
          <div className='read-more-hands'>
            <img src={hands}/>
            <Link to='/stories'><h2>Read More</h2></Link>
          </div>
        </div>    
      </div>
    )
  }

  export default ReadStories