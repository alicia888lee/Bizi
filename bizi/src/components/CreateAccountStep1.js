import React, { Component } from 'react'
import Nav from './Nav'

class Step1 extends Component {
    render() {
        const { 
            next, 
            selectCustomer,
            selectBusiness,
            customerSelected, 
            businessSelected } = this.props;
            console.log('Step1 customer selected = ' + customerSelected + 'and business selected = ' + businessSelected);
        return (
            <div className='createAccountStep1'>
                <Nav light={false} />
                <div className='createAccountHeader'>
                    <h1>Start Making Change!</h1>
                    <p><b>Are you a...</b></p>
                </div>
                <div className='userTypeGrid'>
                    <div onClick={selectCustomer} className='userCol' id={customerSelected && 'userTypeHighlighted'}>
                        <p>Customer</p>
                    </div>
                    <div onClick={selectBusiness} className='userCol' id={businessSelected && 'userTypeHighlighted'}>
                        <p>Business</p>
                    </div>
                </div>
                <div className='createNextButton'>
                    <button onClick={next}>Next</button>
                </div>
                <div className="circles">
                    <div className="circleCreateAcct blueCircle"></div>
                    <div className="circleCreateAcct"></div>
                    <div className="circleCreateAcct"></div>
                </div>
                <div className='termsAgreement'>
                    <a className="smallText" href="#">Terms of Agreement</a>   
                </div>
            </div>
        )
    }
}

export default Step1;