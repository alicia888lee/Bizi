import React, { Component } from "react"
import Nav from './Nav'
import Footer from './Footer'
import { RiScissorsCutLine } from 'react-icons/ri'
import { BsBookmarkPlus } from 'react-icons/bs'
import QRCode from '../images/testQR.png';
import discountImg from '../images/testDiscountImg.png';
import environmentImg from '../images/environment.png';
import heartImg from '../images/heart_hand.png';
import communityImg from '../images/community.png';
import { Auth } from 'aws-amplify'
import { withRouter } from 'react-router-dom'

class Account extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentUser: ''
        }
    }

    getCurrentUser = async() => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            return user;
        }
        catch (error) {
            console.log('error checking auth', error);
        }
    }

    setUserState = (name) => {
        const firstName = name.split(' ')[0];
        this.setState({
            currentUser: firstName
        });
    }

    signOut = async() => {
        try {
            await Auth.signOut();
        }
        catch (error) {
            console.log('error signing out', error);
        }
        window.location.reload();
    }

    async componentDidMount() {
        const currentUser = await this.getCurrentUser();
        currentUser ? this.setUserState(currentUser?.attributes?.name) : this.props.history.push('/login');
    }

    render() {
        const { currentUser } = this.state;

        return (
            <div className="account">
                <Nav />
                <h1 className="accountHeader">Hey {currentUser}! Welcome Back</h1>

                <button onClick={() => {
                    this.signOut();
                    this.props.history.push('/login');
                }}>Sign Out</button>
                
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
}

export default withRouter(Account);