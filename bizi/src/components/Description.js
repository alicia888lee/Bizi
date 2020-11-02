import React from 'react'
import Map from './Map.js'
import { BsBookmarkPlus, BsDownload } from "react-icons/bs";
import { BiBadgeCheck, BiCalendarPlus } from "react-icons/bi";
import { AiOutlineFacebook, AiOutlineInstagram, AiOutlineQuestionCircle } from "react-icons/ai";
import { FiTwitter, FiThumbsUp } from "react-icons/fi";
import { GiHealthNormal } from "react-icons/gi";

function Description(){
    return(
      <div className="description">
        <div className="map">
          <Map />
        </div>
  
        <div className="description-text">
          <div className="textbox">
            <div className="center-icon">
              <h2>Bat 17  <span className="center-text">
                <BsBookmarkPlus className="icon action"/>
                <BsDownload className="icon action"/>
              </span></h2>                        
            </div>
            <h2 className="right">
              <AiOutlineFacebook className="icon"/>
              <AiOutlineInstagram className="icon"/>
              <FiTwitter className="icon"/>
            </h2>
          </div>
          
          <p className="textbox">Lorem ipsum dolor sit amet, consectetar adipiscing elit. Donec porta hendreit ex, et sagittis magna.</p>                        
          
          <div className="textbox">
            <button type="button">A <BiBadgeCheck/></button>
            <h2 className="question"><AiOutlineQuestionCircle className="question"/></h2>
          </div>
          
          <div className="icon-text">
            <GiHealthNormal className="action"/>
            <p>Air ventilation, Sanitize between customers, 1/2 capacity, Outdoor seating</p>
          </div>
  
          <div className="icon-text">
            <BiCalendarPlus className="action"/> 
            <p><a href="#">Make a reservation</a></p>
          </div>
          
  
          <div className="reviews">
            <div className="textbox">
              <p>Reviews</p>
              <p><a href="#">See more</a></p>
            </div>
  
            <div className="review1">
              <FiThumbsUp className="thumbsUp"/>
              <div>
                <p className="name">Jason</p>
                <p>Donna porta hendreit ex, et sagittis magna.</p>
              </div>                      
            </div>
          </div>
        </div>      
      </div>
    )
  }

  export default Description