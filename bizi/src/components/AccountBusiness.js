import React from "react"
import { BsBookmarkPlus  } from "react-icons/bs";
import { GiHealthNormal } from "react-icons/gi";
import { IoIosAdd } from "react-icons/io";
import { BiCalendarPlus, BiPhone } from "react-icons/bi";
import { AiFillCamera } from "react-icons/ai";
import { FiThumbsUp  } from "react-icons/fi";
import { RiFlag2Line  } from "react-icons/ri";

class AccountBusiness extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            userName: ""
        }
    }

    componentDidMount() {
        // const { user, authUser } = this.props;        
        // console.log('ya yeet')
        // console.log(this.props)
        // if (authUser) {
            
        //     var name = authUser?.attributes?.name;
        //     const firstName = name.split(' ')[0];
        //     console.log(firstName)
        //     this.setState({
        //         userName: firstName
        //     });          
        // } else {
        // //   this.props.history.push('/login');
        // }
    }

    render(){
        const { user, authUser } = this.props; 
        console.log(user)
        let firstName = ""
        if (authUser) {    
            var name = authUser?.attributes?.name;
            firstName = name.split(' ')[0];            
        }
                
        return(
            <div className="account business-account">
                <h1 className="accountHeader">Hey {firstName}! Welcome Back!</h1>                
                <button className="interview-btn">Schedule your business spotlight interview</button>
                            
                    <h3>Update your Business Information</h3>

                <div className="business-info">
                    <h2><BsBookmarkPlus className="account-header-icon" /> Stacy's Sprinkles</h2>
                    
                    <div className="business-info-wrapper">
                        <p>Lorem ipsum</p>
                        <div className="account-policies">
                            <GiHealthNormal className="business-account-icon" />
                            <ul>
                                <li>Air ventilation</li>
                                <li>Outdoor seating</li>
                                <li>1/2 capacity</li>
                                <li>Sanitize between customers</li>
                                <button><IoIosAdd /></button>
                            </ul>
                        </div>

                        <div className="icon-text">
                            <BiCalendarPlus className="business-account-icon"/> 
                            <p><a href="">Order online here</a></p>
                        </div>
                            
                        <div className="icon-text">
                            <BiPhone className="business-account-icon"/>
                            <p>(123) 123-1234</p>
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
                    <div>
                        <div className="review-item-account">
                            <div className="review-item-header">
                                <h4>Username</h4>
                                <span>
                                    <a href="#">reply</a>                            
                                    <RiFlag2Line className="review-item-icon" />
                                </span>
                            </div>
                            <p className="review-text">Lorem ipsum</p>
                        </div>
                        <a href="#">see more</a>                        
                    </div>
                </div>            
            </div>
        )
    }
}

export default AccountBusiness