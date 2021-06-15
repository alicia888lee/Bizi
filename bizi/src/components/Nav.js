import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import LightLogo from '../images/lightLogo.jpg';
import DarkLogo from '../images/darkLogo.jpg';
import { Auth } from 'aws-amplify'
import {RiArrowDropDownLine} from 'react-icons/ri'

var width = window.innerWidth;
class Nav extends Component {
    constructor(props) {
      super(props)

      this.state = {
        userAuthenticated: false,
      }

      let isDiplayed = false;
      this.state = {
        display: "none"
      }
    }
    // check if user is signed in
    checkAuth = async() => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        return currentUser;
      }
      catch (e){
        console.log('error checking authentication', e);
      }      
    }

    updateUserState = (isAuth = false) => {
      this.setState({
        userAuthenticated: isAuth
      });
    }

    async componentDidMount() {
      const verifyAuth = await this.checkAuth();
      console.log(verifyAuth);
      verifyAuth && this.updateUserState(true);
    }

    signOut = async() => {
      try {
          await Auth.signOut();
      }
      catch (error) {
          console.log('error signing out', error);
      }
      this.props.history.push('/login');
    }

    boxClick = (e) => {
      console.log("hello there");
      if(this.isDiplayed === false){
        this.setState({
          display: "flex"
        });
      } else{
        this.setState({
          display: "none"
        });
      }

      this.isDiplayed = !this.isDiplayed;
      
    }

    render() {
        const {
            light
        } = this.props;

        const { userAuthenticated } = this.state;
        if(width <= 768){
          return (
            <nav className={!light && 'dark'}>
              <Link to='/'><img class="logo" src={light ? LightLogo : DarkLogo} alt="nav logo img"/></Link>

              <a href="#" class="toggle-button"  onClick={this.boxClick}>
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
              </a>

              <div className="nav-bar-links" style={{display: this.state.display}}>
                
                <ul>
                  <fieldset>
                    <input type="text" id="searchbar-nav" placeholder="&#xF002; What do you want to do, buy, or eat?" value={this.state.search} onChange={this.searchChange}/>
                  </fieldset>
                  <li id="search"><Link to="/search">Search</Link></li>
                  <li><Link to="/stories">Stories</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                    { userAuthenticated ?                  
                      <div className="dropdown">
                        <Link className="account-nav" to='/account'>My Account <RiArrowDropDownLine className="account-icon"/></Link>
                        <div className="dropdown-content">
                          <a style={{cursor: 'pointer'}} onClick={this.signOut}>Sign out</a>
                        </div>
                      </div> :
                      <li className="login-nav"><Link to='/login'>Log In</Link></li> }                
                </ul>
              </div>
            </nav>          
          );
        } 
        else{
          return (
            <nav className={!light && 'dark'}>
              <Link to='/'><img class="logo" src={light ? LightLogo : DarkLogo} alt="nav logo img"/></Link>
              <ul>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/stories">Stories</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                  { userAuthenticated ?                  
                    <div className="dropdown">
                      <Link className="account-nav" to='/account'>My Account <RiArrowDropDownLine className="account-icon"/></Link>
                      <div className="dropdown-content">
                        <a style={{cursor: 'pointer'}} onClick={this.signOut}>Sign out</a>
                      </div>
                    </div> :
                    <li className="login-nav"><Link to='/login'>Log In</Link></li> }                
              </ul>
            </nav>          
          );
        }
        
    }
}

export default withRouter(Nav);