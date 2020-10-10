import React from 'react';
import logo from './logo.svg';
import map from './images/map.jpg';
import foodImg from './images/pexels-mariana-kurnyk-1775043.jpg';
import shopImg from './images/pexels-ksenia-chernaya-3965557.jpg';
import serviceImg from './images/pexels-maria-gloss-4197693.jpg';
import otherImg from './images/pexels-oleg-magni-1005638.jpg';
import topImg from './images/pexels-arnon-suksumran-996219.jpg';
import busImg1 from './images/pexels-andrea-piacquadio-3932730.jpg';
import busImg2 from './images/pexels-rfstudio-4177755.jpg';
import busImg3 from './images/pexels-justin-l-4060881.jpg';
import { BsBookmarkPlus, BsDownload } from "react-icons/bs";
import { BiBadgeCheck, BiBrightness, BiCalendarPlus } from "react-icons/bi";
import { AiOutlineFacebook, AiOutlineInstagram, AiOutlineQuestionCircle } from "react-icons/ai";
import { FiTwitter, FiThumbsUp } from "react-icons/fi";
import { GiHealthNormal } from "react-icons/gi";
import Grid from '@material-ui/core/Grid';




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
        <Nav/>
        <Switch>          
          <Route path="/">            
            <Head />
            <Description />
            <Discover />
            <ReadStories />
            <CompanyInfo />
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
        <img src={map} />
      </div>

      <div className="description-text">
        <div className="textbox">
          <h2>Bat 17 <BsBookmarkPlus/> <BsDownload /></h2>
          <h2 className="right"><AiOutlineFacebook/> <AiOutlineInstagram/> <FiTwitter/></h2>
        </div>
        
        <p className="textbox">Lorem ipsum dolor sit amet, consectetar adipiscing elit. Donec porta hendreit ex, et sagittis magna.</p>                        
        
        <div className="textbox">
          <button type="button">A <BiBadgeCheck/></button>
          <h2 className="question"><AiOutlineQuestionCircle/></h2>
        </div>
        <p>
          <GiHealthNormal/>
          Air ventilation, Sanitize between customers, 1/2 capacity, Outdoor seating
        </p>
        <p><BiCalendarPlus/> <a href="#">Make a reservation</a></p>

        <div className="reviews">
          <div className="textbox">
            <p>Reviews</p>
            <a href="#">See more</a>
          </div>

          <div className="review1">
            <p><FiThumbsUp/> Jason</p>
            <p>Donna porta hendreit ex, et sagittis magna.</p>
          </div>
        </div>
      </div>      
    </div>
  )
}

function Discover() {
  return (
    <div className='discover'>
      <div>
        <h1>Discover</h1>
      </div>
      <div className='discover-cols'>
        <div className='discover-images-1'>
          <img src={foodImg}/>
          <h2>Food</h2>
        </div>
        <div className='discover-images-2'>
          <img src={shopImg}/>
          <h2>Shopping</h2>
        </div>
        <div className = 'discover-images-3'>
          <img src={serviceImg}/>
          <h2>Services</h2>
        </div>
        <div className = 'discover-images-4'>
          <img src={otherImg}/>
          <h2>More</h2>
        </div>
      </div>
    </div>
  )
}

function ReadStories() {
  return (
    <div className='read-stories'>
      <div>
        <h1>Read their Stories</h1>
      </div>
      <div className='bus-cols'>
        <div className='bus-col-1'>
          <img src={busImg1}/>
          <h2>Business 1</h2>
          <p>Lorem ipsum dolor sit amet, consectetur...</p>
        </div>
        <div className='bus-col-2'>
          <img src={busImg2}/>
          <h2>Business 2</h2>
          <p>Lorem ipsum dolor sit amet, consectetur...</p>
        </div>
        <div className='bus-col-3'>
          <img src={busImg3}/>
          <h2>Business 3</h2>
          <p>Lorem ipsum dolor sit amet, consectetur...</p>
        </div>
      </div>
      <a href='#'>
        <div id='read-more'>
          <h1>Read More</h1>
        </div>
      </a>
    </div>
  )
}

function CompanyInfo() {
  return (
    <div className='info'>
      <div>
        <h1>Bizi LLC.</h1>
      </div>
      <div>
        <h1>hello@bizi.com | 1111 Campus Dr., Evanston, IL 60201</h1>
      </div>
      <div>
        <h1><AiOutlineFacebook/> <AiOutlineInstagram/> <FiTwitter/></h1>
      </div>
    </div>
  )
}

export default App;
