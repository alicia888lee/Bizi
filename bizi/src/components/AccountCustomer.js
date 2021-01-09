import React, { Component } from "react"
import { RiScissorsCutLine } from 'react-icons/ri'
import { BsBookmarkPlus } from 'react-icons/bs'
import QRCode from '../images/testQR.png';
import environmentImg from '../images/environment.png';
import heartImg from '../images/heart_hand.png';
import communityImg from '../images/community.png';
import { API, Auth, Storage } from 'aws-amplify'
import { withRouter } from 'react-router-dom'
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Loader from 'react-loader-spinner';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { createPortal } from 'react-dom';
import UseModal from './UseModal';

const Modal = ({ isVisible, hideModal }) => {
    return isVisible
        ? createPortal(
            <div>
                <div>
                    <h5>Modal</h5>
                    <span>Why this modal popped up</span>
                </div>
                <button onClick={hideModal}>
                    Close
                </button>
            </div>,
            document.body,
        )
        : null;
};

class AccountCustomer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userName: null,
            bookmarks: [],
            businesses: [],
            bookmarksList: [],
            bookmarksLoading: false,
            filteredBookmarks: [],
            filteredBusinesses: [],
            filter: 'Filter',
            sort: '',
            discount: null,
            couponLoading: false,
            couponUsed: false,
            useCouponLoading: false
        }
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

    checkTimeSinceUse = (timeUsed) => {
        var currTime = new Date(Date.now()).getTime();
        var diff = (currTime - timeUsed) / 1000;
        var weeksPassed = diff / (60 * 60 * 24 * 7);
        return weeksPassed > 1 ? true : false;
    }

    generateNewDiscount = async(currUser) => {
        const { businesses } = this.state;
        console.log(businesses);
        
        var user = currUser?.data?.getUser;
        var timeValid = true;
        if (!user?.coupons || user?.coupons?.[user?.coupons?.length - 1]?.used) {
            // make sure enough time has passed since last coupon was used

            if (user?.coupons?.[user?.coupons?.length - 1]?.used) {
                timeValid = this.checkTimeSinceUse(user?.coupons?.[user?.coupons?.length - 1]?.timeUsed);
            }
            if (timeValid) {
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
                    var currCoupons = [newCoupon];
                }
                else {
                    currCoupons = user?.coupons.slice();
                    currCoupons.push(newCoupon);
                }
                var updatedUser = {
                    ...user,
                    coupons: currCoupons
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
                    // { credentials: {
                    //     accessKeyId: accessKey,
                    //     secretAccessKey: secretKey
                    // } },
                    { level: 'public' }
                );
            }
        }
        catch (error) {
            console.log(error);
        }
        console.log(user);
        console.log(discountIndex);
        console.log(timeValid);
        var discountDiv = timeValid ? (
            <div className="discount-info">
                {url ? <img src={url} style={{maxWidth: '200px', height: 'auto'}} /> : <h1>{discountBusiness?.businessName}</h1>}
                <h2>{discount?.[0]}% off your next purchase at {discountBusiness?.businessName}!</h2>
                <button id='useCoupon' onClick={() => this.useCoupon(user)}>Click to use</button>
            </div>
        ) :
        <h2>There are no discounts currently available.</h2>;

        this.setState({
            discount: discountDiv,
            couponLoading: false,
            couponUsed: false,
            useCouponLoading: false
        });
    }

    useCoupon = async(user) => {
        this.setState({useCouponLoading: true});
        var currTime = new Date(Date.now()).getTime();
        var currCoupon = user?.coupons?.[user?.coupons?.length - 1];
        var newCoupon = {
            ...currCoupon,
            used: true,
            timeUsed: currTime
        };
        var newCouponsList = user?.coupons;
        console.log(user);
        console.log(currCoupon);
        console.log(newCoupon);
        console.log(newCouponsList);
        newCouponsList.splice(user?.coupons?.length, 1, newCoupon);
        var updatedUser = {
            ...user,
            coupons: newCouponsList
        };
        // update user
        try {
            await API.graphql({
                query: mutations.updateUser,
                variables: {input: updatedUser}
            });
        }
        catch (error) {
            console.log(error);
        }
        this.setState({
            couponUsed: true,
        });
    }

    getUserBookmarks = async(user) => {
        this.setState({
            bookmarks: user?.data?.getUser?.bookmarks,
            filteredBookmarks: user?.data?.getUser?.bookmarks
        });
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
        const { businesses, bookmarks } = this.state;
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
        const { user, authUser } = this.props;
        this.setState({
            bookmarksLoading: true,
            couponLoading: true
        });

        if (authUser) {
            var name = authUser?.attributes?.name;
            const firstName = name.split(' ')[0];
            this.setState({
                userName: firstName
            });
            await this.getUserBookmarks(user);
            await this.getBusinesses();
            this.generateBookmarkTiles();
            this.generateNewDiscount(user);
        }
        else {
          this.props.history.push('/login');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { filter, sort, couponUsed } = this.state;
        const { user } = this.props;
        var updateCondition = (
            prevState.filter !== filter
            || prevState.sort !== sort
            || prevState.couponUsed !== couponUsed
        );

        if (updateCondition) {
            this.generateBookmarkTiles();
            this.generateNewDiscount(user);
        }
    }

    render() {
        const { userName, bookmarksList, bookmarksLoading, filter, sort, discount, couponLoading, useCouponLoading } = this.state;
        // const { isVisible, toggleModal } = UseModal();
        return (
            <div className="account">
                <h1 className="accountHeader">Hey {userName}! Welcome Back!</h1>
                
                <div className="discounts-wrapper">                            
                    {/* <h3><RiScissorsCutLine className="accountIcon"/>Your new discount<AiOutlineQuestionCircle onClick={toggleModal}/></h3> */}
                    {/* <Modal isVisible={isVisible} hideModal={toggleModal} /> */}
                    <div className="discounts">
                        <div className='coupon'>{couponLoading ? <Loader type='TailSpin' color='#385FDC' height={40} /> : discount}</div>
                        {/* <div className="QR">
                            <img src={QRCode} />
                        </div> */}
                    </div>
                    <div className='coupon'>{useCouponLoading && <Loader type='TailSpin' color='#385FDC' height={40}/>}</div>
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
            </div>
        )
    }
}

export default withRouter(AccountCustomer);