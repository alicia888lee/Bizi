import React, { Component } from 'react'
import Step1 from './CreateAccountStep1'
import Step2 from './CreateAccountStep2'
import VerifyStep from './CreateAccountVerification'
import Step3 from './CreateAccountStep3'
import { Auth, API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'


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
        this.goToAccountPage = this.goToAccountPage.bind(this)
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

    goToSecondStep = () => {
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

    goToVerifyStep = (firstVerifyAttempt = true) => {
        this.setState({
            firstStep: false,
            secondStep: false,
            verifyStep: true,
            thirdStep: false,
            firstVerifyAttempt: firstVerifyAttempt
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
        }
        // finally {
        //     this.setState({
        //         verifySuccess: success
        //     },
        //     () => { console.log('verify state after update', this.state.verifySuccess); }
        // );
        // }

    }

    invalidateCode = () => {
        this.setState({
            verifySuccess: false
        });
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

    goToAccountPage = () => {
        this.setState({
            firstStep: false,
            secondStep: false,
            thirdStep: false,
            verifyStep: false,
            finishedWizard: true
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
            firstVerifyAttempt
        } = this.state;
        
         return (
            <div>
                {/* {firstStep && 
                <Step1 
                next = {this.goToSecondStep} 
                selectCustomer = {this.setUserCustomer}
                selectBusiness = {this.setUserBusiness}
                customerSelected = {typeCustomerSelected}
                businessSelected = {typeBusinessSelected}
                invalidSelection = {invalidSelection}
                />} */}

                {secondStep && <Step2 
                    next = {this.doCreate}
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
                />}

                {verifyStep && <VerifyStep
                    verify = {async() => {
                        const verifyResult = await this.verifyEmail();
                        console.log(verifyResult);
                        verifyResult ? this.goToThirdStep() : this.goToVerifyStep(false)
                    }}
                    invalidCode = {!firstVerifyAttempt}
                    onCodeInputChange = {this.setVerifyCode}
                />}

                {firstStep && <Step3
                    skip = {() => {
                        this.goToAccountPage();
                        this.updateUserPreferences();
                    }}
                    finishSignUp = {() => {
                        this.updateUserPreferences();
                        this.goToAccountPage();
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

                {finishedWizard && <div></div>}
            </div>
        )
    }
}

export default CreateAccount;