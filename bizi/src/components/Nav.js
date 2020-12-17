import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import LightLogo from '../images/lightLogo.jpg';
import DarkLogo from '../images/darkLogo.jpg';
import { Auth } from 'aws-amplify'

class Nav extends Component {
    constructor(props) {
      super(props)

      this.state = {
        userAuthenticated: false,
        selection: ''
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

    selectAccountOption = (e) => {
      e.target.value == 'My Account' ?
        this.props.history.push('/account') :
        this.signOut();
    }

    render() {
        const {
            light
        } = this.props;

        const { userAuthenticated, selection } = this.state;

        return (
            <nav className={!light && 'dark'}>
              <Link to='/'><img class="logo" src={light ? LightLogo : DarkLogo} /></Link>
              <ul>                  
                <li id='myAccount'>
                  {
                    userAuthenticated ? 
                    <select id='myAccountSelect' onChange={this.selectAccountOption}>
                      <option disabled selected style={{display: 'none'}}>My Account</option>
                      <option>My Account</option>
                      <option>Sign Out</option>
                    </select> :
                    <Link to='/login' activeClassName="active">Log In</Link>
                  }
                </li>
                <li><Link to="/contact" activeClassName="active">Contact</Link></li>
                <li><Link to="/stories">Stories</Link></li>
                {/* <li><Link to="/discover" activeClassName="active">Discover</Link></li> */}
                <li><Link to="/search" activeClassName="active">Search</Link></li>
              </ul>
            </nav>          
      )
    }
}

export default withRouter(Nav);