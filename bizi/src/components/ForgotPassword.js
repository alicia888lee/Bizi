import React, { Component } from 'react'
import { Auth, API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import { withRouter } from 'react-router-dom'
import Step1 from './ForgotPasswordStep1'
import Step2 from './ForgotPasswordStep2'
import Step3 from './ForgotPasswordStep3'


class ForgotPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            step1: true,
            step2: false,
            step3: false,
            userEmail: '',
            confirmEmail: '',
            invalidEmailMessage: '',
            invalidEmail: false,
            updateError: false,
            updateErrorMessage: '',
            validEmail: true,
            validConfirmEmail: true,
            validCode: true,
            code: '',
            userPassword: '',
            passwordLengthGood: true,
            passwordUppercase: true,
            passwordSpecialChar: true,
            passwordNumbers: true,
            passwordLowercase: true
        }
    }

    resetStep1 = (errorMessage) => {
        this.setState({
            invalidEmail: true,
            invalidEmailMessage: errorMessage
        });
    }

    resetStep2 = (errorMessage) => {
        this.setState({
            updateError: true,
            updateErrorMessage: errorMessage
        });
    }

    proceed = () => {
        this.setState({
            step1: false,
            step2: true,
            step3: false,
        });
    }

    succeed = () => {
        this.setState({
            step1: false,
            step2: false,
            step3: true
        });
    }

    setEmail = (e) => {
        this.setState({
            userEmail: e.target.value
        });
    }

    setConfirmEmail = (e) => {
        this.setState({
            confirmEmail: e.target.value
        });
    }

    setCode = (e) => {
        this.setState({
            code: e.target.value
        });
    }

    setPassword = (e) => {
        this.setState({
            userPassword: e.target.value
        });
    }

    sendCode = async() => {
        const { userEmail } = this.state;
        const username = userEmail;
        try {
            await Auth.forgotPassword(username);
            return 'SENT';
        }
        catch(error) {
            console.log(error);
            return error.message;
        }
    }

    createNewPassword = async() => {
        const { 
            confirmEmail,
            code,
            userPassword,
            validConfirmEmail,
            validCode,
            passwordLengthGood, 
            passwordUppercase,
            passwordSpecialChar,
            passwordNumbers,
            passwordLowercase
        } = this.state;

        const noneValid = !(confirmEmail
        || code
        || userPassword
        );

        const inputsValid = validConfirmEmail
        && validCode
        && passwordLowercase 
        && passwordUppercase 
        && passwordSpecialChar 
        && passwordNumbers
        && passwordLengthGood;

        if (inputsValid && !noneValid) {
            const username = confirmEmail;
            const new_password = userPassword;

            try {
                await Auth.forgotPasswordSubmit(username, code, new_password);
            }
            catch(error) {
                console.log(error);
                return error.message;
            }

            this.succeed();
        }

        else if (noneValid) {
            this.setState({
                passwordLengthGood: false,
                passwordLowercase: false,
                passwordUppercase: false,
                passwordSpecialChar: false,
                passwordNumbers: false,
                validConfirmEmail: false,
                validCode: false
            });
        }
    }

    validateStep1Inputs = () => {
        const { userEmail } = this.state;

        this.setState({
            validEmail: userEmail
        });
    }

    validateStep2Inputs = () => {
        const { confirmEmail, code, userPassword } = this.state;

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
        
        this.setState({
            validConfirmEmail: confirmEmail,
            validCode: code,
            passwordLengthGood: lengthGood,
            passwordLowercase: lowercase,
            passwordUppercase: uppercase,
            passwordSpecialChar: specialCharacter,
            passwordNumbers: number
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            userEmail,
            userPassword,
            code,
            confirmEmail
        } = this.state;

        let step1UpdateCondition = (
            userEmail !== prevState.userEmail
        );

        let step2UpdateCondition = (
            code !== prevState.code
            || confirmEmail !== prevState.confirmEmail
            || userPassword !== prevState.userPassword
        );

        if (step1UpdateCondition) {
            this.validateStep1Inputs();
        }

        else if (step2UpdateCondition) {
            this.validateStep2Inputs();
        }
    }

    render() {
        const { 
            step1,
            step2,
            step3,
            invalidEmail,
            invalidEmailMessage,
            validConfirmEmail,
            validCode,
            passwordLengthGood,
            passwordUppercase,
            passwordLowercase,
            passwordSpecialChar,
            passwordNumbers,
            updateError,
            updateErrorMessage
        } = this.state;

        return (
            <div>
                {step1 && 
                <Step1 
                    onEmailChange={this.setEmail}
                    sendCode={async() => {
                        const sentCode = await this.sendCode();
                        console.log(sentCode);
                        sentCode == 'SENT' ? this.proceed() : this.resetStep1(sentCode)
                    }}
                    invalidEmail={invalidEmail}
                    errorMessage={invalidEmailMessage}
                />}
                {step2 &&
                <Step2
                    updatePassword={async() => {
                        const updateError = await this.createNewPassword();
                        console.log(updateError);
                        updateError && this.resetStep2(updateError);
                    }}
                    onEmailChange={this.setConfirmEmail}
                    validEmail={validConfirmEmail}
                    validCode={validCode}
                    onCodeChange={this.setCode}
                    onPasswordChange={this.setPassword}
                    passwordLengthGood={passwordLengthGood}
                    passwordUppercase={passwordUppercase}
                    passwordLowercase={passwordLowercase}
                    passwordSpecialChar={passwordSpecialChar}
                    passwordNumbers={passwordNumbers}
                    updateError={updateError}
                    updateErrorMessage={updateErrorMessage}
                />}
                {step3 &&
                <Step3
                    goToLogin={() => this.props.history.push('/login')}
                />}
            </div>
        )
    }
}

export default withRouter(ForgotPassword);