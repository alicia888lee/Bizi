import React from "react"
import { Route, Switch, Link } from "react-router-dom";
import Nav from './Nav'
import Recommendation from './Recommendation'
import SearchItems from './SearchItems'
import BusinessItem from './BusinessItem'
import ReadStories from './ReadStories'
import Footer from './Footer'
import * as queries from '../graphql/queries'
import { API } from 'aws-amplify'
import environmentImg from '../images/environment.png';
import heartImg from '../images/heart_hand.png';
import communityImg from '../images/community.png';
import testImg from '../images/pexels-mariana-kurnyk-1775043.jpg';
import { OpenTag, ClosedTag, PriceTag } from './SearchItemsList'

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.searchChange = this.searchChange.bind(this);

        this.state = {
          businesses: [],
          filteredBusinesses: [],
          searchList: [],
          search: "",
          loading: false
        }
      }
      searchChange(e){
        const { businesses } = this.state;
        var filtered = businesses.filter((item) => item?.businessName?.toLowerCase().includes(e.target.value.toLowerCase()));
        this.setState({
          filteredBusinesses: filtered,
          search: e.target.value
        });
        console.log(filtered);
      }

      getBusinessData = async() => {
        this.setState({
          loading: true
        });
        try {
            var businessQuery = await API.graphql({
                query: queries.listBusinesss
            });
            var listBusinesses = businessQuery?.data?.listBusinesss?.items;
            console.log(listBusinesses);
            this.setState({
                businesses: listBusinesses,
                filteredBusinesses: listBusinesses
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    isOpen = (schedule, tz='America/Chicago') => {
      var currDateTime = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
      var currHour = currDateTime.getHours();
      var currMin = currDateTime.getMinutes();
      var currDay = currDateTime.getDay();
      var currTime = currHour + (currMin / 60);
      var busHours = schedule[(currDay + 6) % 7];
      if (currTime >= busHours[0] && currTime <= busHours[1]) {
        return true;
      }
      return false;
    }

    generateSearchList = () => {
      const { filteredBusinesses } = this.state;

      var iconDict = {
        'Sustainability': {
          id: 'searchEnvironment',
          img: environmentImg
        },
        'Ethical Supply Chain': {
          id: 'searchHeart',
          img: heartImg
        },
        'Diversity Initiatives': {
          id: 'searchCommunity',
          img: communityImg
        }
      };

      var searchList = filteredBusinesses.map((item, index) => 
        item.approved &&
          <Link to={`/search/${item?.id}`} className='SearchItem' key={index}>
              <div className='SearchItemWrapper'>
                  <div className='SearchItemHeader'>
                      <h2>{item?.businessName}</h2>
                      {item?.initiatives.map((init) => 
                        <img className={iconDict[init]?.id} src={iconDict[init]?.img} />
                      )}
                  </div>

                  <div className='SearchItemTags'>
                      {this.isOpen(item?.schedule) ? <OpenTag /> : <ClosedTag />}
                      <PriceTag price={item?.priceRange}/>
                  </div>
              </div>
              <img className='SearchItemImg' src={testImg} />
          </Link>
      );
      
      this.setState({
          searchList: searchList,
          loading: false
      });
    }

    async componentDidMount() {
      await this.getBusinessData();
      this.generateSearchList();
    }

    componentDidUpdate(prevProps, prevState) {
      const { search } = this.state;

      if (prevState.search !== search) {
        this.generateSearchList();
      }
    }

    render(){
      const { searchList, loading, businesses } = this.state;

      return (
          <div className="search">
              <Nav />
              <h1 className="searchHeader">Find Local Businesses</h1>
              <input type="text" id="searchbar2" placeholder="&#xF002; Search businesses near you" value={this.state.search} onChange={this.searchChange}/>                
              
              <Switch>
                <Route exact path="/search">
                  <SearchItems searchList={searchList} loading={loading} businesses={businesses} />       
                </Route>
                <Route path={`/search/:businessId`}>               
                  <BusinessItem businesses={businesses}/>    
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