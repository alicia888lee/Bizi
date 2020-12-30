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
import { API, Auth } from 'aws-amplify'
import { withRouter } from 'react-router-dom'
import * as queries from '../graphql/queries';
import Loader from 'react-loader-spinner';

class Account extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentUser: '',
            bookmarks: [],
            businesses: [],
            bookmarksList: [],
            bookmarksLoading: false
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

    getBusinesses = async() => {
        try {
            var businessQuery = await API.graphql({
                query: queries.listBusinesss
            });
            var businesses = businessQuery?.data?.listBusinesss?.items;
        }
        catch (error) {
            console.log(error);
        }

        this.setState({
            businesses: businesses
        });
    }

    getUserBookmarks = async(currUser) => {
        try {
            console.log(currUser);
            var user = await API.graphql({
                query: queries.getUser,
                variables: {userEmail: currUser?.attributes?.email}
            });
            this.setState({
                bookmarks: user?.data?.getUser?.bookmarks
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    generateBookmarkTiles = () => {
        const { bookmarks, businesses } = this.state;
        var bookmarkBusinesses = bookmarks?.map((id) => 
            businesses.filter((item) => item?.id == id)[0]
        );

        var iconDict = {
            'Sustainability': {
              id: 'searchEnvironment',
              img: environmentImg
            },
            'Ethical Supply Chain': {
              id: 'searchHeart',
              img: heartImg
            },
            'Diversity Initiatives': {
              id: 'searchCommunity',
              img: communityImg
            }
        };

        var rows = [];
        if (bookmarks?.length > 0) {
            rows = bookmarkBusinesses.map((item, index) => 
                <div onClick={() => 
                    this.props.history.push({pathname: `search/${item?.id}`, state: {businesses: businesses}})}>
                    <h1>{item?.businessName}</h1>
                    {item?.initiatives.map((init, index) => 
                        Object.keys(iconDict).includes(init) && <img src={iconDict[init]?.img} className='bookmarkIcon' key={index} />
                    )}
                </div>
            );
        }
        console.log(rows);

        var bookmarksList = [];
        for (var counter = 0; counter < rows.length; counter+=3) {
            var currRow = [];
            for (var i = 0; i < 3; i++) {
                console.log(rows[counter + i]);
                currRow.push(rows[counter + i]);
            }
            bookmarksList.push(
                <div className='bookmarks'>
                    {currRow}
                </div>
            );
        }

        this.setState({
            bookmarksList: bookmarksList,
            bookmarksLoading: false
        });
    }

    async componentDidMount() {
        this.setState({
            bookmarksLoading: true
        });
        const currentUser = await this.getCurrentUser();
        if (currentUser) {
            this.setUserState(currentUser?.attributes?.name);
            await this.getUserBookmarks(currentUser);
            await this.getBusinesses();
            this.generateBookmarkTiles();
        }
        else {
          this.props.history.push('/login');
        }
    }

    render() {
        const { currentUser, bookmarksList, bookmarksLoading } = this.state;

        return (
            <div className="account">
                <Nav />
                <h1 className="accountHeader">Hey {currentUser}! Welcome Back!</h1>
                
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
                    {bookmarksLoading ? <Loader type='TailSpin' color='#385FDC' height={40} /> : bookmarksList}
                </div>

                <Footer />
            </div>
        )
    }
}

export default withRouter(Account);