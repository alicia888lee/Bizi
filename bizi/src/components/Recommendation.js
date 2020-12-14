import React from 'react'
import environmentImg from '../images/environment.png';
import heartImg from '../images/heart_hand.png';
import communityImg from '../images/community.png';

function Reccomendation(){
    return(
        <div className="recs">
            <h1>Recommended for you</h1>
            <div className="recItems">
                <div className="recItem">
                    <h1>First Antiques</h1>
                    <div className="recImgs">
                        <img src = {communityImg} />
                        <img src = {heartImg} />
                    </div>
                </div>

                <div className="recItem">
                    <h1>First Antiques</h1>
                    <div className="recImgs">
                        <img src = {communityImg} />
                        <img src = {heartImg} />
                    </div>
                </div>

                <div className="recItem">
                    <h1>First Antiques</h1>
                    <div className="recImgs">
                        <img src = {communityImg} />
                        <img src = {heartImg} />
                    </div>
                </div>

                <div className="recItem">
                    <h1>First Antiques</h1>
                    <div className="recImgs">
                        <img src = {communityImg} />
                        <img src = {heartImg} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reccomendation