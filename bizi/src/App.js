import React from 'react';
import Home from './components/Home'
import Stories from './components/Stories'
import Login from './components/Login'

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
          <Route path="/login">
            <Login />
          </Route>                 
        </Switch>       
      </Router>
    </div>
  );
}

export default App;