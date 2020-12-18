import React from 'react'
import Map from './Map'
import SearchItemsList from './SearchItemsList'

function SearchItems(props){
  console.log(props.searchList);
    return(
      <div className="description">
        <div className="map">
          <Map height={100}/>
        </div>
  
        <div className="description-text">          
          <SearchItemsList searchList={props.searchList}/>                                                          
        </div>      
      </div>
    )
  }

  export default SearchItems