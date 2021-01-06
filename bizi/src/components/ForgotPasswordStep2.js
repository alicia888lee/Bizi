import React, { Component } from 'react'
import Loader from 'react-loader-spinner';
import Nav from './Nav'

class ForgotPasswordStep2 extends Component {
    
    render() {
        const {
            updatePassword,
            onEmailChange,
            onCodeChange,
            onPasswordChange,
            validCode,
            validEmail,
            passwordLengthGood,
            passwordUppercase,
            passwordLowercase,
            passwordSpecialChar,
            passwordNumbers,
            updateError,
            updateErrorMessage,
            loading
        } = this.props;
        return (
            <div>
                <Nav light={false} />
                <div className='createAccountHeader'>
                    <h1>Create New Password</h1>
                </div>
                <div className='loginBody'>
                    <form>
                        <div className='inputGroup'>
                            <label for='email'>Re-enter your email</label>
                            <input id={!validEmail && 'invalidInput'} type='text' name='email' onBlur={onEmailChange}/>
                            {!validEmail && <p>Cannot be blank</p>}
                        </div>
                        <div className='inputGroup'>
                            <label for='code'>Enter your code</label>
                            <input id={!validCode && 'invalidInput'} type='text' name='code' onBlur={onCodeChange}/>
                            {!validCode && <p>Cannot be blank</p>}
                        </div>
                        <div className='inputGroup'>
                            <label for='password'>Enter your new password</label>
                            <input id={!(passwordLengthGood 
                                && passwordUppercase 
                                && passwordLowercase 
                                && passwordSpecialChar 
                                && passwordNumbers) && 'invalidInput'} type='password' name='password' onBlur={onPasswordChange}/>
                            {!passwordLengthGood && <p>Must be at least 8 characters long</p>}
                            {!passwordUppercase && <p>Must contain at least 1 uppercase character</p>}
                            {!passwordLowercase && <p>Must contain at least 1 lowercase character</p>}
                            {!passwordSpecialChar && <p>Must contain at least 1 special character</p>}
                            {!passwordNumbers && <p>Must contain at least 1 number</p>}
                        </div>
                    </form>
                </div>
                
                <div className='inputGroup'>
                    {updateError && <p>{updateErrorMessage}</p>}
                </div>
                <div className='updatePasswordButton'>
                    <button onClick = {updatePassword}>Update Password</button>
                </div>
                {loading && <Loader type='TailSpin' color='#385FDC' height={40} />}
                <div className='termsAgreement'>
                    <a className="smallText" href="#">Terms of Agreement</a>   
                </div>
            </div>
        )
    }
}

export default ForgotPasswordStep2;