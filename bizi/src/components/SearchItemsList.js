import React from 'react'
import environmentImg from '../images/environment.png';
import heartImg from '../images/heart_hand.png';
import communityImg from '../images/community.png';
import testImg from '../images/pexels-mariana-kurnyk-1775043.jpg';

function SearchItemsList() {
    return (
        <div className="SearchItemsList">
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