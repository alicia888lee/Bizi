import React, { Component } from 'react'
import Nav from './Nav'

class ForgotPasswordStep3 extends Component {
    
    render() {
        const {
            goToLogin
        } = this.props;
        return (
            <div>
                <Nav light={false} />
                <div className='createAccountHeader'>
                    <h1>Password Updated Successfully</h1>
                </div>

                <div className='updatePasswordButton'>
                    <button onClick = {goToLogin}>Back to Login</button>
                </div>
                <div className='termsAgreement'>
                    <a className="smallText" href="#">Terms of Agreement</a>   
                </div>
            </div>
        )
    }
}

export default ForgotPasswordStep3;