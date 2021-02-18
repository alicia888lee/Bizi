import React from "react"
import { BsBookmarkPlus  } from "react-icons/bs";
import { GiHealthNormal } from "react-icons/gi";
import { BsPencil } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { BiCalendarPlus, BiPhone } from "react-icons/bi";
import { AiFillCamera } from "react-icons/ai";
import { FiThumbsUp, FiThumbsDown  } from "react-icons/fi";
import { RiFlag2Line } from "react-icons/ri";
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { API } from 'aws-amplify';
import Loader from 'react-loader-spinner';

class AccountBusiness extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            business: null,      
            reviews: [],
            editDescription: false,
            newBusinessDescription: "",
            validBusinessDescription: true,
            updatingBusinessDescription: false
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
                loading: false,
                newBusinessDescription: business?.businessDescription           
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    editDescription = async(action) => {
        const { 
            newBusinessDescription, 
            business, 
            validBusinessDescription,
            updatingBusinessDescription
        } = this.state;
        switch(action) {
            case "make-editable":
                // create input box
                this.setState({
                    editDescription: true
                });
                break;
            case "save":
                // validate input
                if (newBusinessDescription && validBusinessDescription) {
                    // save
                    this.setState({updatingBusinessDescription: true});
                    console.log(newBusinessDescription);
                    var updatedBusiness = {
                        ...business,
                        businessDescription: newBusinessDescription
                    }
                    try {
                        await API.graphql({
                            query: mutations.updateBusiness,
                            variables: {input: updatedBusiness}
                        });
                    }
                    catch(e) {
                        console.log(e);
                    }
                    await this.getBusinessData();
                    this.setState({
                        editDescription: false,
                        updatingBusinessDescription: false
                    });
                }
                else {
                    console.log("invalid desc");
                    this.setState({validBusinessDescription: false});
                }
                
            default:
                break;
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

    componentDidUpdate(prevProps, prevState) {
        const { newBusinessDescription } = this.state;
        if (prevState.newBusinessDescription != newBusinessDescription) {
            this.setState({validBusinessDescription: newBusinessDescription})
        }
    }

    render(){
        const { authUser } = this.props;       
        const { 
            business, 
            reviews, 
            editDescription,
            validBusinessDescription,
            updatingBusinessDescription
        } = this.state;  
        let policies = this.state.business?.policyList.map(item => <li>{item}</li>)
        let firstName = authUser?.attributes?.name.split(' ')[0]
        return(
            <div className="account business-account">
                <h1 className="accountHeader">Hey {firstName}! Welcome Back!</h1>                
                <a href="https://calendly.com/biziinterview/30min" target="_blank"><button className="interview-btn" id="interview-schedule">Schedule your business spotlight interview</button></a>
                <h3>Update your Business Information</h3>

                <div className="business-info">
                    <h2><BsBookmarkPlus className="account-header-icon" /> { business?.businessName }</h2>
                    
                    <div className="business-info-wrapper">
                        {editDescription ? 
                            <div className="loginBody">
                                <input
                                id={!validBusinessDescription && "invalidInput"}
                                    type="text"
                                    disabled={updatingBusinessDescription}
                                    defaultValue={business?.businessDescription}
                                    onChange={(e) => this.setState({newBusinessDescription: e.target.value})}
                                />
                                <button id="save-update" onClick={() => this.editDescription("save")}>Save</button>
                                {updatingBusinessDescription && <Loader type='TailSpin' color='#385FDC' height={30}/>}
                            </div> :
                            <p>{ business?.businessDescription + "\t"}<BsPencil onClick={() => this.editDescription("make-editable")} id="edit-business"/></p>}
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