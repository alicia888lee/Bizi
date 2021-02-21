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

class Modal extends React.Component {
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

  render(){
    let {page1, page2, page3} = this.state;    

    if(this.props.isVisible){
      document.getElementById('root').style.filter = 'blur(5px)';        
    } else {
      document.getElementById('root').style.filter = '';        
    }

    return this.props.isVisible
      ? createPortal(
          <div className='story-modal'>
              <input type="hidden" onKeyPress={this.handleKeyPress}/>
              <div className="story-modal-header">
                <h2>John Smith, <span>Owner of Juicery</span></h2>
                <AiOutlineClose className="story-modal-close" onClick={this.props.hideModal}/>              
              </div>
              {page1 && <div className="story-modal-body">                  
                  <img className="story-modal-img" src={busImg3} />
                  <div className="story-modal-content">
                    <h3>Drinks. Atmosphere. Organic.</h3>
                    <p>This business is different from competitors because ya yeet.</p>
                    <p className="story-modal-enter">Click <span onClick={() => this.handleClick(2)}>Enter</span> to follow John's journey</p>
                  </div>
                </div> }
              {page2 && <div className="story-modal-body">                  
                  <img className="story-modal-img" src={busImg3} />
                  <div className="story-modal-content">                  
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non lorem ut justo convallis semper. Integer molestie purus ac ligula posuere, non hendrerit mauris placerat. Praesent sit amet condimentum eros. Aliquam quis finibus mauris, a aliquam tellus. Sed purus justo, pulvinar sed volutpat id, venenatis at eros. Cras id fermentum est.</p>
                    <p className="story-modal-enter">Click <span onClick={() => this.handleClick(3)}>Enter</span> to follow John's journey</p>
                  </div>
                </div>   }
              {page3 && <div className="story-modal-body">                  
                  <img className="story-modal-img" src={busImg3} />
                  <div className="story-modal-content story-modal-3">                  
                    <h3>Juicery</h3>

                    <p>Juice Bar | Lounge</p>
                    <p id="story-modal-3-address">1234 Sheridan Dr., Evanston IL, 60201</p>

                    <Link to="/search">View Business Profile</Link>                  
                  </div>
                </div>}                                 
          </div>,
          //document.body.getElementsByClassName("imageContainer")[0]
          document.body,
      )
    : null;
  }
}


function ModalComponent(props) {
  const { handler, isOpen } = props;
  const { isVisible, toggleModal } = UseModal();  
  if (isVisible !== isOpen) {
      handler(isVisible);
  }

  return (
      <>
          <div className="gridElement">
            <img className="gridImg" src={busImg1} onClick={toggleModal} style={{cursor: 'pointer'}}/>
          </div>                                  
          <div className='couponModalContainer'>
              <Modal isVisible={isVisible} hideModal={toggleModal} page1={true} page2={false} page3={false}/>
          </div>
      </>
  )
}

class ImageGrid extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      storyModel: false
    }
  }

  componentWillUnmount() {
    document.getElementById('root').style.filter = '';
  }

  handler = (isOpen) => {        
    this.setState({
      storyModel: isOpen
    });
  }

  render(){
    const {storyModel} = this.state;

    return (    
      <div className='imageContainer'>
        <div className="gridElement">
          <ModalComponent handler={this.handler} isOpen={storyModel}/>          
        </div>
        <div className="gridElement">
          <img className="gridImg" src={busImg2}  />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={busImg3}  />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank1' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank2' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank3' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank3' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank1' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank2' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank2' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank3' />
        </div>
        <div className="gridElement">
          <img className="gridImg" src={blankImg} id='blank1' />
        </div>
      </div>
    )
  }
}

  export default ImageGrid