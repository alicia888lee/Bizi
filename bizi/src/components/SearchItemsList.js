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
        const { 
            searchList, 
            doFilter, 
            filterInitiative,
            filterPrice,
            filterOpen, 
            sort, 
            doSort } = this.props;
            console.log(filterInitiative);
            console.log(filterPrice);

        return (
            <div>
                <div className="search-selects" id='filter-selects'>
                    <select onChange={(e) => doFilter(e)} title='Filter By All Initiatives'>
                        <option selected={filterInitiative == 'Filter By All Initiatives'}>Filter By All Initiatives</option>  
                        <option selected={filterInitiative == 'Sustainable'}>Sustainable</option>
                        <option selected={filterInitiative == 'Supply Chain'}>Supply Chain</option>
                        <option selected={filterInitiative == 'Diversity Focused'}>Diversity Focused</option>
                        <option selected={filterInitiative == 'Shopping'}>Shopping</option>
                        <option selected={filterInitiative == 'Food'}>Food</option>
                        <option selected={filterInitiative == 'Services'}>Services</option>
                    </select>
                    <select onChange={(e) => doFilter(e)} title='Filter By All Hours'>
                        <option selected={filterOpen == 'Filter By All Hours'}>Filter By All Hours</option>  
                        <option selected={filterOpen == 'Open Now'}>Open Now</option>
                    </select>
                    <select onChange={(e) => doFilter(e)} title='Filter By All Prices'>
                        <option selected={filterPrice == 'Filter By All Prices'}>Filter By All Prices</option>  
                        <option selected={filterPrice == '$'}>$</option>
                        <option selected={filterPrice == '$$'}>$$</option>
                        <option selected={filterPrice == '$$$'}>$$$</option>
                        <option selected={filterPrice == '$$$$'}>$$$$</option>
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