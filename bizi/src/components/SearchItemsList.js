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
        const { searchList } = this.props;

        return (
            <div>
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