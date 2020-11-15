import React, { Component } from 'react'
import Nav from './Nav'

class Step2 extends Component {
    render() {
        const { next } = this.props;
        return (
            <div className='createAccountStep1'>
                <Nav light={false} />
                <div className='createAccountHeader'>
                    <h1>Start Making Change!</h1>
                </div>
                <div className='createNextButton'>
                    <button onClick={next}>Create</button>
                </div>
                <div className="circles">
                    <div className="circleCreateAcct"></div>
                    <div className="circleCreateAcct blueCircle"></div>
                    <div className="circleCreateAcct"></div>
                </div>
                <div className='termsAgreement'>
                    <a className="smallText" href="#">Terms of Agreement</a>   
                </div>
            </div>
        )
    }
}

export default Step2;