import React from 'react'
import { Link } from "react-router-dom"
import environmentImg from '../images/environment.png';
import heartImg from '../images/heart_hand.png';
import communityImg from '../images/community.png';
import testImg from '../images/pexels-mariana-kurnyk-1775043.jpg';

function SearchItemsList() {
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
                <Link to ="/search/test" className="SearchItem">
                    <div className="SerachItemWrapper">
                        <div className="SearchItemHeader">
                            <h2>First Antique</h2>
                            <img className="searchHeart" src = {heartImg} />
                            <img className="searchEnvironment" src = {environmentImg} />
                        </div>

                        <div className="SearchItemTags">
                            <OpenTag />
                            <PriceTag />                        
                        </div>
                    </div>
                    <img className="SearchItemImg" src = {testImg} />
                </Link>
                <div className="SearchItem">
                    <div className="SerachItemWrapper">
                        <div className="SearchItemHeader">
                            <h2>First Antique</h2>
                            <img className="searchHeart" src = {heartImg} />
                            <img className="searchEnvironment" src = {environmentImg} />
                        </div>

                        <div className="SearchItemTags">
                            <OpenTag />
                            <PriceTag />                        
                        </div>
                    </div>
                    <img className="SearchItemImg" src = {testImg} />
                </div>
                <div className="SearchItem">
                    <div className="SerachItemWrapper">
                        <div className="SearchItemHeader">
                            <h2>First Antique</h2>
                            <img className="searchHeart" src = {heartImg} />
                            <img className="searchEnvironment" src = {environmentImg} />
                        </div>

                        <div className="SearchItemTags">
                            <OpenTag />
                            <PriceTag />                        
                        </div>
                    </div>
                    <img className="SearchItemImg" src = {testImg} />
                </div>
                <div className="SearchItem">
                    <div className="SerachItemWrapper">
                        <div className="SearchItemHeader">
                            <h2>First Antique</h2>
                            <img className="searchHeart" src = {heartImg} />
                            <img className="searchEnvironment" src = {environmentImg} />
                        </div>

                        <div className="SearchItemTags">                        
                            <PriceTag />                        
                        </div>
                    </div>
                    <img className="SearchItemImg" src = {testImg} />
                </div>
            </div>
        </div>
    )
}

function OpenTag() {
    return(
        <div className="OpenNow">
            <p>Open Now</p>
        </div>
    )
}

function PriceTag() {
    return (
        <div className="price">
            <p>$</p>
        </div>
    )
}

export default SearchItemsList