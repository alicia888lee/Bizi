import React from 'react'
import Map from './Map'
import SearchItemsList from './SearchItemsList'

import { FiTwitter, FiThumbsUp } from "react-icons/fi";



function SearchItems(){
    return(
      <div className="description">
        <div className="map">
          <Map />
        </div>
  
        <div className="description-text">
          <div className="search-selects">
            <select>
              <option value="">Filter</option>  
              <option value="parrot">Parrot</option>
              <option value="spider">Spider</option>
              <option value="goldfish">Goldfish</option>
            </select>
            <select>
              <option value="">Sort By</option>  
              <option value="parrot">Parrot</option>
              <option value="spider">Spider</option>
              <option value="goldfish">Goldfish</option>
            </select>
          </div>

          <SearchItemsList />                                                          
        </div>      
      </div>
    )
  }

  export default SearchItems