import React from 'react'
import UseModal from './UseModal'
import { createPortal } from 'react-dom';
import { Link } from "react-router-dom";
import { AiOutlineClose } from 'react-icons/ai';
import blankImg from '../images/noImage.png';
import busImg1 from '../images/pexels-andrea-piacquadio-3932730.jpg';
import busImg2 from '../images/pexels-rfstudio-4177755.jpg';
import busImg3 from '../images/pexels-justin-l-4060881.jpg';
import Map from './Map'
import { Storage } from 'aws-amplify';


function ModalComponent(props) {
    // read in business from prop
    // pass business as prop to StoriesModal
    const { handler, isOpen, business, img1, img2 } = props;
    const { isVisible, toggleModal } = UseModal();
    var resetModal = false;
    if (isVisible !== isOpen) {
        handler(isVisible);
        resetModal = true;
    }
      
    return (
        <>
            <div className="gridElement">
              <img className="gridImg" src={img1} onClick={toggleModal} style={{cursor: 'pointer'}}/>
            </div>                                  
            <div className='couponModalContainer'>
                <StoriesModal 
                  isVisible={isVisible} 
                  hideModal={toggleModal} 
                  reset={resetModal}
                  page1={true} 
                  page2={false} 
                  page3={false}
                  img1={img1}
                  img2={img2}
                  business={business}
                />    
            </div>
        </>
    )
  }

export default ModalComponent;

class StoriesModal extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        page1: true,
        page2: false,
        page3: false
      }
    }
  
    handleClick(step){        
      if(step === 2){
        this.setState({page1: false});
        this.setState({page2: true});      
      } else if(step === 3) {
        this.setState({page2: false});
        this.setState({page3: true});           
      }    
    }

    componentDidUpdate(prevProps) {
      if (prevProps.reset != this.props.reset) {
        this.setState({page1: true, page2: false, page3:false});
      }
    }
  
    render(){
      const {page1, page2, page3} = this.state;
      const { img1, img2, business, isVisible, hideModal } = this.props;
      if(this.props.isVisible){
        document.getElementById('root').style.filter = 'blur(5px)';        
      } else {
        document.getElementById('root').style.filter = '';        
      }
      var firstName = business?.story?.storyPerson.split(" ")[0];
      var firstNamePlural = firstName.slice(-1).toLowerCase() != 's' ?
        firstName + "\'s" :
        firstName + "\'";

      return isVisible
        ? createPortal(
            <div className='story-modal'>
                <input type="hidden" onKeyPress={this.handleKeyPress}/>
                <div className="story-modal-header">
                  <h2>{business?.story?.storyPerson}, <span>{business?.story?.storyPersonTitle}</span></h2>
                  <AiOutlineClose className="story-modal-close" onClick={() => {
                    hideModal();
                    this.setState({
                      page1: true,
                      page2: false,
                      page3: false
                    });
                  }}/>              
                </div>
                {page1 && <div className="story-modal-body">                  
                    <img className="story-modal-img" src={img1} />
                    <div className="story-modal-content">
                      <h3>{business?.story?.storyKeywords}</h3>
                      <p>{business?.story?.storyDifference}</p>
                      <p className="story-modal-enter">Click <span onClick={() => this.handleClick(2)}>Enter</span> to follow {firstNamePlural} journey</p>
                    </div>
                  </div> }
                {page2 && <div className="story-modal-body">                  
                    <img className="story-modal-img" src={img2} />
                    <div className="story-modal-content">                  
                      <p>{business?.story?.storyBackground}</p>
                      <p className="story-modal-enter">Click <span onClick={() => this.handleClick(3)}>Enter</span> to follow {firstNamePlural} journey</p>
                    </div>
                  </div>}
                {page3 && <div className="story-modal-body">                  
                    <div className='map-modal'><Map height={35} filteredBusinesses={[business]} modal/></div>
                    <div className="story-modal-content story-modal-3">                  
                      <h3>{business?.businessName}</h3>
  
                      <p>{business?.businessDescription}</p>
                      <p id="story-modal-3-address">{business?.address}</p>
  
                      <Link to={{pathname:`/search/${business?.id}`, state: {business: business}}}>View Business Profile</Link>                  
                    </div>
                  </div>}                                 
            </div>,
            //document.body.getElementsByClassName("imageContainer")[0]
            document.body,
        )
      : null;
    }
  }