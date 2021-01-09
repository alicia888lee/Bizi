import React from "react"
import { BsBookmarkPlus, BsDownload, BsBookmarkFill } from "react-icons/bs";
import { BiCalendarPlus, BiPhone } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { GiHealthNormal } from "react-icons/gi";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { API, Auth } from 'aws-amplify'
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

class BusinessInfo extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        policyList: [],
        reviews: [],
        totalLikes: 0,
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
      console.log(business);
      if (business?.policyList.length > 0) {
        for (var i = 0; i < business?.policyList.length; i++) {
          i % 2 == 0 ? 
            col1.push(<li>{business?.policyList[i]}</li>) :
            col2.push(<li>{business?.policyList[i]}</li>);
        }

        var policies = [<ul>{col1}</ul>, <ul>{col2}</ul>];
      }
      this.setState({
        policyList: policies
      });
    }

    generateReviews = () => {
      const { business } = this.props;
        if(business?.reviews){
          const reviews = this.props?.business?.reviews;
          const reviewList = reviews.map(review =>
              <div className="review-item">                              
                  {review.rating > 0 ? 
                    <FiThumbsUp className="thumbs"/> : 
                    <FiThumbsDown className="thumbs"/> }
                  <div>
                    <p className="name">{review.user}</p>
                    <p>{review.text}</p>
                  </div>                      
              </div>
          )        
          this.setState({reviews: reviewList})               
          let total = business?.reviews.reduce((total, item) => total + item.rating, 0)      
          this.setState({totalLikes: total})
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
      this.generateReviews();
    }

    componentDidUpdate(prevProps) {
      const { business } = this.props;
      const { policyList } = this.state;
      if (prevProps?.business !== business) {
        this.generatePolicyList();
        this.checkBookmarkStatus();
        this.generateReviews();
      }
      console.log(policyList);
    }

    render() {
      const { business } = this.props;                  
      const { policyList, reviews, currUser, bookmarked, totalLikes } = this.state;      
      console.log(policyList);
      return (
          <div className="description-text">
              <div className="textbox">
                  <div className="business-header">
                      <Link to="/search"><RiArrowGoBackFill className="back-icon" /></Link>
                      <h2>{business?.businessName}</h2>    
                      {totalLikes > 0 &&    
                        <div className="business-likes">                                                  
                            <FiThumbsUp/>                          
                            <h4>{totalLikes}</h4> 
                        </div>}         
                  </div>
                  <h3 className="business-header-icons">
                      {currUser && !bookmarked && <BsBookmarkPlus className="icon" onClick={this.setBookmark}/>}
                      {currUser && bookmarked && <BsBookmarkFill className='icon' onClick={this.setBookmark} />}
                      <BsDownload className="icon "/>            
                  </h3>
              </div>
            
            <p className="textbox">{business?.businessDescription}</p>                        

            {policyList &&           
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
                {business?.businessURL && this.state.reviews.length > 0 && <p><a href={`//${business?.businessURL}`} target='_blank'>See more</a></p>}
              </div>
              
              { this.state.reviews.length === 0 ? 
                <div>This business has no reviews. Be the first!</div> : reviews }
            </div>
          </div>                      
        )
    }
}

export default BusinessInfo