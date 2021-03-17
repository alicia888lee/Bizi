import React from "react"
import { BsBookmarkPlus, BsDownload, BsBookmarkFill } from "react-icons/bs";
import { BiCalendarPlus, BiPhone, BiEnvelope, BiGlobe } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { GiHealthNormal } from "react-icons/gi";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { API, Auth, Storage } from 'aws-amplify'
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import ModalComponent from './StoriesModal';

class BusinessInfo extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        policyList: [],
        reviews: [],
        totalLikes: 0,
        bookmarked: false,
        currUser: null,
        currUserAPI: null,
        storyImg1: '',
        storyImg2: '',
        storyModal: false
      }
    }

    componentWillUnmount() {
      document.getElementById('root').style.filter = '';
    }

    updateAuth = async(authUser) => {
      try {
        var user = await API.graphql({
          query: queries.getUser,
          variables: {userEmail: authUser?.attributes?.email}
        });
      }
      catch(error) {
        console.log(error);
      }
      this.setState({
        currUser: user
      });
    }

    generatePolicyList = () => {
      const { business } = this.props;
      var col1 = [];
      var col2 = [];
      console.log(business);
      if (business?.policyList?.length > 0) {
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
                    <p className="name">{review.userName}</p>
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
      var currUserAPI = currUser?.data?.getUser;
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

    handler = (isOpen) => {        
      this.setState({
        storyModal: isOpen
      });
    }

    getImgUrl = async() => {
      const { business } = this.props;
      if (business?.story) {
        try {
          var url1 = await Storage.get(business?.story?.storyImg1,
            { level: 'public' });

          var url2 = await Storage.get(business?.story?.storyImg2,
            { level: 'public'});
          }
        catch(e) {
          console.log(e);
        }
        this.setState({
          storyImg1: url1,
          storyImg2: url2
        });
      }
    }

    async componentDidMount() {
      const verifyAuth = await this.checkAuth();
      verifyAuth && await this.updateAuth(verifyAuth);
      console.log('INFO REMOUNTING');
      this.getImgUrl();
      this.generatePolicyList();
      this.checkBookmarkStatus();
      this.generateReviews();
    }

    componentDidUpdate(prevProps) {
      const { business } = this.props;
      const { policyList } = this.state;
      if (prevProps?.business !== business) {
        this.getImgUrl();
        this.generatePolicyList();
        this.checkBookmarkStatus();
        this.generateReviews();
      }
      console.log(this.state.reviews);
      console.log(policyList);
    }

    render() {
      const { business } = this.props;                  
      const { policyList, reviews, currUser, bookmarked, totalLikes, storyImg1, storyImg2, storyModal } = this.state;      
      console.log(policyList);
      console.log(currUser);
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
                      {currUser?.data?.getUser?.userType == "Customer" && !bookmarked && <BsBookmarkPlus className="icon" onClick={this.setBookmark}/>}
                      {currUser?.data?.getUser?.userType == "Customer" && bookmarked && <BsBookmarkFill className='icon' onClick={this.setBookmark} />}
                      {/* <BsDownload className="icon "/>             */}
                  </h3>
              </div>
            
            <div className='business-tags'>
              <p>Recyclable Bottles</p>
              <p>Black Owned</p>
              <p>Charitable Donations</p>
              <p>Volunteering</p>
              <p>Volunteering</p>
              <p>Volunteering</p>
              <p>Volunteering</p>
            </div>
            <p className="textbox">{business?.businessDescription}</p>                        

            {policyList &&           
            <div className="icon-text">
              <GiHealthNormal className="action"/>
              {policyList}  
            </div>
            }
            {business?.businessURL &&
            <div className="icon-text">
              <BiGlobe className="action"/>
              <p><a href={business?.businessURL} target='_blank'>Visit us</a></p>
            </div>
            }
            {business?.reservationURL &&
            <div className="icon-text">
              <BiCalendarPlus className="action"/> 
              <p><a href={business?.reservationURL} target='_blank'>Make  reservation</a></p>
            </div>
            }
            {business?.deliveryURL &&
            <div className="icon-text">
              <BiCalendarPlus className="action"/> 
              <p><a href={business?.deliveryURL} target='_blank'>Order online here</a></p>
            </div>
            }
            {business?.businessPhone &&
            <div className="icon-text">
              <BiPhone className="action"/> 
              <p>{business?.businessPhone}</p>
            </div>
            }
            {business?.businessEmail &&
            <div className="icon-text">
              <BiEnvelope className="action"/> 
              <p>{business?.businessEmail}</p>
            </div>
            }
            {business?.story &&
            <div className="icon-text">
              <AiOutlineEye className="action"/> 
              <ModalComponent
                handler={this.handler}
                isOpen={storyModal}
                business={business}
                img1={storyImg1}
                img2={storyImg2}
                storiesPage={false}
              />
            </div>
            }
    
            <div className="reviews">
              <div className="textbox">
                <h3>Reviews</h3>
                {/* {business?.businessURL && this.state.reviews.length > 0 && <p><a href={`//${business?.businessURL}`} target='_blank'>See more</a></p>} */}
              </div>
              
              { this.state.reviews.length === 0 ? 
                <div>This business has no reviews. Be the first!</div> : <div className='reviews-text'>{reviews}</div> }
            </div>
          </div>                      
        )
    }
}

export default BusinessInfo;