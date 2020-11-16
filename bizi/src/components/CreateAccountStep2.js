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
                <div className='loginBody'>
                    <form>
                        <div className='inputGroup'>
                            <label className='createUserLabel' for='name'>What's your name?</label>
                            <input type='text' name='name'/>
                        </div>
                        <div className='inputGroup'>
                            <label className='createUserLabel' for='email'>What's your e-mail?</label>
                            <input type='text' name='email'/>
                        </div>
                        <div className='inputGroup'>
                            <label className='createUserLabel' for='password'>Password</label>
                            <input type='password' name='password'/>
                        </div>
                        <div className='inputGroup'>
                            <label className='createUserLabel' for='confirmPassword'>Confirm your password?</label>
                            <input type='password' name='confirmPassword'/>
                        </div>
                    </form>
                </div>




                <div className='createNextButton'>
                    <button
                    onClick = {next}>Create</button>
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