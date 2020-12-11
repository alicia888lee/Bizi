import React from "react"
import Nav from './Nav'
import Footer from './Footer'

import { RiScissorsCutLine } from 'react-icons/ri'
import { BsBookmarkPlus } from 'react-icons/bs'
import QRCode from '../images/testQR.png';
import discountImg from '../images/testDiscountImg.png';


function Account() {
    return (
        <div className="account">
            <Nav />
            <h1>Hey John! Welcome Back</h1>
            
            <div className="discounts-wrapper">                            
                <h3><RiScissorsCutLine className="accountIcon"/>Your discounts</h3>
                <div className="discounts">
                    <div className="discount-info">
                        <img src={discountImg} />
                        <h2>10% off your next purchase!</h2>
                    </div>
                    <div className="QR">
                        <img src={QRCode} />
                    </div>
                </div>
            </div>

            <div className="bookmark-wrapper">
                <h3><BsBookmarkPlus className="accountIcon"/> Your bookmarks</h3>

                <div className="bookmark-selects">
                    <select>
                        <option value="">Filter</option>  
                        <option value="parrot">Parrot</option>
                        <option value="spider">Spider</option>
                        <option value="goldfish">Goldfish</option>
                    </select>
                    <select>
                        <option value="">Sort By</option>  
                        <option value="parrot">Parrot</option>
                        <option value="spider">Spider</option>
                        <option value="goldfish">Goldfish</option>
                    </select>
                </div>

                <div className="bookmarks">
                    <div>
                        <h4>First Antiques</h4>
                    </div>

                    <div>
                        <h4>Sarah's Sprinkles</h4>
                    </div>

                    <div>
                        <h4>Evermore</h4>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Account;