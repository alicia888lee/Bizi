import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import LightLogo from '../images/lightLogo.jpg';
import DarkLogo from '../images/darkLogo.jpg';
import { Auth } from 'aws-amplify'
import {RiArrowDropDownLine} from 'react-icons/ri'

class Nav extends Component {
    constructor(props) {
      super(props)

      this.state = {
        userAuthenticated: false,
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

    render() {
        const {
            light
        } = this.props;

        const { userAuthenticated } = this.state;

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
      )
    }
}

export default withRouter(Nav);