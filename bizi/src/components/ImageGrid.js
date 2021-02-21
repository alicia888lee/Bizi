import React from 'react'
import UseModal from './UseModal'
import ModalComponent from './StoriesModal'
import { createPortal } from 'react-dom';
import { Link } from "react-router-dom";
import { AiOutlineClose } from 'react-icons/ai';
import blankImg from '../images/noImage.png';
import busImg1 from '../images/pexels-andrea-piacquadio-3932730.jpg';
import busImg2 from '../images/pexels-rfstudio-4177755.jpg';
import busImg3 from '../images/pexels-justin-l-4060881.jpg';
import Map from './Map'

class ImageGrid extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      storyModal: false
    }
  }

  componentWillUnmount() {
    document.getElementById('root').style.filter = '';
  }

  handler = (isOpen) => {        
    this.setState({
      storyModal: isOpen
    });
  }

  // function to generate tiles
  // get all businesses with a story
  // if >12, randomly pick 12 each time
  // if <12, leave blank tile
  // pass business as prop to modal

  render(){
    const {storyModal} = this.state;

    return (    
      <div className='imageContainer'>
        <div className="gridElement">
          <ModalComponent handler={this.handler} isOpen={storyModal}/>          
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