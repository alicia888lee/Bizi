import React from 'react';
import Map from './components/map.js';
import foodImg from './images/pexels-mariana-kurnyk-1775043.jpg';
import shopImg from './images/pexels-ksenia-chernaya-3965557.jpg';
import serviceImg from './images/pexels-maria-gloss-4197693.jpg';
import otherImg from './images/pexels-oleg-magni-1005638.jpg';
import topImg from './images/pexels-arnon-suksumran-996219.jpg';
import { BsBookmarkPlus, BsDownload } from "react-icons/bs";
import { BiBadgeCheck, BiBrightness, BiCalendarPlus } from "react-icons/bi";
import { AiOutlineFacebook, AiOutlineInstagram, AiOutlineQuestionCircle } from "react-icons/ai";
import { FiTwitter, FiThumbsUp } from "react-icons/fi";
import { GiHealthNormal } from "react-icons/gi";

import { BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import './App.css';

class Head extends React.Component {

  constructor(props){
    super(props);
    this.state={search: ""};
    this.searchChange = this.searchChange.bind(this);
  }

  searchChange(e){
    this.setState({search: e.target.value});
  }

  render (){
    return (
    <div id="topImage">
      <Nav/>
      <img src={topImg} id="topImg" />
      <h1 id="title" style={{color: 'white'}}>Stay Safe. Stay <span style={{color: 'blue'}}>Bizi</span>.</h1>
      <input type="text" id="searchbar" placeholder="&#xF002; Search small businesses near you" value={this.state.search} onChange={this.searchChange}/>
    </div>
  );}
}


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>          
          <Route path="/">            
            <Head />
            <Description />
            <Discover />
          </Route>                  
        </Switch>       
      </Router>
    </div>
  );
}

//Navbar component that links to other pages
function Nav(){
  return(    
    <nav>
      <ul>                  
        <li><Link to="/login">Log In</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/stories">Stories</Link></li>
        <li><Link to="/discover">Discover</Link></li>
        <li><Link to="/search">Search</Link></li>                                
      </ul>
    </nav>          
  )
}

function Description(){
  return(
    <div className="description">
      <div className="map">
        <Map />
      </div>

      <div className="description-text">
        <div className="textbox">
          <h2>Bat 17 
            <BsBookmarkPlus className="icon action"/>
            <BsDownload className="icon action"/>
          </h2>
          <h2 className="right">
            <AiOutlineFacebook className="icon"/>
            <AiOutlineInstagram className="icon"/>
            <FiTwitter className="icon"/>
          </h2>
        </div>
        
        <p className="textbox">Lorem ipsum dolor sit amet, consectetar adipiscing elit. Donec porta hendreit ex, et sagittis magna.</p>                        
        
        <div className="textbox">
          <button type="button">A <BiBadgeCheck/></button>
          <h2 className="question"><AiOutlineQuestionCircle className="question"/></h2>
        </div>
        
        <div className="icon-text">
          <GiHealthNormal className="action"/>
          <p>Air ventilation, Sanitize between customers, 1/2 capacity, Outdoor seating</p>
        </div>

        <div className="icon-text">
          <BiCalendarPlus className="action"/> 
          <p><a href="#">Make a reservation</a></p>
        </div>
        

        <div className="reviews">
          <div className="textbox">
            <p>Reviews</p>
            <p><a href="#">See more</a></p>
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
    </div>
  )
}

function Discover(){
  return (
    <div className='discover'>
      <h1>Discover</h1>
      <div className='discover-images'>
        <img src={foodImg} />
        <h1>Food</h1>
      </div>
      <div className='discover-images'>
        <img src={shopImg} />
        <h1>Shopping</h1>
      </div>
      <div className = 'discover-images'>
        <img src={serviceImg} />
        <h1>Services</h1>
      </div>
      <div className = 'discover-images'>
        <img src={otherImg} />
        <h1>More</h1>
      </div>
    </div>
  )
}

export default App;
