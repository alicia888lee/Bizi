import React, { Component } from 'react';
import { Link } from "react-router-dom";
import LightLogo from '../images/lightLogo.jpg';
import DarkLogo from '../images/darkLogo.jpg';
import { Auth } from 'aws-amplify'

class Nav extends Component {
    constructor(props) {
      super(props)

      this.state = {
        userAuthenticated: false
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

    render() {
        const {
            light
        } = this.props;

        const { userAuthenticated } = this.state;

        return (
            <nav className={!light && 'dark'}>
              <Link to='/'><img class="logo" src={light ? LightLogo : DarkLogo} /></Link>
              <ul>                  
                <li id='myAccount'>
                  <Link to="/login" activeClassName="active">
                    {userAuthenticated ? 'My Account' : 'Log In'}
                  </Link>
                </li>
                <li><Link to="/contact" activeClassName="active">Contact</Link></li>
                <li><Link to="/stories">Stories</Link></li>
                {/* <li><Link to="/discover" activeClassName="active">Discover</Link></li> */}
                <li><Link to="/search" activeClassName="active">Search</Link></li>                                
              </ul>
            </nav>          
      )
  // {
  //   !props.light &&
  //     <nav class="dark">
  //         <Link to='/'><img class="logo" src={DarkLogo} /></Link>
  //         <ul>                  
  //           <li id='myAccount'><Link to="/login">{userIsLoggedIn ? 'My Account' : 'Log In'}</Link></li>
  //           <li><Link to="/contact">Contact</Link></li>
  //           <li className={window.location.pathname.startsWith('/stories') && 'active'}>
  //             <Link to="/stories">Stories</Link>
  //           </li>
  //           {/* <li><Link to="/discover">Discover</Link></li> */}
  //           <li><Link to="/search">Search</Link></li>                                
  //         </ul>
  //     </nav>          
  // }
    }
}

export default Nav;