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

        this.state = {
          businesses: [],
          filteredBusinesses: [],
          searchList: [],
          search: "",
          currentInitFilters: [],
          currentPriceFilters: [],
          currentScheduleFilter: [],
          sort: '',
          loading: false,
          startMarker: 0,
          paginatedBusinesses: []
        }
      }

      updateMarker = (action) => {
        const { startMarker } = this.state;
        switch(action) {
          case "next":
            this.setState({startMarker: startMarker + 10});
            break;
          case "previous":
            this.setState({startMarker: startMarker - 10});
            break;
          default:
            break;
        }
      }

      filterChange(e, initialFilters, initialSearch, isSearch) {
        const { businesses, filteredBusinesses, search, currentInitFilters, currentPriceFilters, currentScheduleFilter } = this.state;
        this.setState({startMarker: 0});
        var setInitFilters = currentInitFilters.slice();
        var setPriceFilters = currentPriceFilters.slice();
        var setScheduleFilter = currentScheduleFilter.slice();
        var setSearch = search.slice();
        // console.log(setFilters);
        // console.log(initialFilter);
        var filterTypes = {
          'Sustainable': {
            category: 'initiatives',
            value: [
              'Sustainability', 
              'Recycling', 
              'Waste Reduction',
              'Renewable Energy Sources',
              'LEED Certified',
              'Sustainable Products',
              'Vegan Friendly',
              'Vegetarian Friendly',
              'Vegan Products',
              'Vintage'
            ]
          },
          'Supply Chain': {
            category: 'initiatives',
            value: [
              'Ethical Supply Chain',
              'Handmade',
              'Animal Cruelty Free',
              'Locally Sourced'
            ]
          },
          'Diversity Focused': {
            category: 'initiatives',
            value: [
              'Diversity Initiatives',
              'Family Owned',
              'Female Owned',
              'Minority Owned',
              'Black Owned',
              'Wheelchair Friendly'
            ]
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
          'Open Now': {
            category: 'schedule'
          }
        };
        
        if (initialFilters) {
          setInitFilters = initialFilters.slice();
        }
        if (initialSearch) {
          setSearch = initialSearch.slice();
        }

        if (e && !isSearch) {
          // filtered = businesses.filter((item) => {
            if (filterTypes[e.target.value]?.category == 'initiatives') {
              setInitFilters.includes(e.target.value) ?
                setInitFilters.splice(setInitFilters.indexOf(e.target.value), 1) :
                setInitFilters.push(e.target.value);
            }
            if (filterTypes[e.target.value]?.category == 'priceRange') {
              setPriceFilters.includes(e.target.value) ?
                setPriceFilters.splice(setPriceFilters.indexOf(e.target.value), 1) :
                setPriceFilters.push(e.target.value);
            }
            if (filterTypes[e.target.value]?.category == 'schedule') {
              setScheduleFilter.includes(e.target.value) ?
                setScheduleFilter.splice(setScheduleFilter.indexOf(e.target.value), 1) :
                setScheduleFilter.push(e.target.value);
            }
          }
          else if (e && isSearch) {
            setSearch = e.target.value;
          }
          console.log(businesses);
          var filtered = businesses.slice();

          filtered = filtered?.filter(item => 
            setInitFilters.length > 0 ? 
              setInitFilters?.some(fil => filterTypes[fil]?.value.some(val => item?.initiatives?.includes(val))) :
              true);
          filtered = filtered?.filter(item =>
            setPriceFilters.length > 0 ?
              setPriceFilters?.some(fil => item?.priceRange == filterTypes[fil]?.value) :
              true);
          setScheduleFilter.forEach(fil => {
            filtered = filtered?.filter(item => this.isOpen(item?.schedule));
          });
          // handle search filtering
          if (setSearch) {
            filtered = filtered?.filter(item => {
              var searchTags = item?.searchTags?.map(tag => tag.toLowerCase());
              return searchTags.some(tag => tag.includes(setSearch.toLowerCase()));
            });
          }
          
          console.log(filtered);

          this.setState({
            filteredBusinesses: filtered,
            search: setSearch,
            currentInitFilters: setInitFilters,
            currentPriceFilters: setPriceFilters,
            currentScheduleFilter: setScheduleFilter
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
        const { filteredBusinesses, startMarker } = this.state;
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
        var paginatedBusinesses = shuffledFilteredBusinesses.slice(startMarker, startMarker + 10);

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
  
        var searchList = paginatedBusinesses.map((item, index) =>
          item.approved &&
            <Link to={{pathname: `/search/${item?.id}`, state: {business: item}}} className='SearchItem' key={index}>
                <div className='SearchItemWrapper'>
                    <div className='SearchItemHeader'>
                        <h2>{item?.businessName}</h2>
                        {item?.initiatives?.map((init, index) => 
                          Object.keys(iconDict).includes(init) && 
                          <img className={iconDict[init]?.id} title={init} src={iconDict[init]?.img} key={index}/>
                        )}
                    </div>
                    {item?.businessSubHeading && <h3>{item?.businessSubHeading}</h3>}
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
            loading: false,
            paginatedBusinesses: paginatedBusinesses
        });
      }

      async componentDidMount() {
        const { location } = this.props;
        console.log(location?.state?.initialFilters);
        console.log(location?.state?.initialSearch);
        var initialFilters = location?.state?.initialFilters;
        var initialSearch = location?.state?.initialSearch;
        await this.getBusinessData();
        this.filterChange(null, initialFilters, initialSearch);
        if (initialFilters || initialSearch) {
          this.generateSearchList();
        }
        else {
          this.generateSearchList(true);
        }
      }

      componentDidUpdate(prevProps, prevState) {
        const { search, startMarker, currentInitFilters, currentPriceFilters, currentScheduleFilter } = this.state;
        var updateCondition = (prevState.search !== search
          || prevState.currentInitFilters !== currentInitFilters
          || prevState.currentPriceFilters !== currentPriceFilters
          || prevState.currentScheduleFilter !== currentScheduleFilter
          || prevState.startMarker !== startMarker
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
          currentInitFilters,
          currentPriceFilters,
          currentScheduleFilter,
          startMarker,
          paginatedBusinesses,
          sort } = this.state;
        console.log(businesses);
        return (
            <div className="search">
                <Nav />
                <h1 className="searchHeader">Find Local Businesses</h1>
                {location?.pathname == '/search' && <input type="text" id="searchbar2" placeholder="&#xF002; Search businesses near you" value={this.state.search} onChange={(e) => this.filterChange(e, null, null, true)}/>}    
                
                <Switch>
                  <Route exact path="/search">
                    <SearchItems
                      totalBusinesses={filteredBusinesses.length}
                      updateMarker={this.updateMarker}
                      startMarker={startMarker}
                      searchList={searchList} 
                      loading={loading} 
                      filteredBusinesses={paginatedBusinesses} 
                      doFilter={(e) => this.filterChange(e)} 
                      filterInitiative={currentInitFilters}
                      filterPrice={currentPriceFilters}
                      filterOpen={currentScheduleFilter}
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