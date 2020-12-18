import React from "react"
import Map from './Map'
import AddReview from './AddReview'
import { BsBookmarkPlus, BsDownload } from "react-icons/bs";
import { BiBadgeCheck, BiCalendarPlus, BiPhone } from "react-icons/bi";
import { AiOutlineQuestionCircle, AiOutlineEye } from "react-icons/ai";
import { FiThumbsUp } from "react-icons/fi";
import { GiHealthNormal } from "react-icons/gi";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import testImg from '../images/pexels-maria-gloss-4197693.jpg';

function BusinessItem(){
    return (       
        <>            
            <div className="description">
                <div className="map">
                <Map height={50}/>
                <div className="business-gallery">
                    <div className="business-row">
                        <img src={testImg} className="business-photo"/>
                        <img src={testImg} className="business-photo"/>
                        <img src={testImg} className="business-photo"/>
                        <img src={testImg} className="business-photo"/>
                    </div>           
                    <div className="business-row">
                        <img src={testImg} className="business-photo"/>
                        <img src={testImg} className="business-photo"/>
                        <img src={testImg} className="business-photo"/>
                        <img src={testImg} className="business-photo"/>
                    </div>   
                </div>
                </div>
                <BusinessInfo />        
            </div>            
        <AddReview/>   
        </>
    )
}

function BusinessInfo() {
    return(
        <div className="description-text">
            <div className="textbox">
                <div className="business-header">
                    <Link to="/search"><RiArrowGoBackFill className="back-icon" /></Link>
                    <h2>First Antique</h2>       
                    <div className="a-box">                        
                        <BiBadgeCheck/>
                        <h4>A</h4> 
                    </div>
                    <AiOutlineQuestionCircle className="question"/>                                                                                                                                                                         
                </div>
                <h3 className="business-header-icons">
                    <BsBookmarkPlus className="icon "/>
                    <BsDownload className="icon "/>            
                </h3>
            </div>
                      
          <p className="textbox">Lorem ipsum dolor sit amet, consectetar adipiscing elit. Donec porta hendreit ex, et sagittis magna.</p>                        
                          
          <div className="icon-text">
            <GiHealthNormal className="action"/>
            <ul>
                <li>Air ventilation</li>
                <li>Sanitize between customers</li>              
            </ul>             
            <ul>
                <li>1/2 capacity</li>
                <li>Outdoor seating</li>
            </ul>     
          </div>
  
          <div className="icon-text">
            <BiCalendarPlus className="action"/> 
            <p><a href="#">Make a reservation</a></p>
          </div>

          <div className="icon-text">
            <BiPhone className="action"/> 
            <p>(123) 123-1234</p>
          </div>

          <div className="icon-text">
            <AiOutlineEye className="action"/> 
            <p><a href="#">View First Antique's story</a></p>
          </div>
          
  
          <div className="reviews">
            <div className="textbox">
              <h3>Reviews</h3>
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
    )
}

export default BusinessItem