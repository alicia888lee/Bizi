import React, { Component } from 'react'
import Nav from './Nav'

class VerifyStep extends Component {
    
    render() {
        const { 
            verify,
            invalidCode,
            onCodeInputChange
        } = this.props;
        return (
            <div>
                <Nav light={false} />
                <div className='createAccountHeader'>
                    <h1>Please Verify Your Email</h1>
                </div>
                <div className='loginBody'>
                    <form>
                        <div className='inputGroup'>
                            <label for='email'>A verification code was sent to your email</label>
                            <input type='text' name='name' onInput={onCodeInputChange}/>
                            {invalidCode && <p>Invalid code, please try again</p>}
                        </div>
                    </form>
                </div>




                <div className='verifyEmailButton'>
                    <button
                    onClick = {verify}>Verify</button>
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

export default VerifyStep;