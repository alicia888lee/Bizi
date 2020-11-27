import React from 'react';
import { Link } from "react-router-dom";
import LightLogo from '../images/lightLogo.jpg';
import DarkLogo from '../images/darkLogo.jpg';
import { Auth } from 'aws-amplify'

function Nav(props) {
    // check if user is signed in
    let checkAuth = async() => {
      try {
        await Auth.currentAuthenticatedUser();
      }
      catch (e){
        console.log('error checking authentication', e);
      }
      
    }

    // const userIsLoggedIn = checkAuth();
    const { userIsLoggedIn }  = checkAuth();
    console.log(userIsLoggedIn);

    if(props.light) {
      return(    
        <nav>
          <Link to='/'><img class="logo" src={LightLogo} /></Link>
          <ul>                  
            <li id='myAccount'><Link to="/login" activeClassName="active">{userIsLoggedIn ? 'My Account' : 'Log In'}</Link></li>
            <li><Link to="/contact" activeClassName="active">Contact</Link></li>
            <li><Link to="/stories">Stories</Link></li>
            {/* <li><Link to="/discover" activeClassName="active">Discover</Link></li> */}
            <li><Link to="/search" activeClassName="active">Search</Link></li>                                
          </ul>
        </nav>          
      )
    }
    return (
      <nav class="dark">
          <Link to='/'><img class="logo" src={DarkLogo} /></Link>
          <ul>                  
            <li id='myAccount'><Link to="/login">{userIsLoggedIn ? 'My Account' : 'Log In'}</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li className={window.location.pathname.startsWith('/stories') && 'active'}>
              <Link to="/stories">Stories</Link>
            </li>
            {/* <li><Link to="/discover">Discover</Link></li> */}
            <li><Link to="/search">Search</Link></li>                                
          </ul>
      </nav>          
    )
  }

export default Nav;