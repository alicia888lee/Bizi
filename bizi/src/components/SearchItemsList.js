import React, { Component } from 'react'
import { Link } from "react-router-dom"
import environmentImg from '../images/environment.png';
import heartImg from '../images/heart_hand.png';
import communityImg from '../images/community.png';
import testImg from '../images/pexels-mariana-kurnyk-1775043.jpg';
import * as queries from '../graphql/queries';
import { API } from 'aws-amplify';

class SearchItemsList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { searchList, doFilter, filter, sort, doSort } = this.props;

        return (
            <div>
                <div className="search-selects" id='filter-selects'>
                    <select onChange={(e) => doFilter(e)}>
                        <option selected={filter == 'Filter'}>Filter</option>  
                        <option selected={filter == 'Open Now'}>Open Now</option>
                        <option selected={filter == 'Sustainable'}>Sustainable</option>
                        <option selected={filter == 'Supply Chain'}>Supply Chain</option>

                        <option selected={filter == 'Diversity Focused'}>Diversity Focused</option>
                        <option selected={filter == 'Shopping'}>Shopping</option>
                        <option selected={filter == 'Food'}>Food</option>
                        <option selected={filter == 'Services'}>Services</option>
                        <option selected={filter == '$'}>$</option>
                        <option selected={filter == '$$'}>$$</option>
                        <option selected={filter == '$$$'}>$$$</option>
                        <option selected={filter == '$$$$'}>$$$$</option>
                    </select>
                    <select onChange={(e) => doSort(e)}>
                        <option selected disabled style={{display: 'none'}}>Sort By</option>  
                        <option selected={sort == 'Lowest Price'}>Lowest Price</option>
                        <option selected={sort == 'Highest Price'}>Highest Price</option>
                    </select>
                </div>
                <div className="SearchItemsList">
                    {searchList}
                </div>
            </div>
        )
    }
}

export function OpenTag() {
    return(
        <div className="OpenNow">
            <p>Open Now</p>
        </div>
    )
}

export function ClosedTag() {
    return(
        <div className='ClosedNow'>
            <p>Closed Now</p>
        </div>
    )
}

export function PriceTag({price, id, selectPrice}) {
    return (
        <div className="price" id={id} onClick={selectPrice}>
            <p>{Array(price + 1).join('$')}</p>
        </div>
    )
}

export default SearchItemsList