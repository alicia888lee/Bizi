import React from 'react'
import Nav from './Nav'
import LightLogo from '../images/lightLogo.jpg'
import sustain from '../images/environment.png'
import ethical from '../images/heart_hand.png'
import diversity from '../images/community.png'
import { Link } from 'react-router-dom'
class Header extends React.Component {

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
      <div id="header">
        <Nav light={true} />
        <div className="header-content">
          <img src={LightLogo} className="headerLogo" />        
          <div className="header-tags">
            <Link to="/search" className="header-tag">
              <img src={sustain} />
              <h3>Sustainability</h3>
            </Link>
            <Link to="/search" className="header-tag">
              <img src={ethical} /> 
              <h3>Ethical Supply Chain</h3>
            </Link>
            <Link to="/search" className="header-tag">
              <img src={diversity} />
              <h3>Diversity Initiatives</h3>
            </Link>
          </div>          
          <input type="text" id="searchbar" placeholder="&#xF002; Search businesses near you" value={this.state.search} onChange={this.searchChange}/>
        </div>
      </div>
    );}
  }

export default Header;