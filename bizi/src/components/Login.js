import React, { Component } from 'react'
import Nav from './Nav'
import { Link, withRouter } from 'react-router-dom'
import { Auth, Hub } from 'aws-amplify'
import Loader from 'react-loader-spinner'


var IS_MOBILE = /Android|webOS|iPhone|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);
var width = window.innerWidth;

class Login extends Component {
    
    constructor(props) {
        super(props)

        this.state = {
            userEmail: '',
            userPassword: '',
            errorMessage: '',
            loggingIn: false
        };
    }

    getCurrentUser = async() => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            return user;
        }
        catch (error) {
            console.log('error checking auth', error);
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

    setErrorMessage = (msg) => {
        this.setState({
            errorMessage: msg
        });
    }

    doFacebookLogin = async() => {
        try {
            const user = await Auth.federatedSignIn({
                provider: 'Facebook'
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    doGoogleLogin = async() => {
        try {
            const user = await Auth.federatedSignIn({
                provider: 'Google'
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    doLogin = async(e) => {
        const { userEmail, userPassword } = this.state;
        console.log('logging in');
        e.preventDefault();
        const username = userEmail;
        const password = userPassword;
        this.setState({
            loggingIn: true
        });
        try {
            const user = await Auth.signIn(username, password);
            this.props.history.push('/account');
        }
        catch (error) {
            console.log('error signing in', error);
            let message = 'User does not exist.';
            this.setState({
                loggingIn: false
            });
            return message;
        }
    }

    async componentDidMount() {
        const currentUser = await this.getCurrentUser();
        currentUser && this.props.history.push('/account');
    }


    render() {
        const {
            errorMessage,
            loggingIn
        } = this.state;

        if (width > 768) {
            return (
                <div className="login">
                    {width < 768 && <h1>get out</h1>}
                    <Nav light={false} />
                    <div className="loginHeader">
                        <h1>Welcome Back!</h1>
                        <p>New to Bizi? <Link to="/create">Create an Account</Link></p>
                    </div>

                    <div className="loginBody">
                        <form onSubmit={async(e) => {
                            const error = await this.doLogin(e);
                            console.log(error);
                            if (error) {
                                this.setErrorMessage(error);
                            }
                        }}>
                            <div className="inputGroup">                    
                                <label className="loginLabel" for="email">E-mail</label>
                                <input className="loginInput" type="text" name="email" onInput={this.setUserEmail}/>
                            </div>
                            
                            
                            <div className="inputGroup">                    
                                <label className="loginLabel" for="password">Password</label>
                                <input type="password" name="password" onInput={this.setUserPassword}/>
                                <p>{errorMessage}</p>         
                            </div>        

                            {/* <div className="checkboxGroup">
                                <label for="rememberMe">Remember Me</label>
                                <input type="checkbox" name="rememberMe"/>                            
                            </div> */}

                            <div className='inputGroup'>
                                <input className='loginBtn' type='submit' value='Log In'/>
                            </div>
                            {
                                loggingIn && <Loader
                                    type="TailSpin"
                                    color="#385FDC"
                                    height={40}
                                />
                            }

                            {/* <button className="loginBtn" onClick={() => {this.doLogin();}}>Log In</button> */}
                            <Link className="smallText" to="forgot-password">Forgot your password?</Link>
                        </form>
                        <div className="socialLogin">
                            <button className="facebook" onClick={this.doFacebookLogin}>Log in with Facebook</button>
                            <button className="google" onClick={this.doGoogleLogin}>Log in with {
                                <>
                                    <span id='google-blue'>G</span>
                                    <span id='google-red'>o</span>
                                    <span id='google-yellow'>o</span>
                                    <span id='google-blue'>g</span>
                                    <span id='google-green'>l</span>
                                    <span id='google-red'>e</span>
                                </>
                            }</button>
                        </div>
                        
                    </div>
                    <div className='termsAgreement'>
                        <a className="smallText" href="https://www.termsfeed.com/live/cce55d58-2f48-4d9c-ab31-478dafcdca99" target='_blank'>Privacy Policy</a>   
                    </div>                     
                </div>
            );
        } 

        else if (width <= 768){
            return (
            <div>
                    <Nav light={false} id="lightNav"/>
                    <div className="login">
                    <div className="loginHeader">
                        <h1>Welcome Back!</h1>
                        <p className="toCreate"><font style={{color: "#385FDC"}}>New to Bizi? <Link to="/create">Create an Account</Link></font></p>
                    </div>

                    <div className="loginBody">
                        <form onSubmit={async(e) => {
                            const error = await this.doLogin(e);
                            console.log(error);
                            if (error) {
                                this.setErrorMessage(error);
                            }
                        }}>

                            <div className="socialLogin">
                                <button className="facebook" onClick={this.doFacebookLogin}>Log in with Facebook</button>
                                <button className="google" onClick={this.doGoogleLogin}>Log in with {
                                    <>
                                        <span id='google-blue'>G</span>
                                        <span id='google-red'>o</span>
                                        <span id='google-yellow'>o</span>
                                        <span id='google-blue'>g</span>
                                        <span id='google-green'>l</span>
                                        <span id='google-red'>e</span>
                                    </>
                                }</button>
                            </div>

                            <div className="horizLine">
                                <hr></hr>
                                <h3 className="midtext">OR</h3>
                                <hr></hr>
                            </div>

                            <div className="inputGroup">                    
                                <input className="loginInput" placeholder="E-mail" type="text" name="email" onInput={this.setUserEmail}/>
                            </div>

                            <div className="inputGroup">                    
                                <input type="password" placeholder="Password" name="password" onInput={this.setUserPassword}/>
                                <p>{errorMessage}</p>         
                            </div>       

                            <div className='inputGroup'>
                                <input className='loginBtn' type='submit' value='Log In'/>
                            </div>
                            {
                                loggingIn && <Loader
                                    type="TailSpin"
                                    color="#385FDC"
                                    height={40}
                                />
                            }
                            <Link className="smallText" to="forgot-password">Forgot your password?</Link>
                        </form>
                        
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

export default withRouter(Login);