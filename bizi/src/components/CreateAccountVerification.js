import React, { Component } from 'react'
import Nav from './Nav'
import Loader from 'react-loader-spinner'

class VerifyStep extends Component {
    render() {
        const { 
            verify,
            invalidCode,
            onCodeInputChange,
            errorMessage,
            loading
        } = this.props;
        return (
            <div>
                <Nav light={false} />
                <div className="login">
                <div className='createAccountHeader'>
                    <h1>Please Verify Your Email</h1>
                </div>
                <div className='loginBody'>
                    <form>
                        <div className='inputGroup'>
                            <label for='email'>A verification code was sent to your email</label>
                            <input type='text' name='name' onInput={onCodeInputChange} placeholder="Verification Code"/>
                            {invalidCode && <p>{errorMessage}</p>}
                        </div>
                    </form>
                </div>
                {loading && <Loader type='TailSpin' color='#385FDC' height={40}/>}
                <div className='verifyEmailButton'>
                    <button onClick = {verify}>Verify</button>
                </div>
                <div className="circles">
                    <div className="circleCreateAcct"></div>
                    <div className="circleCreateAcct blueCircle"></div>
                    <div className="circleCreateAcct"></div>
                </div>
                <div className='termsAgreement'>
                <a className="smallText" href="https://www.termsfeed.com/live/cce55d58-2f48-4d9c-ab31-478dafcdca99" target='_blank'>Privacy Policy</a>
                </div>
            </div>
            </div>
        )
    }
}

export default VerifyStep;