import React from "react"
import Map from './Map'
import AddReview from './AddReview'
import { BsBookmarkPlus, BsDownload, BsBookmarkFill } from "react-icons/bs";
import { BiBadgeCheck, BiCalendarPlus, BiPhone } from "react-icons/bi";
import { AiOutlineQuestionCircle, AiOutlineEye } from "react-icons/ai";
import { FiThumbsUp } from "react-icons/fi";
import { GiHealthNormal } from "react-icons/gi";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Link, withRouter } from "react-router-dom";
import testImg from '../images/pexels-maria-gloss-4197693.jpg';
import { Component } from "react";
import { API, Auth } from 'aws-amplify'
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';



class BusinessItem extends Component {
    constructor(props) {
      super(props)

      this.state = {
        business: this.props.location?.state?.business
      }
    }
    
    async componentDidMount() {
      const { business } = this.state;
      // console.log(location?.state?.business);
      // if url accessed directly, check database for business based on id
      if (!business) {
        var urlID = window.location.pathname.split('/')[2];
        try {
          var businessQuery = await API.graphql({
            query: queries.listBusinesss
          });
          var listBusinesses = businessQuery?.data?.listBusinesss?.items?.filter(item => item.approved);
          var retrieved = listBusinesses.filter((item) => item.id == urlID)[0];
          if (retrieved) {
            this.setState({
              business: retrieved
            });
          }
          else {
            this.props.history.push('/search');
          }
        }
        catch (error) {
          console.log(error);
        }
      }
    }

    componentDidUpdate(prevProps) {
      const { location } = this.props;
      if (prevProps?.location?.state?.business !== location?.state?.business) {
        this.setState({
          business: location?.state?.business
        });
      }
    }

    render() {
      const { business } = this.state;
      console.log('rendering business item', business);
      return (
          <>            
              <div className="description">
                  <div className="map">
                  <Map height={50} filteredBusinesses={[business]}/>
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
                  <BusinessInfo business={business}/>        
              </div>            
              <AddReview business={business}/>   
          </>
      )
  }
}

class BusinessInfo extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        policyList: [],
        bookmarked: false,
        currUser: null,
        currUserAPI: null
      }
    }

    updateAuth = (user) => {
      this.setState({
        currUser: user
      });
    }

    generatePolicyList = () => {
      const { business } = this.props;
      var col1 = [];
      var col2 = [];

      if (business?.policyList.length > 0) {
        for (var i = 0; i < business?.policyList.length; i++) {
          i % 2 == 0 ? 
            col1.push(<li>{business?.policyList[i]}</li>) :
            col2.push(<li>{business?.policyList[i]}</li>);
        }

        var policies = [<ul>{col1}</ul>, <ul>{col2}</ul>];
        this.setState({
          policyList: policies
        });
      }
    }

    checkAuth = async() => {
      try {
        const currUser = await Auth.currentAuthenticatedUser();
        return currUser;
      }
      catch (error) {
        console.log(error);
      }
    }

    checkBookmarkStatus = async() => {
      const { currUser } = this.state;
      const { business } = this.props;
      // check if business should be bookmarked or not
      console.log(currUser);
      try {
        var userEmail = currUser?.attributes?.email;
        var user = await API.graphql({
          query: queries.getUser,
          variables: {userEmail: userEmail}
        });
      }
      catch (error) {
        console.log(error);
      }
      var currUserAPI = user?.data?.getUser;
      var currBookmarks = currUserAPI?.bookmarks;
      console.log(currUserAPI);
      if (currUserAPI?.bookmarks) {
        this.setState({
          bookmarked: currBookmarks.includes(business?.id),
        });
      }
      this.setState({
        currUserAPI: currUserAPI
      });
    }

    setBookmark = async() => {
      // get user's current bookmarks
      const { currUser, currUserAPI, bookmarked } = this.state;
      const { business } = this.props;

      var currBookmarks = currUserAPI.bookmarks;
      if (!bookmarked) {
        if (currBookmarks) {
          currBookmarks.push(business?.id);
        }
        else {
          currBookmarks = [business?.id];
        }
        this.setState({
          bookmarked: true
        });
      }
      else {
        var indexToRemove = currBookmarks.indexOf(business?.id);
        currBookmarks.splice(indexToRemove, 1);
        this.setState({
          bookmarked: false
        });
      }
      // update user with new bookmarks
      var updateUserObj = {
        ...currUserAPI,
        bookmarks: currBookmarks
      }
      
      try {
        await API.graphql({
          query: mutations.updateUser,
          variables: {input: updateUserObj}
        });
      }
      catch (error) {
        console.log(error);
      }
      
    }

    async componentDidMount() {
      const verifyAuth = await this.checkAuth();
      verifyAuth && this.updateAuth(verifyAuth);
      this.generatePolicyList();
      this.checkBookmarkStatus();
    }

    componentDidUpdate(prevProps) {
      const { business } = this.props;
      if (prevProps?.business !== business) {
        this.generatePolicyList();
        this.checkBookmarkStatus();
      }
    }

    render() {
      const { business } = this.props;
      const { policyList, currUser, bookmarked } = this.state;
      return (
          <div className="description-text">
              <div className="textbox">
                  <div className="business-header">
                      <Link to="/search"><RiArrowGoBackFill className="back-icon" /></Link>
                      <h2>{business?.businessName}</h2>       
                      <div className="a-box">                        
                          <BiBadgeCheck/>
                          <h4>A</h4> 
                      </div>
                      <AiOutlineQuestionCircle className="question"/>                                                                                                                                                                         
                  </div>
                  <h3 className="business-header-icons">
                      {currUser && !bookmarked && <BsBookmarkPlus className="icon" onClick={this.setBookmark}/>}
                      {currUser && bookmarked && <BsBookmarkFill className='icon' onClick={this.setBookmark} />}
                      <BsDownload className="icon "/>            
                  </h3>
              </div>
            {/* description */}
            <p className="textbox">{business?.businessDescription}</p>                        

            {policyList.length > 0 &&           
            <div className="icon-text">
              <GiHealthNormal className="action"/>
              {policyList}  
            </div>
            }

            {business?.reservationURL &&
            <div className="icon-text">
              <BiCalendarPlus className="action"/> 
              <p><a href={`//${business?.reservationURL}`} target='_blank'>Make  reservation</a></p>
            </div>
            }
            <div className="icon-text">
              <BiPhone className="action"/> 
              <p>{business?.businessPhone}</p>
            </div>

            <div className="icon-text">
              <AiOutlineEye className="action"/> 
              <p><a href="#">View First Antique's story</a></p>
            </div>
            
    
            <div className="reviews">
              <div className="textbox">
                <h3>Reviews</h3>
                {business?.businessURL && <p><a href={`//${business?.businessURL}`} target='_blank'>See more</a></p>}
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
}

export default withRouter(BusinessItem);