import React, { Component } from 'react'
import Nav from './Nav'
import cartImg from '../images/shopping_cart.png'
import businessImg from '../images/business.png'

var width = window.innerWidth;

class Step1 extends Component {
    render() {
        const { 
            next, 
            selectCustomer,
            selectBusiness,
            customerSelected, 
            businessSelected,
            invalidSelection
        } = this.props;

        if (width > 768) {
        return (
            <div>
                <Nav light={false} />
                <div className='createAccountHeader'>
                    <h1>Start Making Change!</h1>
                    <p><b>Are you a...</b></p>
                </div>
                <div className='userTypeGrid'>
                    <div onClick={selectCustomer} className='userCol' id={customerSelected && 'userTypePreferenceHighlighted'}>
                        <img src={cartImg} />
                        <p>Customer</p>
                    </div>
                    <div onClick={selectBusiness} className='userCol' id={businessSelected && 'userTypePreferenceHighlighted'}>
                        <img src={businessImg} />
                        <p>Business</p>
                    </div>
                </div>
                <div className='step1Invalid'>
                    {invalidSelection && <p>You must select one above</p>}
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
                    <a className="smallText" href="https://www.termsfeed.com/live/cce55d58-2f48-4d9c-ab31-478dafcdca99" target='_blank'>Privacy Policy</a>   
                </div>
            </div>
        )
        }

    else if (width <= 768) {
        return (
            <div>
                <Nav light={false} />
                <div className="create">
                <div className='createAccountHeader'>
                    <h1 className="makeChange">Start Making Change!</h1>
                    <p><b>Are you a...</b></p>
                </div>
            <div className='userTypeGrid'>
                    <div onClick={selectCustomer} className='userCol' id={customerSelected && 'userTypePreferenceHighlighted'}>
                        <img src={cartImg} />
                        <p>Customer</p>
                    </div>
                    <div onClick={selectBusiness} className='userCol' id={businessSelected && 'userTypePreferenceHighlighted'}>
                        <img src={businessImg} />
                        <p>Business</p>
                    </div>
                </div>
            <div className='step1Invalid'>
                    {invalidSelection && <p>You must select one above</p>}
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
                    <a className="smallText" href="https://www.termsfeed.com/live/cce55d58-2f48-4d9c-ab31-478dafcdca99" target='_blank'>Privacy Policy</a>   
            </div>
        </div>
        </div>
        );
    }
    }
}

export default Step1;