import React, { Component } from 'react'
import Nav from './Nav'
import { Link } from 'react-router-dom'
import { Auth } from 'aws-amplify'

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEmail: '',
            userPassword: ''
        }
    }

    setUserEmail = (e) => {
        this.setState({
            userEmail: e.target.value
        });
    }

    setUserPassword = (e) => {
        this.setState({
            userPassword: e.target.value
        });
    }

    doLogin = async(e) => {
        const { userEmail, userPassword } = this.state;
        console.log('logging in');
        e.preventDefault();
        const username = userEmail;
        const password = userPassword;
        try {
            const user = await Auth.signIn(username, password);
        }
        catch (error) {
            console.log('error signing in', error);
        }

    }

    render() {
        return (
            <div className="login">
                <Nav light={false} />
                <div className="loginHeader">
                    <h1>Welcome Back!</h1>
                    <p>New to Bizi? <Link to="/create">Create an Account</Link></p>
                </div>

                <div className="loginBody">
                    <form onSubmit={this.doLogin}>
                        <div className="inputGroup">                    
                            <label className="loginLabel" for="email">E-mail</label>
                            <input type="text" name="email" onInput={this.setUserEmail}/>
                        </div>
                        
                        <div className="inputGroup">                    
                            <label className="loginLabel" for="password">Password</label>
                            <input type="password" name="password" onInput={this.setUserPassword}/>            
                        </div>        

                        <div className="checkboxGroup">
                            <label for="rememberMe">Remember Me</label>
                            <input type="checkbox" name="rememberMe"/>                        
                            
                        </div>

                        <div className='inputGroup'>
                            <input className='loginBtn' type='submit' value='Log In'/>
                        </div>

                        {/* <button className="loginBtn" onClick={this.doLogin}>Log In</button> */}
                        <a className="smallText" href="#">Forgot your password?</a>
                    </form>
                    <div className="socialLogin">
                        <button className="facebook">Log in with Facebook</button>
                        <button className="google">Log in with Google</button>
                    </div>
                    
                </div>
                <div className='termsAgreement'>
                    <a className="smallText" href="#">Terms of Agreement</a>   
                </div>                     
            </div>
        );
    }
}

export default Login