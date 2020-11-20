import React, { Component } from 'react'
import Step1 from './CreateAccountStep1'
import Step2 from './CreateAccountStep2'
import { Auth } from 'aws-amplify'

class CreateAccount extends Component {
    constructor(props) {
        super(props)

        this.goToSecondStep = this.goToSecondStep.bind(this)
        this.goToThirdStep = this.goToThirdStep.bind(this)
        this.setUserCustomer = this.setUserCustomer.bind(this)
        this.setUserBusiness = this.setUserBusiness.bind(this)
        this.makeAccount = this.makeAccount.bind(this)
        this.setUserEmail = this.setUserEmail.bind(this)
        this.setUserPassword = this.setUserPassword.bind(this)
        this.setUserName = this.setUserName.bind(this)
        this.setConfirmPassword = this.setConfirmPassword.bind(this)
        this.doCreate = this.doCreate.bind(this)

        this.state = {
            firstStep: true,
            secondStep: false,
            thirdStep: false,
            typeCustomerSelected: false,
            typeBusinessSelected: false,
            invalidSelection: false,
            userEmail: '',
            userPassword: '',
            userName: '',
            confirmPassword: '',
            passwordsMatch: true,
            passwordLengthGood: true,
            passwordUppercase: true,
            passwordSpecialChar: true,
            passwordNumbers: true,
            passwordLowercase: true,
            validEmail: true,
            validName: true
        }
    }


    makeAccount = async() => {
        const { userEmail, 
            userPassword, 
            userName, 
            passwordsMatch, 
            passwordLengthGood, 
            passwordUppercase,
            passwordSpecialChar,
            passwordNumbers,
            passwordLowercase,
            validEmail,
            validName
        } = this.state;
        const username = userEmail;
        const password = userPassword;
        const name = userName;
        const credentialsValid = passwordsMatch 
        && passwordLowercase 
        && passwordUppercase 
        && passwordSpecialChar 
        && passwordNumbers
        && passwordLengthGood
        && validEmail
        && validName
        // this is needed for initial check if the user presses
        // create without modifying the form
        && userPassword.length > 0;

        if (credentialsValid) {
            try {
                const { user } = await Auth.signUp({
                    username,
                    password,
                    attributes: {
                        name
                    }             
                });
                
            console.log(user);
            }

        
            catch (error) {
                console.log('error signing up', error);
            }
        }
        else {
            console.log('could not sign up');
        }
    }    

    goToSecondStep = () => {
        const { typeCustomerSelected, typeBusinessSelected, invalidSelection } = this.state;

        if (typeBusinessSelected || typeCustomerSelected) {
            this.setState({
                firstStep: false,
                secondStep: true,
                thirdStep: false,
            });
        }
        else {
            this.setState({
                invalidSelection: true
            })
        }
    }

    doCreate = () => {
        const {             
            passwordsMatch, 
            passwordLengthGood, 
            passwordUppercase,
            passwordSpecialChar,
            passwordNumbers,
            passwordLowercase,
            userPassword,
            validEmail,
            validName
        } = this.state;

        const credentialsValid = passwordsMatch 
        && passwordLowercase 
        && passwordUppercase 
        && passwordSpecialChar 
        && passwordNumbers
        && passwordLengthGood
        && validEmail
        && validName
        // this is needed for initial check if the user presses
        // create without modifying the form
        && userPassword.length > 0;

        if (credentialsValid) {
            this.goToThirdStep();
        }
        else {
            this.setState({
                passwordsMatch: false,
                passwordLengthGood: false,
                passwordLowercase: false,
                passwordUppercase: false,
                passwordSpecialChar: false,
                passwordNumbers: false,
                validEmail: false,
                validName: false
            });
        }
    }

    goToThirdStep = () => {
        this.setState({
            firstStep: false,
            secondStep: false,
            thirdStep: true
        })
    }

    setUserCustomer = () => {
        this.setState({
            typeCustomerSelected: true,
            typeBusinessSelected: false
        })
    }

    setUserBusiness = () => {
        this.setState({
            typeBusinessSelected: true,
            typeCustomerSelected: false
        })
    }

    setUserEmail = (e) => {
        this.setState({
            userEmail: e.target.value
        })
    }

    setUserPassword = (e) => {
        this.setState({
            userPassword: e.target.value
        })
    }

    setUserName = (e) => {
        this.setState({
            userName: e.target.value
        })
    }

    setConfirmPassword = (e) => {
        this.setState({
            confirmPassword: e.target.value
        })
    }

    validateInputs = () => {
        const { userPassword, confirmPassword, userEmail, userName } = this.state;
        
        // check for at least 1 uppercase letter
        let re = new RegExp('[A-Z]');
        const uppercase = re.test(userPassword);
        // check for at least 1 lowercase letter
        re = new RegExp('[a-z]');
        const lowercase = re.test(userPassword);
        // check for length at least 8
        const lengthGood = userPassword.length >= 8;
        // check for special chars
        re = new RegExp('\\W');
        const specialCharacter = re.test(userPassword);
        // check for numbers
        re = new RegExp('[0-9]');
        const number = re.test(userPassword);
        // check for valid email address
        re = new RegExp('\\S+@\\S+\\.\\S+');
        const validEmail = re.test(userEmail);


        if (confirmPassword == userPassword) {
            this.setState({
                passwordsMatch: true
            });
        }

        else {
            this.setState({
                passwordsMatch: false
            });
        }

        this.setState({
            validName: userName.length > 0,
            validEmail: validEmail,
            passwordLengthGood: lengthGood,
            passwordLowercase: lowercase,
            passwordUppercase: uppercase,
            passwordSpecialChar: specialCharacter,
            passwordNumbers: number
        });
        
    }

    componentDidUpdate(prevProps, prevState) {
        const { userPassword, confirmPassword, userEmail, userName } = this.state;
        
        let eventUpdateCondition = (
            userPassword !== prevState.userPassword 
            || confirmPassword !== prevState.confirmPassword
            || userEmail !== prevState.userEmail
            || userName !== prevState.userName
            );

        if (eventUpdateCondition) {
            this.validateInputs();
        }
    }

    render() {
        const { 
            firstStep, 
            secondStep, 
            thirdStep, 
            typeBusinessSelected, 
            typeCustomerSelected,
            invalidSelection,
            passwordsMatch,
            passwordLengthGood,
            passwordUppercase,
            passwordLowercase,
            passwordSpecialChar,
            passwordNumbers,
            validEmail,
            validName
        } = this.state;
        
         return (
            <div>
                {firstStep && 
                <Step1 
                next = {this.goToSecondStep} 
                selectCustomer = {this.setUserCustomer}
                selectBusiness = {this.setUserBusiness}
                customerSelected = {typeCustomerSelected}
                businessSelected = {typeBusinessSelected}
                invalidSelection = {invalidSelection}
                />}
                
                {secondStep && <Step2 
                    next = {() => {
                        this.doCreate();
                        this.makeAccount();
                    }} 
                    onNameChange = {this.setUserName}
                    onEmailChange = {this.setUserEmail}
                    onPasswordChange = {this.setUserPassword}
                    onConfirmPasswordChange = {this.setConfirmPassword}
                    passwordsMatch = {passwordsMatch}
                    passwordLengthGood = {passwordLengthGood}
                    passwordUppercase = {passwordUppercase}
                    passwordLowercase = {passwordLowercase}
                    passwordSpecialChar = {passwordSpecialChar}
                    passwordNumbers = {passwordNumbers}
                    validEmail = {validEmail}
                    validName = {validName}
                />
                }
            </div>
        )
    }
}

export default CreateAccount