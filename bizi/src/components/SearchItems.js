import React from 'react'
import Map from './Map'
import SearchItemsList from './SearchItemsList'

function SearchItems(){
    return(
      <div className="description">
        <div className="map">
          <Map />
        </div>
  
        <div className="description-text">          
          <SearchItemsList />                                                          
        </div>      
      </div>
    )
  }

  export default SearchItems