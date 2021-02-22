import React from 'react'
import { AiOutlineFacebook, AiOutlineInstagram } from "react-icons/ai";
import { FiTwitter } from "react-icons/fi";
import { InternalDBTool } from '../internal/updateBusinessDB';

function Footer() {
    return (
      <div className='info'>
        <div>
          <h1>Bizi LLC.</h1>
        </div>      
        <div>
          <h1 id="footer-icons">
            <AiOutlineFacebook className="footer-icon"/>
            <AiOutlineInstagram className="footer-icon" onClick={() => window.open('https://www.instagram.com/thebiziteam/', '_blank')}/>
            <FiTwitter className="footer-icon"/>
          </h1>
        </div>
        <div>
          <h1 className="contact-footer">thebiziteam@gmail.com | 1111 Campus Dr., Evanston, IL 60201</h1>
        </div>
        {/* <InternalDBTool /> */}
      </div>
    )
}

export default Footer