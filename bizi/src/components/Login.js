import React from 'react'
import Nav from './Nav'

function Login(){
    return (
        <div className="login">
            <Nav light={false} />
            <div className="loginHeader">
                <h1>Welcome Back!</h1>
                <p>New to Bizi? <a href="#">Create an Account</a></p>
            </div>

            <div className="loginBody">
                <form>
                    <div className="inputGroup">                    
                        <label className="loginLabel" for="email">E-mail</label>
                        <input type="text" name="email"/>
                    </div>
                    
                    <div className="inputGroup">                    
                        <label className="loginLabel" for="password">Password</label>
                        <input type="text" name="password"/>            
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
            
            <a className="smallText" href="#">Terms of Agreement</a>   
                     
        </div>
    )
}

export default Login