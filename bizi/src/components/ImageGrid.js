import React from 'react'
import UseModal from './UseModal'
import { createPortal } from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai';
import blankImg from '../images/noImage.png';
import busImg1 from '../images/pexels-andrea-piacquadio-3932730.jpg';
import busImg2 from '../images/pexels-rfstudio-4177755.jpg';
import busImg3 from '../images/pexels-justin-l-4060881.jpg';

const Modal = ({ isVisible, hideModal }) => {        
  return isVisible
      ? createPortal(
          <div className='story-modal'>
              <div className="story-modal-header">
                <h2>John Smith, <span>Owner of Juicery</span></h2>
                <AiOutlineClose className="story-modal-close" onClick={hideModal}/>              
              </div>

              <div className="story-modal-body">                  
                 <img className="story-modal-img" src={busImg3} />
                 <div className="story-modal-content">
                   <h3>Drinks. Atmosphere. Organic.</h3>
                   <p>This business is different from competitors because ya yeet.</p>
                   <p className="story-modal-enter">Click <span>Enter</span> to follow John's journey</p>
                 </div>
              </div>                            
          </div>,
          //document.body.getElementsByClassName("imageContainer")[0],
          document.body,
      )
      : null;
};

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
              <Modal isVisible={isVisible} hideModal={toggleModal} />
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