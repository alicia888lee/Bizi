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
import { API, Storage } from 'aws-amplify';
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
            updatingBusinessDescription: false,
            newPolicies: [],
            editPolicies: false,
            updatingBusinessPolicies: false,
            newOrderUrl: "",
            updatingOrderUrl: false,
            editOrderUrl: false,
            newPhone: "",
            updatingPhone: false,
            editPhone: false,
            validPhone: true,
            imgFile: "",
            editImg: false,
            currImg: "",
            updatingImg: false
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
            var listBusinesses = businessQuery?.data?.listBusinesss?.items;               
            let business = listBusinesses.filter(item => item.userEmail === this.props.authUser.attributes.email)[0];                  
            this.setState({
                business: business,     
                loading: false,
                newBusinessDescription: business?.businessDescription,
                newPolicies: business?.policyList,
                newOrderUrl: business?.deliveryURL,
                newPhone: business?.businessPhone
            });
            await this.getCurrentImage();
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
        } = this.state;
        switch(action) {
            case "edit":
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
                break;
            default:
                break;
        } 
    }

    editPolicies = async(action, e) => {
        const { 
            newPolicies,
            business
        } = this.state;
        console.log(newPolicies);
        switch (action) {
            case "edit":
                this.setState({editPolicies: true});
                break;
            case "set-check":
                var policies = newPolicies.slice();
                policies.includes(e.target.value) ?
                    policies.splice(policies.indexOf(e.target.value), 1) :
                    policies.push(e.target.value);
                console.log(policies);
                this.setState({newPolicies: policies});
                break;
            case "save":
                // save
                this.setState({updatingBusinessPolicies: true});
                var updatedBusiness = {
                    ...business,
                    policyList: newPolicies
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
                    editPolicies: false,
                    updatingBusinessPolicies: false
                });
                break;
        }
    }

    editOrderUrl = async(action) => {
        const { 
            newOrderUrl, 
            business, 
        } = this.state;
        switch(action) {
            case "edit":
                // create input box
                this.setState({
                    editOrderUrl: true
                });
                break;
            case "save":
                // save
                this.setState({updatingOrderUrl: true});
                var updatedBusiness = {
                    ...business,
                    deliveryURL: newOrderUrl
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
                    editOrderUrl: false,
                    updatingOrderUrl: false
                });
                break;
            default:
                break;
        } 
    }

    editPhone = async(action) => {
        const { 
            newPhone, 
            business, 
            validPhone,
        } = this.state;
        switch(action) {
            case "edit":
                // create input box
                this.setState({
                    editPhone: true
                });
                break;
            case "save":
                // validate input
                if (newPhone && validPhone) {
                    // save
                    this.setState({updatingPhone: true});
                    var updatedBusiness = {
                        ...business,
                        businessPhone: newPhone
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
                        editPhone: false,
                        updatingPhone: false
                    });
                }
                else {
                    console.log("invalid desc");
                    this.setState({validPhone: false});
                }
                break;
            default:
                break;
        } 
    }

    async componentDidMount() {
        await this.getBusinessData();  
        this.generateReviews();
    }

    generatePolicyChecklist = () => {
        const { newPolicies, editPolicies, updatingBusinessPolicies } = this.state;
        var col1 = [
            "Weekly testing",
            "Daily deep cleans",
            "Contactless payment",
            "Temperature Checks",
            "Tables six feet apart",
            "Enforce Masks"
        ];
        var col2 = [
            "Air purification system",
            "Provides hand sanitizer",
            "Controlled capacity",
            "Sells masks",
            "Shield at the register",
            "Regular sanitizing"
        ];
        var col3 = [
            "UV lights sanitization",
            "Curbside pick-up",
            "Delivery available",
            "Wait outside for appointment",
            "Virtual services",
            "Gloves for shopping"
        ];
        var checklist = (
            <div className='policy-checklist-acct'>
                <div id='policy-col-acct'>
                    {col1.map(p => (
                        <div id='policy-checkbox'>
                            <input 
                                id={p} type="checkbox" 
                                disabled={!editPolicies} 
                                checked={newPolicies.includes(p)} 
                                value={p} 
                                onChange={(e) => this.editPolicies("set-check", e)}/>
                            <label for={p}>{p}</label>
                        </div>
                    ))}
                </div>
                <div id='policy-col-acct'>
                    {col2.map(p => (
                        <div id='policy-checkbox'>
                            <input 
                                id={p} 
                                type="checkbox" 
                                disabled={!editPolicies} 
                                checked={newPolicies.includes(p)} 
                                value={p} 
                                onChange={(e) => this.editPolicies("set-check", e)}/>
                            <label for={p}>{p}</label>
                        </div>
                    ))}
                </div>
                <div id='policy-col-acct'>
                    {col3.map(p => (
                        <div id='policy-checkbox'>
                            <input 
                                id={p} 
                                type="checkbox" 
                                disabled={!editPolicies} 
                                checked={newPolicies.includes(p)} 
                                value={p} 
                                onChange={(e) => this.editPolicies("set-check", e)}/>
                            <label for={p}>{p}</label>
                        </div>
                    ))}
                </div>
                <div id='policy-col-acct'>
                    {editPolicies ?
                        <div className='loginBody'>
                            <button id="save-update" onClick={() => this.editPolicies("save")}>Save</button>
                            {updatingBusinessPolicies && <Loader type='TailSpin' color='#385FDC' height={30}/>}
                        </div> :
                        <p><BsPencil id='edit-icon' onClick={() => this.editPolicies("edit")}/></p>}
                </div>
            </div>
        );
        return checklist;
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
                            {/* <a href="#">reply</a>                           */}
                            {/* <RiFlag2Line className="review-item-icon" /> */}
                        </span>
                    </div>
                    { review.text !== "" && <p className="review-text">{review.text}</p> }
                    </div>
                </div>                        
            )
            this.setState({reviews: reviewList});
        }
    }

    handleImgUpload = (e) => {
        this.setState({
            imgFile: e.target.files[0]
        });
    }

    getCurrentImage = async() => {
        const { business } = this.state;
        if (business?.imgPath) {
            try {
                var imgUrl = await Storage.get(business?.imgPath,
                    { level: 'public' }
                );
            }
            catch(e) {
                console.log(e);
            }
            console.log(imgUrl);
            this.setState({currImg: imgUrl});
        }
    }

    editImg = async(action) => {
        const { 
            imgFile, 
            business,
        } = this.state;
        switch(action) {
            case "edit":
                this.setState({
                    editImg: true
                });
                break;
            case "save":
                // save
                this.setState({updatingImg: true});
                var name = imgFile.name;
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
                // save to s3
                console.log(imgFile.name);
                try {
                    await Storage.put(name, imgFile, {
                        contentType: 'image/jpg'
                    });
                }
                catch(err) {
                    console.log(err);
                }
                
                var updatedBusiness = {
                    ...business,
                    imgPath: name
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
                    editImg: false,
                    updatingImg: false
                });
                break;
            default:
                break;
        } 
    }

    componentDidUpdate(prevProps, prevState) {
        const { newBusinessDescription, newPhone } = this.state;
        if (prevState.newBusinessDescription != newBusinessDescription
        || prevState.newPhone != newPhone) {
            var re = new RegExp(/^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/);
            this.setState({validPhone: re.test(newPhone)});
        }
    }

    render(){
        const { authUser } = this.props;       
        const { 
            business, 
            reviews, 
            editDescription,
            editOrderUrl,
            validBusinessDescription,
            updatingBusinessDescription,
            updatingOrderUrl,
            editPhone,
            validPhone,
            updatingPhone,
            imgFile,
            editImg,
            currImg,
            updatingImg
        } = this.state;
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
                            <p>{business?.businessDescription + "\t"}<BsPencil onClick={() => this.editDescription("edit")} id="edit-icon"/></p>}
                        <div className="account-policies">
                            <GiHealthNormal className="business-account-icon" />
                            {this.generatePolicyChecklist()}                           
                        </div>
                        
                        <div className="icon-text">
                            <BiCalendarPlus className="business-account-icon"/> 
                            {editOrderUrl ?
                                <div className='loginBody'>
                                    <input
                                        type="text"
                                        disabled={updatingOrderUrl}
                                        defaultValue={business?.deliveryURL}
                                        onChange={(e) => this.setState({newOrderUrl: e.target.value})}
                                    />
                                    <button id="save-update" onClick={() => this.editOrderUrl("save")}>Save</button>
                                    {updatingOrderUrl && <Loader type='TailSpin' color='#385FDC' height={30}/>}
                                </div> :
                                <p>
                                    <a 
                                        href={business?.deliveryURL ? `//${business?.deliveryURL}` : null}
                                        target="_blank"
                                    >
                                        {"Order online here" + "\t"}
                                    </a>
                                    <BsPencil onClick={() => this.editOrderUrl("edit")} id="edit-icon"/>
                                </p>}
                        </div>
                                                    
                        <div className="icon-text">
                            <BiPhone className="business-account-icon"/>
                            {editPhone ?
                                <div className='loginBody'>
                                    <input
                                        type="text"
                                        id={!validPhone && 'invalidInput'}
                                        placeholder='(xxx) xxx-xxxx'
                                        disabled={updatingOrderUrl}
                                        defaultValue={business?.businessPhone}
                                        onChange={(e) => this.setState({newPhone: e.target.value})}
                                    />
                                    <button id="save-update" onClick={() => this.editPhone("save")}>Save</button>
                                    {updatingPhone && <Loader type='TailSpin' color='#385FDC' height={30}/>}
                                </div> :
                                <p>
                                    {business?.businessPhone + "\t"}
                                    <BsPencil onClick={() => this.editPhone("edit")} id="edit-icon"/>
                                </p>}
                        </div> 
                    </div>     
                </div>                                                  
                
                <div>                    
                    <h3><AiFillCamera className="business-account-icon" />Update your Business Photo</h3>
                    {editImg ?
                        <div className='img-upload'>
                            <label for="businessUpload" className="business-upload">
                                {imgFile ? <ImgThumb image={imgFile} /> : <IoIosAdd className="review-add-icon" />}
                            </label>
                            <input id="businessUpload" type="file" name="file" onChange={this.handleImgUpload}/>
                            <button id='save-update-img' onClick={() => this.editImg('save')}>Save</button>
                            {updatingImg && <div id='update-img-load'><Loader type='TailSpin' color='#385FDC' height={30}/></div>}
                        </div> :
                        <div className='img-upload'>
                            {currImg ? 
                                <img id='update-img' src={currImg}/> :                                    
                                <p>Your business has no photo</p>
                            }
                            <p><BsPencil id='edit-icon' onClick={() => this.editImg('edit')}/></p>
                        </div>}
                </div>    

                <div>                    
                    <h3><FiThumbsUp className="business-account-icon" /> Your Business Reviews</h3>                                        
                    { reviews.length === 0 ?
                        <p>No reviews have been written for your business yet!</p> : 
                        <>
                            { reviews }
                            {/* <a href="#">see more</a>                                      */}
                        </>
                    }                    
                </div>            
            </div>
        )
    }
}

const ImgThumb = ({ image }) => {
    return <img src={URL.createObjectURL(image)} alt={image.name} className="reviewImg" />;
};

export default AccountBusiness