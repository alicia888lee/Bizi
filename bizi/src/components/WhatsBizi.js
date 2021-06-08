import React from 'react'
import logo from '../images/bigLogo.png';

function WhatsBizi() {
    return (
        <div className="whatsBizi">
            <img id="bigLogo" src ={logo} />
            <div>
                <h1>What's <span className="blue">Bizi</span>?</h1>
                <p className="p1">Bizi helps you, the socially conscious consumer, 
                    <span className="blue"> find the right small business alternative to big box retail</span>.</p>
                <p className="p2">With specific social impact certifications, you can 
                    <span className="blue"> easily find affordable shops and e-retailers </span> 
                    that align with your values. Just search for a product or industry, filter by the causes most important for you, and leave a review for the business when you're done!</p>
            </div>
        </div>
    )
}

export default WhatsBizi