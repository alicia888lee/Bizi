import React, { Component } from 'react'
import Nav from './Nav'

class Step2 extends Component {
    
    render() {
        const { 
            next, 
            onNameChange, 
            onEmailChange, 
            onPasswordChange, 
            onConfirmPasswordChange,
            passwordsMatch,
            passwordLengthGood,
            passwordUppercase,
            passwordLowercase,
            passwordSpecialChar,
            passwordNumbers,
            validEmail,
            validName,
            duplicateEmail,
            duplicateEmailMessage
        } = this.props;

        return (
            <div>
                <Nav light={false} />
                <div className='createAccountHeader'>
                    <h1>Start Making Change!</h1>
                </div>
                <div className='loginBody'>
                    <form>
                        <div className='inputGroup'>
                            <label className='createUserLabel' for='name'>What's your name?</label>
                            <input id={!validName && 'invalidInput'} type='text' name='name' onBlur={onNameChange}/>
                            {!validName && <p>You must enter a name</p>}

                        </div>
                        <div className='inputGroup'>
                            <label className='createUserLabel' for='email'>What's your e-mail?</label>
                            <input id={(!validEmail || duplicateEmail) && 'invalidInput'} type='text' name='email' onBlur={onEmailChange}/>
                            {!validEmail && <p>Must be a valid email address</p>}
                            {duplicateEmail && <p>{duplicateEmailMessage}</p>}
                        </div>
                        <div className='inputGroup'>
                            <label className='createUserLabel' for='password'>Password</label>
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
                        <div className='inputGroup'>
                            <label className='createUserLabel' for='confirmPassword'>Confirm your password</label>
                            <input type='password' id={!passwordsMatch && 'invalidInput'} name='confirmPassword' onBlur={onConfirmPasswordChange}/>
                            {!passwordsMatch && <p>Passwords must match!</p>}
                        </div>
                    </form>
                </div>

                <div className='createNextButton'>
                    <button onClick = {next}>Create</button>
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