import React from 'react'
import { IoMdText, IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom"
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
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
            rating: 0,
            loading: false,
            success: false,
            error: ""       
        }        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(e) {        
        const { name } = e.target;        
        const val = e.target.type === 'file' ? e.target.files[0] : e.target.value;                        
        this.setState({[name]: val});                
        this.setState({error: ""});
    }    

    async handleSubmit(e) {        
        e.preventDefault();
        const { file } = this.state   

        if(this.state.rating !== 0){
            try {
                this.setState({loading: true})  

                let name = file.name;

                // check for duplicate name
                try {                    
                    var fileList = await Storage.list("", 
                        { level: 'public' });
                    console.log(fileList);
                    fileList = fileList.map(f => (
                        f?.key
                    ));
                    console.log(fileList);
                    
                    var imgExists = fileList.includes(name);
                    var re = new RegExp(/\-[0-9]/);
                    while (imgExists) {
                        var extension = name.lastIndexOf(".");
                        var version = name.substring(extension - 2, extension);
                        if (re.test(version)) {
                            console.log(name);

                            var newVersion = parseInt(version[1]) + 1;
                            name = name.substring(0, extension - 1) + newVersion + name.substring(extension);
                        }
                        else {
                            name = name.substring(0, extension) + "-1" + name.substring(extension);
                        }
                        console.log(name);
                        imgExists = fileList.includes(name);
                    }
                }
                catch (e) {
                    //file name doesn't exist, proceed normally                     
                }
                
                await Storage.put(name, file, { 
                    contentType: 'image/jpg' });                                                                   

                let currReviews = this.props.business.reviews ? this.props.business?.reviews : []            
                let review = {
                    userEmail: this.state.user?.email,
                    userName: this.state.user?.name,
                    imgPath: name,
                    text: this.state.text,
                    rating: parseInt(this.state.rating)
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
                this.props.handler(updatedBusiness)
            } catch (err) {
                console.log(err)
                // this.setState({error: err})            
            }        
        } else {
            this.setState({error: "Rating is a required field!"})        
        }
    }
    
    // check if user is signed in
    checkAuth = async() => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser();            
            this.setState({user: currentUser?.attributes})
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

    componentDidUpdate(prevProps) {
        const { business } = this.props;
        if (prevProps.business?.id !== business?.id) {
            this.setState({
                success: false,
                file: ''
            });
        }
    }

    render(){
        const { userAuthenticated, file, loading, success, error } = this.state;        

        if(userAuthenticated){
            return success ?  
                <div className="review-success">
                    <h2>Review was successfully added!</h2>                    
                </div> :
                <>
                    <form className="add-review-wrapper" onSubmit={this.handleSubmit}>            
                        <h2 className="add-review-header"><IoMdText className="review-icon"/> Leave a Review</h2>
                        <h2 className="add-review-subtext">Would you recommend {this.props.business?.businessName} to a friend?</h2>
                        <div className="review-wrapper">
                            <label for="reviewUpload" className="review-upload">
                                <h3>Upload Photo</h3>                            
                                {file ? <ImgThumb image={file} /> : <IoIosAdd className="review-add-icon" /> }
                            </label>
                            <input id="reviewUpload" type="file" onChange={this.handleChange} name="file"/>
                            <div className="review-description">
                                <div className="review-likes">
                                    <input type="radio" id="thumbsUp" value="1" onChange={this.handleChange} name="rating"/>
                                    <label for="thumbsUp"><FiThumbsUp /></label>

                                    <input type="radio" id="thumbsDown" value="0" onChange={this.handleChange} name="rating" />
                                    <label for="thumbsDown"><FiThumbsDown /></label>
                                </div>
                                <textarea value={this.state.text} onChange={this.handleChange} name="text"
                                    rows="2" className="reviewText" placeholder="Write a review..."/>
                            </div>
                        </div>
                        <button type="submit" className="reviewBtn">Post</button>
                        {loading &&  <Loader
                            type="TailSpin"
                            color="#385FDC"
                            height={40} /> }                                                                     
                    </form>                      
                    {error !== "" && <div className="error">Error: {error}</div>}
                </>                            
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