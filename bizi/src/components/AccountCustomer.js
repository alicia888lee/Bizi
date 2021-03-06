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
            <div className='couponModal'>
                <div>
                    <h2>About Coupons</h2>
                    <span>
                        A random coupon is generated and can be used
                        at the establishment listed on it. After you
                        click to use the coupon, you need to wait one week
                        before another coupon is generated.
                    </span>
                </div>
                <button onClick={hideModal}>
                    Close
                </button>
            </div>,
            document.body,
        )
        : null;
};

function ModalComponent(props) {
    const { handler, isOpen } = props;
    const { isVisible, toggleModal } = UseModal();
    console.log('in modal function component');
    if (isVisible !== isOpen) {
        handler(isVisible);
    }
    return (
        <>
            <div>
                <AiOutlineQuestionCircle onClick={toggleModal} style={{cursor: 'pointer'}}/>
            </div>
            <div className='couponModalContainer'>
                <Modal isVisible={isVisible} hideModal={toggleModal} />
            </div>
        </>
    )
}

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
            discount: null,
            couponLoading: false,
            couponUsed: false,
            useCouponLoading: false,
            couponModalOpen: false,
            currentInitFilters: [],
            currentPriceFilters: [],
            currentScheduleFilter: []
        }
    }

    getBusinesses = async() => {
        try {
            var businessQuery = await API.graphql({
                query: queries.listBusinesss,
                variables: {limit: 1000}
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

    generateNewDiscount = async(userEmail) => {
        const { businesses } = this.state;
        console.log(businesses);
        console.log(userEmail);
        var user = null;
        // get updated user
        try {
            var fetchedUser = await API.graphql({
                query: queries.getUser,
                variables: {userEmail: userEmail}
            });
            user = fetchedUser?.data?.getUser;
            console.log(user);
        }
        catch (error) {
            console.log(error);
        }
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
                if (available.length > 0) {
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
                    user = updatedUser;
                    console.log(updatedUser);
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
        
        const discountDiv = timeValid && discountBusiness ? (
            <div className="discount-info">
                {url ? <img src={url} style={{maxWidth: '200px', height: 'auto'}} /> : <h1>{discountBusiness?.businessName}</h1>}
                <h2>{discount?.[0]}% off your next purchase at {discountBusiness?.businessName}!</h2>
                <button id='useCoupon' onClick={() => this.useCoupon()}>Click to use</button>
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

    useCoupon = async() => {
        this.setState({useCouponLoading: true});
        const { user } = this.props;
        // get updated user
        var currUser = null;
        try {
            console.log("FETCHING USER", Date.now());
            var fetchedUser = await API.graphql({
                query: queries.getUser,
                variables: {userEmail: user?.data?.getUser?.userEmail}
            });
            console.log(fetchedUser, Date.now());
            currUser = fetchedUser?.data?.getUser;
            console.log(currUser);
        }
        catch (error) {
            console.log(error);
        }
        console.log(currUser);
        var currTime = new Date(Date.now()).getTime();
        var currCoupon = currUser?.coupons?.[currUser?.coupons?.length - 1];
        var newCoupon = {
            ...currCoupon,
            used: true,
            timeUsed: currTime
        };
        var newCouponsList = currUser?.coupons;
        console.log(currUser);
        console.log(currCoupon);
        console.log(newCoupon);
        console.log(newCouponsList);
        newCouponsList.splice(currUser?.coupons?.length - 1, 1, newCoupon);
        console.log('SPLICED COUPONS');
        console.log(newCouponsList);
        var updatedUser = {
            ...currUser,
            coupons: newCouponsList
        };
        // update user
        try {
            console.log("UPDATING USER", Date.now());
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
                        Object.keys(iconDict).includes(init) && <img src={iconDict[init]?.img} className='bookmarkIcon' key={index} title={init}/>
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

      generateFilters = (handleClick, filterInitiative, filterPrice, filterOpen) => {
        var col1 = [
            "Sustainable",
            "Supply Chain",
            "Diversity Focused"
        ];
        var col2 = [
            "$",
            "$$",
            "$$$",
            "$$$$"
        ];
        
        var checklist = (
            <>
                <div className='search-filters-checklist'>
                    <div id='filter-col'>
                        <p>Initiatives</p>
                        {col1.map(p => (
                            <div id='filter-checkbox'>
                                <input id={p} type='checkbox' checked={filterInitiative?.includes(p)} value={p} onChange={handleClick}/>
                                <label for={p}>{p}</label>
                            </div>
                        ))}
                    </div>
                    <div id='filter-col'>
                        <p>Price</p>
                        {col2.map(p => (
                            <div id='filter-checkbox'>
                                <input id={p} type='checkbox' checked={filterPrice?.includes(p)} value={p} onChange={handleClick}/>
                                <label for={p}>{p}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div id='open-now-checkbox'>
                    <input id='open-now' type='checkbox' checked={filterOpen?.includes("Open Now")} value='Open Now' onChange={handleClick}/>
                    <label for='open-now'>Open Now</label>
                </div>
            </>
        );
        return checklist;
    }

    doFilter = (e) => {
        const { businesses, bookmarks, currentInitFilters, currentPriceFilters, currentScheduleFilter } = this.state;
        var setInitFilters = currentInitFilters.slice();
        var setPriceFilters = currentPriceFilters.slice();
        var setScheduleFilter = currentScheduleFilter.slice();
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

        if (filterTypes[e.target.value]?.category == 'initiatives') {
            setInitFilters.includes(e.target.value) ?
              setInitFilters.splice(setInitFilters.indexOf(e.target.value), 1) :
              setInitFilters.push(e.target.value);
          }
          if (filterTypes[e.target.value]?.category == 'priceRange') {
            setPriceFilters.includes(e.target.value) ?
              setPriceFilters.splice(setPriceFilters.indexOf(e.target.value), 1) :
              setPriceFilters.push(e.target.value);
          }
          if (filterTypes[e.target.value]?.category == 'schedule') {
            setScheduleFilter.includes(e.target.value) ?
              setScheduleFilter.splice(setScheduleFilter.indexOf(e.target.value), 1) :
              setScheduleFilter.push(e.target.value);
          }

        var filteredBusinesses = businesses.slice();
        filteredBusinesses = filteredBusinesses?.filter(item =>
            setInitFilters.length > 0 ?
                setInitFilters?.some(fil => item?.initiatives?.includes(filterTypes[fil]?.value)) :
                true);
            filteredBusinesses = filteredBusinesses?.filter(item =>
                setPriceFilters.length > 0 ?
                    setPriceFilters?.some(fil => item?.priceRange == filterTypes[fil]?.value) :
                    true);
            setScheduleFilter.forEach(fil => {
                filteredBusinesses = filteredBusinesses?.filter(item => this.isOpen(item?.schedule));
            });

        var filteredBusinessIDs = filteredBusinesses.map((item) => 
            item?.id
        );
        var filteredBookmarksUpdated = filteredBusinessIDs.filter((id) => 
            bookmarks?.includes(id)
        );

        this.setState({
            currentInitFilters: setInitFilters,
            currentPriceFilters: setPriceFilters,
            currentScheduleFilter: setScheduleFilter,
            filteredBusinesses: filteredBusinesses,
            filteredBookmarks: filteredBookmarksUpdated
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

    handler = (isOpen) => {
        this.setState({
            couponModalOpen: isOpen
        });
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
            this.generateNewDiscount(user?.data?.getUser?.userEmail);
        }
        else {
            console.log(authUser);
            this.props.history.push('/login');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { currentInitFilters, currentPriceFilters, currentScheduleFilter, couponUsed } = this.state;
        const { user } = this.props;
        var updateCondition = (
            prevState.currentInitFilters !== currentInitFilters
            || prevState.currentPriceFilters !== currentPriceFilters
            || prevState.currentScheduleFilter !== currentScheduleFilter
            || prevState.couponUsed !== couponUsed
        );

        if (updateCondition) {
            console.log('COMPONENT UPDATED');
            this.generateBookmarkTiles();
            this.generateNewDiscount(user?.data?.getUser?.userEmail);
        }
    }

    render() {
        const { 
            userName, 
            bookmarksList, 
            bookmarksLoading, 
            currentPriceFilters,
            currentInitFilters,
            currentScheduleFilter,
            sort,
            discount, 
            couponLoading, 
            useCouponLoading, 
            couponModalOpen } = this.state;
        console.log(couponModalOpen);
        return (
            <div className="account" id={couponModalOpen && 'couponModalOpen'}>
                <h1 className="accountHeader">Hey {userName}! Welcome Back!</h1>
                
                {/* <div className="discounts-wrapper">                             */}
                    {/* <h3><RiScissorsCutLine className="accountIcon"/>Your new discount<ModalComponent handler={this.handler} isOpen={couponModalOpen}/></h3> */}
                    {/* <div className="discounts"> */}
                        {/* <div className='coupon'>{couponLoading ? <Loader type='TailSpin' color='#385FDC' height={40} /> : discount}</div> */}
                        {/* <div className="QR">
                            <img src={QRCode} />
                        </div> */}
                    {/* </div> */}
                    {/* <div className='coupon'>{useCouponLoading && <Loader type='TailSpin' color='#385FDC' height={40}/>}</div> */}
                {/* </div> */}

                <div className="bookmark-wrapper">
                    <h3><BsBookmarkPlus className="accountIcon"/> Your bookmarks</h3>
                    {this.generateFilters(this.doFilter, currentInitFilters, currentPriceFilters, currentScheduleFilter)}
                    {/* <div className="bookmark-selects" id='filter-selects'>
                        <select onChange={this.doFilter} title='Filter By Initiatives'>
                            <option selected={filterInitiative == 'Filter By All Initiatives'}>Filter By All Initiatives</option>  
                            <option selected={filterInitiative == 'Sustainable'}>Sustainable</option>
                            <option selected={filterInitiative == 'Supply Chain'}>Supply Chain</option>
                            <option selected={filterInitiative == 'Diversity Focused'}>Diversity Focused</option>
                            <option selected={filterInitiative == 'Shopping'}>Shopping</option>
                            <option selected={filterInitiative == 'Food'}>Food</option>
                            <option selected={filterInitiative == 'Services'}>Services</option>
                        </select>
                        <select onChange={this.doFilter} title='Filter By Hours'>
                            <option selected={filterOpen == 'Filter By All Hours'}>Filter By All Hours</option>  
                            <option selected={filterOpen == 'Open Now'}>Open Now</option>
                        </select>
                        <select onChange={this.doFilter} title='Filter By Prices'>
                            <option selected={filterPrice == 'Filter By All Prices'}>Filter By All Prices</option>  
                            <option selected={filterPrice == '$'}>$</option>
                            <option selected={filterPrice == '$$'}>$$</option>
                            <option selected={filterPrice == '$$$'}>$$$</option>
                            <option selected={filterPrice == '$$$$'}>$$$$</option>
                        </select>
                    </div> */}
                    {bookmarksLoading ? <Loader type='TailSpin' color='#385FDC' height={40} /> : bookmarksList}
                </div>
            </div>
        )
    }
}

export default withRouter(AccountCustomer);