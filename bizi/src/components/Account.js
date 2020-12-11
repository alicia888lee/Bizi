import React from "react"
import Nav from './Nav'
import Footer from './Footer'
import { RiScissorsCutLine } from 'react-icons/ri'
import { BsBookmarkPlus } from 'react-icons/bs'
import QRCode from '../images/testQR.png';
import discountImg from '../images/testDiscountImg.png';
import environmentImg from '../images/environment.png';
import heartImg from '../images/heart_hand.png';
import communityImg from '../images/community.png';

function Account() {
    return (
        <div className="account">
            <Nav />
            <h1 className="accountHeader">Hey John! Welcome Back</h1>
            
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
                        <h1>First Antiques</h1>
                        <img src={communityImg} className="bookmarkIcon"/>
                        <img src={heartImg} className="bookmarkIcon"/>
                    </div>

                    <div>
                        <h1>Sarah's Sprinkles</h1>
                        <img src={communityImg} className="bookmarkIcon"/>
                        <img src={environmentImg} className="bookmarkIcon"/>
                    </div>

                    <div>
                        <h1>Evermore</h1>
                        <img src={heartImg} className="bookmarkIcon"/>
                    </div>                    
                </div>
                <div className="bookmarks">
                    <div>
                        <h1>First Antiques</h1>
                        <img src={communityImg} className="bookmarkIcon"/>
                        <img src={heartImg} className="bookmarkIcon"/>
                    </div>

                    <div>
                        <h1>Sarah's Sprinkles</h1>
                        <img src={communityImg} className="bookmarkIcon"/>
                        <img src={environmentImg} className="bookmarkIcon"/>
                    </div>

                    <div>
                        <h1>Evermore</h1>
                        <img src={heartImg} className="bookmarkIcon"/>
                    </div>                    
                </div>
                <div className="bookmarks">
                    <div>
                        <h1>First Antiques</h1>
                        <img src={communityImg} className="bookmarkIcon"/>
                        <img src={heartImg} className="bookmarkIcon"/>
                    </div>

                    <div>
                        <h1>Sarah's Sprinkles</h1>
                        <img src={communityImg} className="bookmarkIcon"/>
                        <img src={environmentImg} className="bookmarkIcon"/>
                    </div>

                    <div>
                        <h1>Evermore</h1>
                        <img src={heartImg} className="bookmarkIcon"/>
                    </div>                    
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Account;