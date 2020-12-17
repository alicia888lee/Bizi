import React from "react"
import { Route, Switch } from "react-router-dom";
import Nav from './Nav'
import Recommendation from './Recommendation'
import SearchItems from './SearchItems'
import BusinessItem from './BusinessItem'
import ReadStories from './ReadStories'
import Footer from './Footer'

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state={search: ""};
        this.searchChange = this.searchChange.bind(this);
      }
      searchChange(e){
        this.setState({search: e.target.value});
      }

      render(){        

        return (
            <div className="search">
                <Nav />
                <h1 className="searchHeader">Find Local Businesses</h1>
                <input type="text" id="searchbar2" placeholder="&#xF002; Search businesses near you" value={this.state.search} onChange={this.searchChange}/>                
                
                <Switch>
                  <Route exact path="/search">
                    <SearchItems />       
                  </Route>
                  <Route path={`/search/:businessId`}>               
                    <BusinessItem />    
                  </Route>
                </Switch>                

                <Recommendation />
                <ReadStories />
                <Footer />
            </div>
        )
      }

}

export default Search