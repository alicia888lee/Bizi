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
import { API, Auth, Storage } from 'aws-amplify'
import { withRouter } from 'react-router-dom'
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { credentialsPromise } from '../index';
import Loader from 'react-loader-spinner';

class Account extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentUser: '',
            bookmarks: [],
            businesses: [],
            bookmarksList: [],
            bookmarksLoading: false,
            filteredBookmarks: [],
            filteredBusinesses: [],
            filter: 'Filter',
            sort: '',
            discount: null,
            couponLoading: false
        }
    }

    getCurrentUser = async() => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            console.log(user);
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
            businesses: businesses,
            filteredBusinesses: businesses
        });
    }

    generateNewDiscount = async(currUser) => {
        const { businesses } = this.state;
        console.log(businesses);
        // check if user already has a coupon
        try {
            var user = await API.graphql({
                query: queries.getUser,
                variables: {userEmail: currUser?.attributes?.email}
            });
        }
        catch (error) {
            console.log(error);
        }
        user = user?.data?.getUser;
        var promise = await credentialsPromise;
        var accessKey = promise?.data?.getCredentials?.accessKey;
        var secretKey = promise?.data?.getCredentials?.secretKey;
        if (!user?.coupons || user?.coupons?.[user?.coupons?.length - 1]?.used) {
            // filter businesses that have available coupons
            var available = businesses.filter((item) => (
                item.discounts?.filter((discount) => discount[1] > 0).length > 0
            ));
            console.log(available);
            var discountBusinessIndex = Math.floor(Math.random() * available.length);
            var discountBusiness = available[discountBusinessIndex];
            var discountIndex = Math.floor(Math.random() * discountBusiness?.discounts?.length);
            var discount = discountBusiness?.discounts?.[discountIndex];
            // add coupon to user's coupons
            var newCoupon = {
                businessID: discountBusiness?.id,
                discountIndex: discountIndex,
                used: false
            };
            
            if (!user?.coupons) {
                var newCouponsList = [newCoupon];
            }
            else {
                var currCoupons = user?.coupons.slice();
                newCouponsList = currCoupons.push(newCoupon);
            }
            var updatedUser = {
                ...user,
                coupons: newCouponsList
            };
            try {
                await API.graphql({
                    query: mutations.updateUser,
                    variables: {input: updatedUser}
                });
            }
            catch (error) {
                console.log(error);
            }
            // update quantity in business
            var updatedDiscounts = discountBusiness?.discounts;
            var newQt = updatedDiscounts?.[discountIndex]?.[1] - 1;
            updatedDiscounts[discountIndex].splice(1, 1, newQt);
            console.log(updatedDiscounts);
            var updatedBusiness = {
                ...discountBusiness,
                discounts: updatedDiscounts
            };
            try {
                await API.graphql({
                    query: mutations.updateBusiness,
                    variables: {input: updatedBusiness}
                });
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            discountBusiness = businesses.filter((item) => item.id == user?.coupons?.[user?.coupons?.length - 1]?.businessID)[0];
            discountIndex = user?.coupons?.[user?.coupons?.length - 1]?.discountIndex;
            discount = discountBusiness?.discounts?.[discountIndex];
        }
        
        // get image
        var url = null;
        try {
            if (discountBusiness?.imgPath) {
                url = await Storage.get(discountBusiness?.imgPath,
                    { credentials: {
                        accessKeyId: accessKey,
                        secretAccessKey: secretKey
                    } },
                    { level: 'public' }
                );
            }
        }
        catch (error) {
            console.log(error);
        }
        console.log(user);
        console.log(discountIndex);
        var discountDiv = (
            <div className="discount-info">
                {url ? <img src={url} style={{maxWidth: '200px', height: 'auto'}} /> : <h1>{discountBusiness?.businessName}</h1>}
                <h2>{discount?.[0]}% off your next purchase at {discountBusiness?.businessName}!</h2>
                <button id='useCoupon'>Click to use</button>
            </div>
        );
        this.setState({
            discount: discountDiv,
            couponLoading: false
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
                bookmarks: user?.data?.getUser?.bookmarks,
                filteredBookmarks: user?.data?.getUser?.bookmarks
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    generateBookmarkTiles = () => {
        const { filteredBookmarks, filteredBusinesses } = this.state;
        var bookmarkBusinesses = filteredBookmarks?.map((id) => 
            filteredBusinesses.filter((item) => item?.id == id)[0]
        );

        console.log(bookmarkBusinesses);

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
        if (filteredBookmarks?.length > 0) {
            rows = bookmarkBusinesses.map((item, index) => 
                <div
                    key={index}
                    onClick={() => 
                        this.props.history.push({pathname: `search/${item?.id}`, state: {business: item}})}>
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

    isOpen = (schedule, tz='America/Chicago') => {
        var currDateTime = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
        var currHour = currDateTime.getHours();
        var currMin = currDateTime.getMinutes();
        var currDay = currDateTime.getDay();
        var currTime = currHour + (currMin / 60);
        var busHours = schedule[(currDay + 6) % 7];
        if (currTime >= busHours[0] && currTime <= busHours[1]) {
          return true;
        }
        return false;
      }

    doFilter = (e) => {
        const { businesses, bookmarks, filteredBookmarks } = this.state;
        var filterTypes = {
            'Sustainable': {
            category: 'initiatives',
            value: 'Sustainability'
            },
            'Supply Chain': {
            category: 'initiatives',
            value: 'Ethical Supply Chain'
            },
            'Diversity Focused': {
            category: 'initiatives',
            value: 'Diversity Initiatives'
            },
            'Shopping': {
            category: 'initiatives',
            value: 'Shopping'
            },
            'Food': {
            category: 'initiatives',
            value: 'Food'
            },
            'Services': {
            category: 'initiatives',
            value: 'Services'
            },
            '$': {
            category: 'priceRange',
            value: 1
            },
            '$$': {
            category: 'priceRange',
            value: 2
            },
            '$$$': {
            category: 'priceRange',
            value: 3
            },
            '$$$$': {
            category: 'priceRange',
            value: 4
            },
            'Open Now': {
            category: 'schedule'
            }
        };

        var filteredBusinesses = businesses.filter((item) => {
            if (filterTypes[e.target.value]?.category == 'initiatives') {
                return item?.initiatives?.includes(filterTypes[e.target.value]?.value);
            }
            if (filterTypes[e.target.value]?.category == 'priceRange') {
                return item?.priceRange == filterTypes[e.target.value]?.value;
            }
            if (filterTypes[e.target.value]?.category == 'schedule') {
                return this.isOpen(item?.schedule);
            }
            if (e.target.value == 'Filter') {
                return true;
            }
        });

        var filteredBusinessIDs = filteredBusinesses.map((item) => 
            item?.id
        );
        var filteredBookmarksUpdated = filteredBusinessIDs.filter((id) => 
            bookmarks.includes(id)
        );

        this.setState({
        filteredBusinesses: filteredBusinesses,
        filteredBookmarks: filteredBookmarksUpdated,
        filter: e.target.value
        });
    }

    compareLower = (a, b) => (
        a?.priceRange - b?.priceRange
    )

    compareHigher = (a, b) => (
        b?.priceRange - a?.priceRange
    )

    doSort = (e) => {
        const { filteredBookmarks, filteredBusinesses } = this.state;
        if (e.target.value == 'Lowest Price') {
            var sorted = filteredBusinesses.sort(this.compareLower);
        }
        else if (e.target.value == 'Highest Price') {
            var sorted = filteredBusinesses.sort(this.compareHigher);
        }

        var sortedBusinessIDs = sorted.map((item) => 
            item?.id
        );

        var sortedBookmarks = sortedBusinessIDs.filter((id) => 
            filteredBookmarks.includes(id)
        );

        this.setState({
            filteredBusinesses: sorted,
            filteredBookmarks: sortedBookmarks,
            sort: e.target.value
        })
    }

    async componentDidMount() {
        this.setState({
            bookmarksLoading: true,
            couponLoading: true
        });
        const currentUser = await this.getCurrentUser();
        console.log(currentUser);
        if (currentUser) {
            this.setUserState(currentUser?.attributes?.name);
            await this.getUserBookmarks(currentUser);
            await this.getBusinesses();
            this.generateBookmarkTiles();
            this.generateNewDiscount(currentUser);
        }
        else {
          this.props.history.push('/login');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { filter, sort } = this.state;
        var updateCondition = (
            prevState.filter !== filter
            || prevState.sort !== sort
        );

        if (updateCondition) {
            this.generateBookmarkTiles();
        }
    }

    render() {
        const { currentUser, bookmarksList, bookmarksLoading, filter, sort, discount, couponLoading } = this.state;

        return (
            <div className="account">
                <Nav />
                <h1 className="accountHeader">Hey {currentUser}! Welcome Back!</h1>
                
                <div className="discounts-wrapper">                            
                    <h3><RiScissorsCutLine className="accountIcon"/>Your new discount</h3>
                    <div className="discounts">
                        <div className='coupon'>{couponLoading ? <Loader type='TailSpin' color='#385FDC' height={40} /> : discount}</div>
                        {/* <div className="QR">
                            <img src={QRCode} />
                        </div> */}
                    </div>
                </div>

                <div className="bookmark-wrapper">
                    <h3><BsBookmarkPlus className="accountIcon"/> Your bookmarks</h3>

                    <div className="bookmark-selects">
                        <select onChange={this.doFilter}>
                            <option selected={filter == 'Filter'}>Filter</option>  
                            <option selected={filter == 'Open Now'}>Open Now</option>
                            <option selected={filter == 'Sustainable'}>Sustainable</option>
                            <option selected={filter == 'Supply Chain'}>Supply Chain</option>
                            <option selected={filter == 'Diversity Focused'}>Diversity Focused</option>
                            <option selected={filter == 'Shopping'}>Shopping</option>
                            <option selected={filter == 'Food'}>Food</option>
                            <option selected={filter == 'Services'}>Services</option>
                            <option selected={filter == '$'}>$</option>
                            <option selected={filter == '$$'}>$$</option>
                            <option selected={filter == '$$$'}>$$$</option>
                            <option selected={filter == '$$$$'}>$$$$</option>
                        </select>
                        <select onChange={this.doSort}>
                            <option selected disabled style={{display: 'none'}}>Sort By</option>  
                            <option selected={sort == 'Lowest Price'}>Lowest Price</option>
                            <option selected={sort == 'Highest Price'}>Highest Price</option>
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