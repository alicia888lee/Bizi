import React from "react"
import { BsBookmarkPlus  } from "react-icons/bs";
import { GiHealthNormal } from "react-icons/gi";
import { IoIosAdd } from "react-icons/io";
import { BiCalendarPlus, BiPhone } from "react-icons/bi";
import { AiFillCamera } from "react-icons/ai";
import { FiThumbsUp, FiThumbsDown  } from "react-icons/fi";
import { RiFlag2Line } from "react-icons/ri";
import * as queries from '../graphql/queries'
import { API } from 'aws-amplify'

class AccountBusiness extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            business: null,      
            reviews: []       
        }
    }

    getBusinessData = async() => {
        this.setState({
          loading: true
        });
        try {
            var businessQuery = await API.graphql({
                query: queries.listBusinesss
            });
            var listBusinesses = businessQuery?.data?.listBusinesss?.items?.filter(item => item.approved);                     
            let business = listBusinesses.filter(item => item.userEmail === this.props.authUser.attributes.email)[0];                  
            this.setState({
                business: business,     
                loading: false           
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    async componentDidMount() {
        await this.getBusinessData();    
        this.generateReviews();    
    }

    generateReviews() {
        const reviews = this.state.business.reviews;
        if (reviews) {
            let reviewList = reviews?.map(review =>             
                <div className="review-item-account">
                    <div classname="review-item-wrapper">
                    <div className="review-item-header">
                        <h4>{review.userName} 
                            {review.rating > 0 ? <FiThumbsUp className="review-thumbs" /> : <FiThumbsDown className="review-thumbs"/>}</h4>
                        <span>
                            <a href="#">reply</a>                            
                            <RiFlag2Line className="review-item-icon" />
                        </span>
                    </div>
                    { review.text !== "" && <p className="review-text">{review.text}</p> }
                    </div>
                </div>                        
            )
            this.setState({reviews: reviewList});
        }
    }

    render(){
        const { authUser } = this.props;       
        const { business, reviews } = this.state;  
        let policies = this.state.business?.policyList.map(item => <li>{item}</li>)    
        let firstName = authUser?.attributes?.name.split(' ')[0]                                             
                
        return(
            <div className="account business-account">
                <h1 className="accountHeader">Hey {firstName}! Welcome Back!</h1>                
                <button className="interview-btn">Schedule your business spotlight interview</button>                            
                <h3>Update your Business Information</h3>

                <div className="business-info">
                    <h2><BsBookmarkPlus className="account-header-icon" /> { business?.businessName }</h2>
                    
                    <div className="business-info-wrapper">
                        <p>{ business?.businessDescription }</p>
                        <div className="account-policies">
                            <GiHealthNormal className="business-account-icon" />
                            <ul>
                                {policies}
                                <button><IoIosAdd /></button>
                            </ul>
                        </div>
                        
                        <div className="icon-text">
                            <BiCalendarPlus className="business-account-icon"/> 
                            <p><a href={business?.deliveryUrl} >Order online here</a></p>
                        </div>
                                                    
                        <div className="icon-text">
                            <BiPhone className="business-account-icon"/>
                            <p>{business?.businessPhone}</p>
                        </div> 
                    </div>     
                </div>                                                  
                
                <div>                    
                    <h3><AiFillCamera className="business-account-icon" /> Upload photos for increased engagement</h3>
                    <label for="businessUpload" className="business-upload">                        
                        <IoIosAdd className="review-add-icon" /> 
                    </label>
                    <input id="businessUpload" type="file" name="file"/>
                </div>    

                <div>                    
                    <h3><FiThumbsUp className="business-account-icon" /> Your Business Reviews</h3>                                        
                    { reviews.length === 0 ?
                        <p>No reviews have been written for your business yet!</p> : 
                        <>
                            { reviews }
                            <a href="#">see more</a>                                            
                        </>
                    }                    
                </div>            
            </div>
        )
    }
}

export default AccountBusiness