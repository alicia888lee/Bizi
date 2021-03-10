import React from 'react';
import Home from './components/Home'
import Stories from './components/Stories'
import Contact from './components/Contact'
import Login from './components/Login'
import Account from './components/Account'
import CreateAccount from './components/CreateAccount'
import Search from './components/Search'
import LightLogo from '../src/images/lightLogo.jpg'
import ForgotPassword from './components/ForgotPassword'
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import ScrollToTop from './components/ScrollToTop.js';

function App() {
  var UNDER_CONSTRUCTION = false;
  var IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)
  return (
    <div className="App">
      {UNDER_CONSTRUCTION &&
        <h1>Website is currently under construction, check back later.</h1>
      }
      {IS_MOBILE && !UNDER_CONSTRUCTION &&
        <div id='is-mobile'>
          <h2>Looks like you're trying to find us from your phone...<br />...we're still working on the mobile site, so please visit our desktop site for now!</h2>
          <img src={LightLogo} />
        </div>
      }
      {!IS_MOBILE && !UNDER_CONSTRUCTION &&
        <Router>
          <ScrollToTop />
          <Switch>          
            <Route exact path="/">                        
              <Home />
            </Route>
            <Route path="/stories">
              <Stories />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>      
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/account">
              <Account />
            </Route>
            <Route path="/create">
              <CreateAccount />
            </Route>
            <Route path="/search" component={Search} />
            <Route path="/forgot-password">
              <ForgotPassword />
            </Route>
          </Switch>       
        </Router>
      }
    </div>
  );
}

export default App;