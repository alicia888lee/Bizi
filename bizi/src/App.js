import React from 'react';
import Home from './components/Home'
import Stories from './components/Stories'
import Contact from './components/Contact'
import Login from './components/Login'
import Account from './components/Account'
import CreateAccount from './components/CreateAccount'
import Search from './components/Search'
import ForgotPassword from './components/ForgotPassword'
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import ScrollToTop from './components/ScrollToTop.js';

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;