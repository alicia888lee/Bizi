import React from 'react'
import { IoMdText, IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom"
import { Auth } from 'aws-amplify'

class AddReview extends React.Component {
    constructor(props) {
        super(props)  
        this.state = {
            userAuthenticated: false,
        }
    }
    
    // check if user is signed in
    checkAuth = async() => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            return currentUser;
        }
        catch (e){
          console.log('error checking authentication', e);
        }        
    }
  
    updateUserState = (isAuth = false) => {
        this.setState({
          userAuthenticated: isAuth
        });
    }
  
    async componentDidMount() {
        const verifyAuth = await this.checkAuth();                
        verifyAuth && this.updateUserState(true);
    }

    render(){
        const { userAuthenticated } = this.state;

        if(userAuthenticated){
            return( 
                <div className="add-review-wrapper">            
                    <h2 className="add-review-header"><IoMdText className="review-icon"/> Leave a Review</h2>
                    <div className="review-wrapper">
                        <div className="review-upload">
                            <h3>Upload Photo</h3>
                            <IoIosAdd className="review-add-icon" />
                        </div>
                        <div className="review-description">
                            <textarea rows="4" className="reviewText" placeholder="Write a review..."/>
                        </div>
                    </div>
                    <button className="reviewBtn">Post</button>
                </div>
            )
        }
        return(            
            <h2 className="reviewLogin"><Link to="/login">Login</Link> to your account leave a review!</h2>        
        )
    }
}

export default AddReview