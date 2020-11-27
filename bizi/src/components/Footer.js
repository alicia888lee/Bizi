import React from 'react'
import { AiOutlineFacebook, AiOutlineInstagram } from "react-icons/ai";
import { FiTwitter } from "react-icons/fi";

function Footer() {
    return (
      <div className='info'>
        <div>
          <h1>Bizi LLC.</h1>
        </div>      
        <div>
          <h1 id="footer-icons">
            <AiOutlineFacebook className="footer-icon"/>
            <AiOutlineInstagram className="footer-icon"/>
            <FiTwitter className="footer-icon"/>
          </h1>
        </div>
        <div>
          <h1 className="contact-footer">hello@bizi.com | 1111 Campus Dr., Evanston, IL 60201</h1>
        </div>
      </div>
    )
}

export default Footer