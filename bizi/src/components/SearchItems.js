import React from 'react'
import Map from './Map'
import SearchItemsList from './SearchItemsList'
import Loader from 'react-loader-spinner'

function SearchItems(props){
  const { searchList, loading, filteredBusinesses, doFilter, filter, doSort, sort } = props;

  return(
      <>
        {searchList.length > 0 &&
          <div className="description">
            <div className="map">
              <Map height={100} filteredBusinesses={filteredBusinesses}/>
            </div>
      
            <div className="description-text">          
              <SearchItemsList searchList={searchList} doFilter={doFilter} filter={filter} doSort={doSort} sort={sort}/>                                                          
            </div>      
          </div>
        }
        {loading && 
          <Loader type="TailSpin" color="#385FDC" height={40} />
        }
        {searchList.length == 0 && !loading &&
        <>
          <h1>No results were matched!</h1>
          <div className="description">
            <div className="map">
              <Map height={100} filteredBusinesses={filteredBusinesses}/>
            </div>
    
            <div className="description-text">          
              <SearchItemsList searchList={searchList} doFilter={doFilter} filter={filter} doSort={doSort} sort={sort} />                                                          
            </div>      
          </div>
        </>
        }
      </>
    )
  }

  export default SearchItems