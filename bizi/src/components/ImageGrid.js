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
import { API, Storage } from 'aws-amplify';
import * as queries from '../graphql/queries';
import Loader from 'react-loader-spinner';

class ImageGrid extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      storyModal: false,
      storyBusinesses: [],
      storiesLoading: false,
      tiles: []
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

  getStories = async() => {
    this.setState({storiesLoading: true});
    try {
      var businessQuery = await API.graphql({
        query: queries.listBusinesss,
        variables: {limit: 1000}
      });
      console.log(businessQuery);
      var listStories = businessQuery?.data?.listBusinesss?.items?.filter(item => item?.story);
      console.log(listStories);
      this.setState({
        storyBusinesses: listStories
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  getImgUrl = async(path) => {
    try {
      var url = await Storage.get(path,
        { level: 'public' });
        return url;
      }
    catch(e) {
      console.log(e);
    }
  }

  generateTiles = async() => {
    const { storyBusinesses, storyModal } = this.state;
    var businesses = [];
    console.log(storyBusinesses);
    if (storyBusinesses.length > 12) {
      var randInd = Math.floor(Math.random() * storyBusinesses.length);
      for (var i = randInd; i < randInd + 12; i++) {
        businesses.push(storyBusinesses[i % storyBusinesses.length]);
      }
    }
    else {
      businesses = storyBusinesses.slice();
    }
    
    var storyTiles = await Promise.all(businesses.map(async(business) => {
      var img1 = await this.getImgUrl(business?.story?.storyImg1);
      var img2 = await this.getImgUrl(business?.story?.storyImg2);
      return (
        <div>
          <ModalComponent 
            handler={this.handler} 
            isOpen={storyModal} 
            business={business}
            img1={img1}
            img2={img2}
            storiesPage={true}
          />
        </div>
    )}));
    console.log(businesses);
    this.setState({
      storiesLoading: false,
      tiles: storyTiles
    });
  }



  // function to generate tiles
  // get all businesses with a story
  // if >12, randomly pick 12 each time
  // if <12, leave blank tile
  // pass business as prop to modal

  async componentDidMount() {
    await this.getStories();
    this.generateTiles();
  }

  render(){
    const {tiles, storiesLoading} = this.state;

    return (
      <>
        {storiesLoading ?
          <Loader type='TailSpin' color='#385FDC' height={40}/> :
          <>{tiles.length > 0 ?
            <div className='imageContainer'>
              {tiles}
            </div> :
            <h1>There are currently no stories, but check back soon!</h1>}
          </>
        }
      </>
    )
  }
}

  export default ImageGrid