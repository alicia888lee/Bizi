import React from 'react'
import { IoMdText, IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom"
import { Auth, Storage } from 'aws-amplify'

class AddReview extends React.Component {
    constructor(props) {
        super(props)  
        this.state = {
            userAuthenticated: false,
            file: "",
            text: "",
            loading: false
        }
        this.handleUpload = this.handleUpload.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUpload(e) {
        this.setState({
            file: e.target.files[0]
        })        
    }

    handleChange(e) {
        this.setState({text: e.target.value});
    }    

    async handleSubmit(e) {
        console.log("submitting file :O")
        e.preventDefault();
        const { file } = this.state
        try {
            this.setState({loading: true})                                    
            await Storage.put(file.name, file, {              
              contentType: 'image/jpg'
            });
            
            const url = await Storage.get(file.name, { level: 'public' })
            console.log("Ya yeet")
            console.log("URL: " + url)            
            this.setState({loading: false})
        } catch (err) {
            console.log(err);
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
        const { userAuthenticated, file } = this.state;

        if(userAuthenticated){
            return( 
                <form className="add-review-wrapper" onSubmit={this.handleSubmit}>            
                    <h2 className="add-review-header"><IoMdText className="review-icon"/> Leave a Review</h2>
                    <div className="review-wrapper">
                        <label for="reviewUpload" className="review-upload">
                            <h3>Upload Photo</h3>                            
                            {file ? <ImgThumb image={file} /> : <IoIosAdd className="review-add-icon" /> }
                        </label>
                        <input id="reviewUpload" type="file" onChange={this.handleUpload}/>
                        <div className="review-description">
                            <textarea value={this.state.text} onChange={this.handleChange} 
                                rows="4" className="reviewText" placeholder="Write a review..."/>
                        </div>
                    </div>
                    <button type="submit" className="reviewBtn">Post</button>
                </form>
            )
        }
        return(            
            <h2 className="reviewLogin"><Link to="/login">Login</Link> to your account leave a review!</h2>        
        )
    }
}

const ImgThumb = ({ image }) => {
    return <img src={URL.createObjectURL(image)} alt={image.name} className="reviewImg" />;
};

export default AddReview