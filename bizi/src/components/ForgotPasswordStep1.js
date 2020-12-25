import React, { Component } from 'react'
import Nav from './Nav'

class ForgotPasswordStep1 extends Component {
    
    render() {
        const {
            onEmailChange,
            sendCode,
            invalidEmail,
            errorMessage
        } = this.props;
        return (
            <div>
                <Nav light={false} />
                <div className='createAccountHeader'>
                    <h1>Please Enter Your Email</h1>
                </div>
                <div className='loginBody'>
                    <form>
                        <div className='inputGroup'>
                            <label for='email'>Enter your email to receive a code to reset your password</label>
                            <input type='text' name='email' onInput={onEmailChange}/>
                            {invalidEmail && <p>{errorMessage}</p>}
                        </div>
                    </form>
                </div>

                <div className='updatePasswordButton'>
                    <button onClick = {sendCode}>Send Code</button>
                </div>
                <div className='termsAgreement'>
                    <a className="smallText" href="#">Terms of Agreement</a>   
                </div>
            </div>
        )
    }
}

export default ForgotPasswordStep1;