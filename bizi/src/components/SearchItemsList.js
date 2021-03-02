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

    generateFilters = (handleClick, filterInitiative, filterPrice, filterOpen) => {
        var col1 = [
            "Sustainable",
            "Supply Chain",
            "Diversity Focused"
        ];
        var col2 = [
            "$",
            "$$",
            "$$$",
            "$$$$"
        ];
        
        var checklist = (
            <>
                <div className='search-filters-checklist'>
                    <div id='filter-col'>
                        <p>Initiatives</p>
                        {col1.map(p => (
                            <div id='filter-checkbox'>
                                <input id={p} type='checkbox' checked={filterInitiative?.includes(p)} value={p} onChange={handleClick}/>
                                <label for={p}>{p}</label>
                            </div>
                        ))}
                    </div>
                    <div id='filter-col'>
                        <p>Price</p>
                        {col2.map(p => (
                            <div id='filter-checkbox'>
                                <input id={p} type='checkbox' checked={filterPrice?.includes(p)} value={p} onChange={handleClick}/>
                                <label for={p}>{p}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div id='open-now-checkbox'>
                    <input id='open-now' type='checkbox' checked={filterOpen?.includes("Open Now")} value='Open Now' onChange={handleClick}/>
                    <label for='open-now'>Open Now</label>
                </div>
            </>
        );
        return checklist;
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

        return (
            <div>
                {this.generateFilters(doFilter, filterInitiative, filterPrice, filterOpen)}
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