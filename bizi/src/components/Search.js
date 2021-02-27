import React from "react"
import { Route, Switch, Link } from "react-router-dom";
import Nav from './Nav'
import Recommendation from './Recommendation'
import SearchItems from './SearchItems'
import BusinessItem from './BusinessItem'
import ReadStories from './ReadStories'
import Footer from './Footer'
import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations'
import { API, Storage } from 'aws-amplify'
import environmentImg from '../images/environment.png';
import heartImg from '../images/heart_hand.png';
import communityImg from '../images/community.png';
import placeholderImg from '../images/pexels-mariana-kurnyk-1775043.jpg';
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
          currentFilters: [null, null, null],
          filterInitiative: this.props.location?.state?.initialFilter,
          filterPrice: '',
          filterOpen: '',
          sort: '',
          loading: false,
        }
      }
      searchChange(e, initialSearch='') {
        const { businesses } = this.state;
        
        if (initialSearch) {
          var filtered = businesses.filter((item) => {
            if (initialSearch == '') {
              return true;
            }
            return item?.businessName?.toLowerCase().includes(initialSearch.toLowerCase());
          });
          this.setState({
            filteredBusinesses: filtered,
            search: initialSearch
          });
        }

        if (e) {
          filtered = businesses.filter((item) => item?.businessName?.toLowerCase().includes(e.target.value.toLowerCase()));
          this.setState({
            filteredBusinesses: filtered,
            search: e.target.value
          });
        }
      }

      filterChange(e, initialFilter) {
        const { businesses, currentFilters } = this.state;
        // currentFilters format is [initiative, price, open]
        var setFilters = currentFilters.slice();
        console.log(setFilters);
        console.log(initialFilter);
        var filterTypes = {
          'All Initiatives': {
            category: 'initiatives',
            value: ['Sustainability', 'Ethical Supply Chain', 'Diversity Initiatives', 'Shopping', 'Food', 'Services']
          },
          'Sustainable': {
            category: 'initiatives',
            value: 'Sustainability'
          },
          'Supply Chain': {
            category: 'initiatives',
            value: 'Ethical Supply Chain'
          },
          'Diversity Focused': {
            category: 'initiatives',
            value: 'Diversity Initiatives'
          },
          'Shopping': {
            category: 'initiatives',
            value: 'Shopping'
          },
          'Food': {
            category: 'initiatives',
            value: 'Food'
          },
          'Services': {
            category: 'initiatives',
            value: 'Services'
          },
          'All Prices': {
            category: 'priceRange',
            value: [1, 2, 3, 4]
          },
          '$': {
            category: 'priceRange',
            value: 1
          },
          '$$': {
            category: 'priceRange',
            value: 2
          },
          '$$$': {
            category: 'priceRange',
            value: 3
          },
          '$$$$': {
            category: 'priceRange',
            value: 4
          },
          'All Hours': {
            category: 'schedule'
          },
          'Open Now': {
            category: 'schedule'
          }
        };
        console.log(initialFilter);
        
        if (initialFilter) {
          setFilters[0] = initialFilter;
          this.setState({
            filterInitiative: initialFilter,
          });
        }

        if (e) {
          // filtered = businesses.filter((item) => {
            if (filterTypes[e.target.value]?.category == 'initiatives') {
              setFilters[0] = e.target.value;
              // filtered = filtered.filter(item => 
              //   item?.initiatives?.includes(filterTypes[e.target.value]?.value));
              this.setState({filterInitiative: e.target.value});
              // return item?.initiatives?.includes(filterTypes[e.target.value]?.value);
            }
            if (filterTypes[e.target.value]?.category == 'priceRange') {
              setFilters[1] = e.target.value;
              // filtered = filtered.filter(item => 
              //   item?.priceRange == filterTypes[e.target.value]?.value);
              this.setState({filterPrice: e.target.value});
              // return item?.priceRange == filterTypes[e.target.value]?.value;
            }
            if (filterTypes[e.target.value]?.category == 'schedule') {
              setFilters[2] = e.target.value;
              // filtered = filtered.filter(item => 
              //   this.isOpen(item?.schedule));
              this.setState({filterOpen: e.target.value});
              // return this.isOpen(item?.schedule);
            }
            if (e.target.value == 'Filter By All Initiatives') {
              setFilters[0] = 'All Initiatives';
              this.setState({filterInitiative: e.target.value});
              // return true;
            }
            if (e.target.value == 'Filter By All Prices') {
              this.setState({filterPrice: e.target.value});
              setFilters[1] = 'All Prices';
            }
            if (e.target.value == 'Filter By All Hours') {
              this.setState({filterOpen: e.target.value});
              setFilters[2] = 'All Hours';
            }
          }

          var filtered = businesses.slice();
          setFilters.filter(fil => fil)
            .forEach(fil => {
              console.log(fil);
              switch(filterTypes[fil]?.category) {
                case "initiatives":
                  filtered = businesses?.filter(item => {
                    if (fil == 'All Initiatives') {
                      return filterTypes[fil]?.value.some(val => item?.initiatives?.includes(val));
                    }
                    return item?.initiatives?.includes(filterTypes[fil]?.value)
                  });
                  console.log(filtered);
                  break;
                case "priceRange":
                  filtered = filtered?.filter(item => {
                    if (fil == 'All Prices') {
                      return filterTypes[fil]?.value.some(val => item?.priceRange == val);
                    }
                    return item?.priceRange == filterTypes[fil]?.value
                  });
                  console.log(filtered);
                  break;
                case "schedule":
                  filtered = filtered?.filter(item => {
                    if (fil == 'All Hours') {
                      return this.isOpen(item?.schedule) || !this.isOpen(item?.schedule);
                    }
                    return this.isOpen(item?.schedule)
                  });
                default:
                  break;
              }
            });
          console.log(filtered);

          this.setState({
            filteredBusinesses: filtered,
            currentFilters: setFilters
          });
      }

      compareLower = (a, b) => (
        a?.priceRange < b?.priceRange ? -1 : 1
      )

      compareHigher = (a, b) => (
        a?.priceRange > b?.priceRange ? -1 : 1
      )
      
      sortChange = (e) => {
        const { filteredBusinesses } = this.state;
        var sorted = undefined;
        if (e.target.value == 'Lowest Price') {
          sorted = filteredBusinesses.sort(this.compareLower);
        }
        else if (e.target.value == 'Highest Price') {
          sorted = filteredBusinesses.sort(this.compareHigher)
        }
        console.log(sorted);

        this.setState({
          filteredBusinesses: sorted,
          sort: e.target.value
        });
      }

      getBusinessData = async() => {
        this.setState({
          loading: true
        });
        try {
            var businessQuery = await API.graphql({
                query: queries.listBusinesss,
                variables: {limit: 1000}
            });
            var listBusinesses = businessQuery?.data?.listBusinesss?.items?.filter(item => item.approved);
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

      generateSearchList = async(randomize=false) => {
        const { filteredBusinesses } = this.state;
        var shuffledFilteredBusinesses = filteredBusinesses.slice();
        if (randomize) {
          console.log('RANDOMIZING');
          // shuffle business list
            for (let i = shuffledFilteredBusinesses.length - 1; i > 0; i--) {
              var rand = Math.floor(Math.random() * (i + 1));
              var old = shuffledFilteredBusinesses[i];
              shuffledFilteredBusinesses[i] = shuffledFilteredBusinesses[rand];
              shuffledFilteredBusinesses[rand] = old;
            }
          this.setState({
            businesses: shuffledFilteredBusinesses
          });
        }
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

        // update img urls for all businesses
        try {
          var newURLs = await Promise.all(shuffledFilteredBusinesses.map(async(item) => {
            if (item?.imgPath) {
              return await Storage.get(item?.imgPath,
                { level: 'public' }
              );
            }
            return null;
        }))}
        catch (error){
          console.log(error);
        }

        // console.log(newURLs);
  
        var searchList = shuffledFilteredBusinesses.map((item, index) =>
          item.approved &&
            <Link to={{pathname: `/search/${item?.id}`, state: {business: item}}} className='SearchItem' key={index}>
                <div className='SearchItemWrapper'>
                    <div className='SearchItemHeader'>
                        <h2>{item?.businessName}</h2>
                        {item?.initiatives.map((init, index) => 
                          Object.keys(iconDict).includes(init) && 
                          <img className={iconDict[init]?.id} title={init} src={iconDict[init]?.img} key={index}/>
                        )}
                    </div>

                    <div className='SearchItemTags'>
                        {this.isOpen(item?.schedule) ? <OpenTag /> : <ClosedTag />}
                        <PriceTag price={item?.priceRange}/>
                    </div>
                </div>
                <img className='SearchItemImg' src={newURLs[index] ? newURLs[index] : placeholderImg} />
            </Link>
        );
        
        this.setState({
            searchList: searchList,
            loading: false
        });
      }

      async componentDidMount() {
        const { location } = this.props;
        console.log(location?.state?.initialFilter);
        console.log(location?.state?.initialSearch);
        var initialFilter = location?.state?.initialFilter;
        var initialSearch = location?.state?.initialSearch;
        await this.getBusinessData();
        this.filterChange(null, initialFilter);
        this.searchChange(null, initialSearch);
        if (initialFilter || initialSearch) {
          this.generateSearchList();
        }
        else {
          this.generateSearchList(true);
        }
      }

      componentDidUpdate(prevProps, prevState) {
        const { search, filterInitiative, filterPrice, filterOpen, sort } = this.state;
        var updateCondition = (prevState.search !== search
          || prevState.filterInitiative !== filterInitiative
          || prevState.filterPrice !== filterPrice
          || prevState.filterOpen !== filterOpen
          // || prevState.sort !== sort
        );

        if (updateCondition) {
          this.generateSearchList();
        }
      }

      render(){
        const { location } = this.props;
        const { 
          searchList, 
          loading, 
          businesses, 
          filteredBusinesses, 
          filterInitiative,
          filterPrice,
          filterOpen, 
          sort } = this.state;
        console.log(businesses);
        console.log(filterInitiative);
        return (
            <div className="search">
                <Nav />
                <h1 className="searchHeader">Find Local Businesses</h1>
                {location?.pathname == '/search' && <input type="text" id="searchbar2" placeholder="&#xF002; Search businesses near you" value={this.state.search} onChange={this.searchChange}/>}    
                
                <Switch>
                  <Route exact path="/search">
                    <SearchItems 
                      searchList={searchList} 
                      loading={loading} 
                      filteredBusinesses={filteredBusinesses} 
                      doFilter={(e) => this.filterChange(e)} 
                      filterInitiative={filterInitiative}
                      filterPrice={filterPrice}
                      filterOpen={filterOpen} 
                      sort={sort}
                      doSort={(e) => this.sortChange(e)}
                    />       
                  </Route>
                  <Route path={`/search/:businessId`} component={BusinessItem} />               
                </Switch>                

                <Recommendation />
                <ReadStories />
                <Footer />
            </div>
        )
      }

}

export default Search