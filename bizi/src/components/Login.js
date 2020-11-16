import React from 'react'
import Nav from './Nav'
import { Link } from 'react-router-dom'
import { Auth } from 'aws-amplify'

function Login(){
    return (
        <div className="login">
            <Nav light={false} />
            <div className="loginHeader">
                <h1>Welcome Back!</h1>
                <p>New to Bizi? <Link to="/create">Create an Account</Link></p>
            </div>

            <div className="loginBody">
                <form>
                    <div className="inputGroup">                    
                        <label className="loginLabel" for="email">E-mail</label>
                        <input type="text" name="email"/>
                    </div>
                    
                    <div className="inputGroup">                    
                        <label className="loginLabel" for="password">Password</label>
                        <input type="password" name="password"/>            
                    </div>        

                    <div className="checkboxGroup">
                        <label for="rememberMe">Remember Me</label>
                        <input type="checkbox" name="rememberMe"/>                        
                        
                    </div>

                    <button className="loginBtn">Log In</button>
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
    )
}

export default Login