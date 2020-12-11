import React, { Component } from 'react'
import Step1 from './CreateAccountStep1'
import Step2 from './CreateAccountStep2'
import VerifyStep from './CreateAccountVerification'
import Step3 from './CreateAccountStep3'
import { Auth, API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import { withRouter } from 'react-router-dom'


class CreateAccount extends Component {
    constructor(props) {
        super(props)

        this.goToSecondStep = this.goToSecondStep.bind(this)
        this.goToThirdStep = this.goToThirdStep.bind(this)
        this.setUserCustomer = this.setUserCustomer.bind(this)
        this.setUserBusiness = this.setUserBusiness.bind(this)
        this.setUserEmail = this.setUserEmail.bind(this)
        this.setUserPassword = this.setUserPassword.bind(this)
        this.setUserName = this.setUserName.bind(this)
        this.setConfirmPassword = this.setConfirmPassword.bind(this)
        this.doCreate = this.doCreate.bind(this)
        this.setVerifyCode = this.setVerifyCode.bind(this)
        this.setPrefSustainable = this.setPrefSustainable.bind(this)
        this.setPrefEthical = this.setPrefEthical.bind(this)
        this.setPrefDiversity = this.setPrefDiversity.bind(this)
        this.setPrefShopping = this.setPrefShopping.bind(this)
        this.setPrefFood = this.setPrefFood.bind(this)
        this.setPrefServices = this.setPrefServices.bind(this)
        this.verifyEmail = this.verifyEmail.bind(this)

        this.state = {
            firstStep: true,
            secondStep: false,
            thirdStep: false,
            verifyStep: false,
            finishedWizard: false,
            typeCustomerSelected: false,
            typeBusinessSelected: false,
            invalidSelection: false,
            userEmail: '',
            userPassword: '',
            userName: '',
            confirmPassword: '',
            verificationCode: '',
            duplicateEmail: false,
            duplicateEmailMessage: '',
            errorValidationMessage: '',
            passwordsMatch: true,
            passwordLengthGood: true,
            passwordUppercase: true,
            passwordSpecialChar: true,
            passwordNumbers: true,
            passwordLowercase: true,
            validEmail: true,
            validName: true,
            firstVerifyAttempt: true,
            additionalVerifyAttempts: false,
            typeSustainableSelected: false,
            typeEthicalSelected: false,
            typeDiversitySelected: false,
            typeShoppingSelected: false,
            typeFoodSelected: false,
            typeServicesSelected: false
        }
    }

    goToSecondStep = (duplicateEmail = false, duplicateEmailMessage = '') => {
        const { typeCustomerSelected, typeBusinessSelected } = this.state;

        if (typeBusinessSelected || typeCustomerSelected) {
            this.setState({
                firstStep: false,
                secondStep: true,
                verifyStep: false,
                thirdStep: false,
            });
        }
        else {
            this.setState({
                invalidSelection: true
            })
        }

        this.setState({
            duplicateEmail: duplicateEmail,
            duplicateEmailMessage: duplicateEmailMessage
        });
    }

    doCreate = async() => {
        const {             
            passwordsMatch, 
            passwordLengthGood, 
            passwordUppercase,
            passwordSpecialChar,
            passwordNumbers,
            passwordLowercase,
            userPassword,
            validEmail,
            validName,
            userName,
            userEmail,
            confirmPassword
        } = this.state;
        
        // this is needed for initial check if the user presses
        // create without modifying the form
        const noneValid = !(userPassword
        || userName
        || userEmail
        || confirmPassword
        );

        const credentialsValid = passwordsMatch 
        && passwordLowercase 
        && passwordUppercase 
        && passwordSpecialChar 
        && passwordNumbers
        && passwordLengthGood
        && validEmail
        && validName;

        console.log(noneValid)
        
        // check both because initially all credentials are set to true
        if (credentialsValid && !noneValid) {
            // complete authorization
            const username = userEmail;
            const password = userPassword;
            const name = userName;
            try {
                const user = await Auth.signUp({
                    username,
                    password,
                    attributes: {
                        name
                    }             
                });
            }
            catch (error) {
                console.log('error signing up', error);
                return error.message;
            }

            // go to third step
            this.updateUserPreferences();
            this.goToVerifyStep();
        }

        else if (noneValid) {
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

    goToVerifyStep = (firstVerifyAttempt = true, errorMessage) => {
        this.setState({
            firstStep: false,
            secondStep: false,
            verifyStep: true,
            thirdStep: false,
            firstVerifyAttempt: firstVerifyAttempt,
            errorValidationMessage: errorMessage
        });
    }

    setVerifyCode = (e) => {
        this.setState({
            verificationCode: e.target.value
        });
    }

    verifyEmail = async() => {
        const { verificationCode, userEmail } = this.state;
        const username = userEmail;
        const code = verificationCode;
        
        try {
            const verifyResult = await Auth.confirmSignUp(username, code);
            console.log(verifyResult);
            return verifyResult;
        }
        catch (error) {
            console.log('error confirming sign up', error);
            console.log('error message', error.message);
            return error.message;
        }
    }

    autoSignIn = async() => {
        const { userEmail, userPassword } = this.state
        const username = userEmail;
        const password = userPassword;

        try {
            const user = await Auth.signIn(username, password);
        } catch (error) {
            console.log('error signing in', error);
        }
    }

    updateUserPreferences = async() => {
        const { 
            typeBusinessSelected, 
            userEmail,
            typeSustainableSelected,
            typeEthicalSelected,
            typeDiversitySelected,
            typeShoppingSelected,
            typeFoodSelected,
            typeServicesSelected
        } = this.state;

        const selectedBooleans = [
            typeSustainableSelected, 
            typeEthicalSelected,
            typeDiversitySelected,
            typeShoppingSelected,
            typeFoodSelected,
            typeServicesSelected
        ];
        const possibleUserPreferences = [
            'Sustainability',
            'Ethical Supply Chain',
            'Diversity Initiatives',
            'Shopping',
            'Food',
            'Services'
        ];

        const userType = typeBusinessSelected ? "Business" : "Customer";
        
        // determine indices of preferences to push to db
        const selectedPreferences = selectedBooleans.reduce(
            (out, bool, index) => bool ? out.concat(index) : out, []
        );

        const userPreferences = selectedPreferences.map(
            i => possibleUserPreferences[i]
        );

        const userDetails = {
            userEmail: userEmail,
            userType: userType,
            userPreferences: userPreferences
        };

        try {
            const newUser = await API.graphql({
                query: mutations.createUser,
                variables: {input: userDetails}
            });
        console.log(newUser);
        }
        catch(error) {
            console.log(error);
        }

    }

    goToThirdStep = () => {
        this.setState({
            firstStep: false,
            secondStep: false,
            verifyStep: false,
            thirdStep: true
        });
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

    setPrefSustainable = () => {
        const { typeSustainableSelected } = this.state;
        typeSustainableSelected ? 
        this.setState({
            typeSustainableSelected: false
        }) :
        this.setState({
            typeSustainableSelected: true
        });
    }
    
    setPrefEthical = () => {
        const { typeEthicalSelected } = this.state;
        typeEthicalSelected ? 
        this.setState({
            typeEthicalSelected: false
        }) :
        this.setState({
            typeEthicalSelected: true
        });    }

    setPrefDiversity = () => {
        const { typeDiversitySelected } = this.state;
        typeDiversitySelected ? 
        this.setState({
            typeDiversitySelected: false
        }) :
        this.setState({
            typeDiversitySelected: true
        });
    }

    setPrefShopping = () => {
        const { typeShoppingSelected } = this.state;
        typeShoppingSelected ? 
        this.setState({
            typeShoppingSelected: false
        }) :
        this.setState({
            typeShoppingSelected: true
        });
    }

    setPrefFood = () => {
        const { typeFoodSelected } = this.state;
        typeFoodSelected ? 
        this.setState({
            typeFoodSelected: false
        }) :
        this.setState({
            typeFoodSelected: true
        });
    }

    setPrefServices = () => {
        const { typeServicesSelected } = this.state;
        typeServicesSelected ? 
        this.setState({
            typeServicesSelected: false
        }) :
        this.setState({
            typeServicesSelected: true
        });
    }

    setUserEmail = (e) => {
        this.setState({
            userEmail: e.target.value,
            duplicateEmail: false
        });
    }

    setUserPassword = (e) => {
        this.setState({
            userPassword: e.target.value
        });
    }

    setUserName = (e) => {
        this.setState({
            userName: e.target.value
        });
    }

    setConfirmPassword = (e) => {
        this.setState({
            confirmPassword: e.target.value
        });
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


        if (confirmPassword == userPassword && confirmPassword) {
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
            validName: userName,
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
            verifyStep,
            thirdStep,
            finishedWizard,
            typeBusinessSelected, 
            typeCustomerSelected,
            typeSustainableSelected,
            typeEthicalSelected,
            typeDiversitySelected,
            typeShoppingSelected,
            typeFoodSelected,
            typeServicesSelected,
            invalidSelection,
            passwordsMatch,
            passwordLengthGood,
            passwordUppercase,
            passwordLowercase,
            passwordSpecialChar,
            passwordNumbers,
            validEmail,
            validName,
            firstVerifyAttempt,
            errorValidationMessage,
            duplicateEmail,
            duplicateEmailMessage
        } = this.state;
        
         return (
            <div>
                {firstStep && 
                <Step1 
                next = {() => { this.goToSecondStep(); }} 
                selectCustomer = {this.setUserCustomer}
                selectBusiness = {this.setUserBusiness}
                customerSelected = {typeCustomerSelected}
                businessSelected = {typeBusinessSelected}
                invalidSelection = {invalidSelection}
                />}

                {secondStep && <Step2 
                    next = {async() => {
                        const createResult = await this.doCreate();
                        createResult && this.goToSecondStep(true, createResult)
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
                    duplicateEmail = {duplicateEmail}
                    duplicateEmailMessage = {duplicateEmailMessage}
                />}

                {verifyStep && <VerifyStep
                    verify = {async() => {
                        const verifyResult = await this.verifyEmail();
                        console.log(verifyResult);
                        verifyResult == 'SUCCESS' ? this.goToThirdStep() : this.goToVerifyStep(false, verifyResult)
                        this.autoSignIn();
                    }}
                    errorMessage = {errorValidationMessage}
                    invalidCode = {!firstVerifyAttempt}
                    onCodeInputChange = {this.setVerifyCode}
                />}

                {thirdStep && <Step3
                    finishSignUp = {() => {
                        this.updateUserPreferences();
                        this.props.history.push('/Account');
                    }}
                    selectSustainable = {this.setPrefSustainable}
                    selectEthical = {this.setPrefEthical}
                    selectDiversity = {this.setPrefDiversity}
                    selectFood = {this.setPrefFood}
                    selectShopping = {this.setPrefShopping}
                    selectServices = {this.setPrefServices}
                    sustainableSelected = {typeSustainableSelected}
                    ethicalSelected = {typeEthicalSelected}
                    diversitySelected = {typeDiversitySelected}
                    shoppingSelected = {typeShoppingSelected}
                    foodSelected = {typeFoodSelected}
                    servicesSelected = {typeServicesSelected}
                />}

            </div>
        )
    }
}

export default withRouter(CreateAccount);