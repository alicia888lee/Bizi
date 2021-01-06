import React from 'react'
import { IoMdText, IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom"
import { Auth, Storage, API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import Loader from 'react-loader-spinner'

class AddReview extends React.Component {
    constructor(props) {
        super(props)  
        this.state = {
            user: "",
            userAuthenticated: false,
            file: "",
            text: "",
            loading: false,
            success: false,
            error: ""       
        }        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(e) {
        const name = e.target.type === 'file' ? 'file' : 'text';
        const val = e.target.type === 'file' ? e.target.files[0] : e.target.value;                
        this.setState({[name]: val});        
    }    

    async handleSubmit(e) {        
        e.preventDefault();
        const { file } = this.state
        try {
            this.setState({loading: true})
            await Storage.put(file.name, file, {              
              contentType: 'image/jpg'
            });            
            
            let currReviews = this.props.business.reviews ? this.props.business?.reviews : []            
            let review = {                
                user: this.state.user,
                imgPath: file.name,
                text: this.state.text,
                rating: 1
            }                           

            currReviews.push(review)
            let updatedBusiness = {...this.props.business, reviews: currReviews}
            try {
                await API.graphql({
                    query: mutations.updateBusiness,
                    variables: {input: updatedBusiness}
                });
            }
            catch (error) {                
                this.setState({error: error})
            }
            //TODO: add user review object maybe?

            this.setState({loading: false,
                            success: true})            
        } catch (err) {
            this.setState({error: err})            
        }        
    }
    
    // check if user is signed in
    checkAuth = async() => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser();            
            this.setState({user: currentUser?.attributes?.email})
            return currentUser;
        }
        catch (e){            
            this.setState({error: e})            
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
        const { userAuthenticated, file, loading, success, error } = this.state;

        if(userAuthenticated){
            return success ?  
                <div className="review-success">
                    <h2>Review was successfully added!</h2>                    
                </div> :
                <form className="add-review-wrapper" onSubmit={this.handleSubmit}>            
                    <h2 className="add-review-header"><IoMdText className="review-icon"/> Leave a Review</h2>
                    <div className="review-wrapper">
                        <label for="reviewUpload" className="review-upload">
                            <h3>Upload Photo</h3>                            
                            {file ? <ImgThumb image={file} /> : <IoIosAdd className="review-add-icon" /> }
                        </label>
                        <input id="reviewUpload" type="file" onChange={this.handleChange}/>
                        <div className="review-description">
                            <textarea value={this.state.text} onChange={this.handleChange} 
                                rows="4" className="reviewText" placeholder="Write a review..."/>
                        </div>
                    </div>
                    <button type="submit" className="reviewBtn">Post</button>
                    {loading &&  <Loader
                        type="TailSpin"
                        color="#385FDC"
                        height={40} /> }     
                    {error && <div><h2>Error: {this.state.error}</h2></div>}              
                </form>                                       
        }
        return(            
            <h2 className="reviewLogin"><Link to="/login">Login</Link> to your account to leave a review!</h2>        
        )
    }
}

const ImgThumb = ({ image }) => {
    return <img src={URL.createObjectURL(image)} alt={image.name} className="reviewImg" />;
};

export default AddReview