import React from "react"
import Map from './Map'
import AddReview from './AddReview'
import { BsBookmarkPlus, BsDownload } from "react-icons/bs";
import { BiBadgeCheck, BiCalendarPlus, BiPhone } from "react-icons/bi";
import { AiOutlineQuestionCircle, AiOutlineEye } from "react-icons/ai";
import { FiThumbsUp } from "react-icons/fi";
import { GiHealthNormal } from "react-icons/gi";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Link, withRouter } from "react-router-dom";
import testImg from '../images/pexels-maria-gloss-4197693.jpg';
import { Component } from "react";

function getBusinessFromURL(url, businesses) {
  var id = url.split('/')[2];
  // name = name.replace('%20', ' ');
  var business = businesses.filter((item) => item?.id == id)[0];
  return business;
}

class BusinessItem extends Component {
    constructor(props) {
      super(props)
    }
    
    componentDidMount() {
      const { businesses } = this.props;
      if (businesses.length == 0) {
        this.props.history.push('/search');
      }
    }

    render() {
      const { businesses } = this.props;
      var url = window.location.pathname;
      var business = getBusinessFromURL(url, businesses);

      return (       
          <>            
              <div className="description">
                  <div className="map">
                  <Map height={50} filteredBusinesses={[business]}/>
                  <div className="business-gallery">
                      <div className="business-row">
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                      </div>           
                      <div className="business-row">
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                      </div>   
                  </div>
                  </div>
                  <BusinessInfo business={business}/>        
              </div>            
          <AddReview/>   
          </>
      )
  }
}

class BusinessInfo extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        policyList: []
      }
    }

    generatePolicyList = () => {
      const { business } = this.props;
      var col1 = [];
      var col2 = [];

      if (business?.policyList.length > 0) {
        for (var i = 0; i < business?.policyList.length; i++) {
          i % 2 == 0 ? 
            col1.push(<li>{business?.policyList[i]}</li>) :
            col2.push(<li>{business?.policyList[i]}</li>);
        }

        var policies = [<ul>{col1}</ul>, <ul>{col2}</ul>];
        this.setState({
          policyList: policies
        });
      }
    }
    

    componentDidMount() {
      this.generatePolicyList();
    }

    render() {
      const { business } = this.props;
      const { policyList } = this.state;

      return (
          <div className="description-text">
              <div className="textbox">
                  <div className="business-header">
                      <Link to="/search"><RiArrowGoBackFill className="back-icon" /></Link>
                      <h2>{business?.businessName}</h2>       
                      <div className="a-box">                        
                          <BiBadgeCheck/>
                          <h4>A</h4> 
                      </div>
                      <AiOutlineQuestionCircle className="question"/>                                                                                                                                                                         
                  </div>
                  <h3 className="business-header-icons">
                      <BsBookmarkPlus className="icon "/>
                      <BsDownload className="icon "/>            
                  </h3>
              </div>
            {/* description */}
            <p className="textbox">{business?.businessDescription}</p>                        

            {policyList.length > 0 &&           
            <div className="icon-text">
              <GiHealthNormal className="action"/>
              {policyList}  
            </div>
            }
    
            <div className="icon-text">
              <BiCalendarPlus className="action"/> 
              <p><a href="#">Make a reservation</a></p>
            </div>

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
                {business?.businessURL && <p><a href={`//${business?.businessURL}`} target='_blank'>See more</a></p>}
              </div>
    
              <div className="review1">
                <FiThumbsUp className="thumbsUp"/>
                <div>
                  <p className="name">Jason</p>
                  <p>Donna porta hendreit ex, et sagittis magna.</p>
                </div>                      
              </div>
            </div>
          </div>                      
        )
    }
}

export default withRouter(BusinessItem);