import React, { Component } from 'react'
import Step1 from './CreateAccountStep1'
import Step2 from './CreateAccountStep2'
import VerifyStep from './CreateAccountVerification'
import { Auth, API, Storage } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries'
import { withRouter } from 'react-router-dom'
import Step3 from './CreateAccountStep3'
import Loader from 'react-loader-spinner'


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
            smLogin: false,
            smRedirecting: true,
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
            typeServicesSelected: false,
            price1Selected: false,
            price2Selected: false,
            price3Selected: false,
            price4Selected: false,
            validPrice: true,
            businessName: '',
            businessDescription: '',
            policyList: [],
            phone: '',
            url: '',
            deliveryURL: '',
            reservationURL: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            validBusinessName: true,
            validBusinessDescription: true,
            validPhone: true,
            validUrl: true,
            validDelivery: true,
            validStreet: true,
            validCity: true,
            validState: true,
            validZip: true,
            schedule: {},
            file: '',
            validSchedule: true,
            disableSchedule: {
                'Monday': false,
                'Tuesday': false,
                'Wednesday': false,
                'Thursday': false,
                'Friday': false,
                'Saturday': false,
                'Sunday': false,
            },
            previousSchedule: {}
        }
    }

    goToSecondStep = (duplicateEmail = false, duplicateEmailMessage = '') => {
        const { typeCustomerSelected, typeBusinessSelected, smLogin } = this.state;
        console.log(smLogin);
        if (typeBusinessSelected || typeCustomerSelected) {
            if (smLogin) {
                this.setState({
                    firstStep: false,
                    secondStep: false,
                    verifyStep: false,
                    thirdStep: true,
                });
                this.updateUserPreferences();
            }
            else {
                this.setState({
                    firstStep: false,
                    secondStep: true,
                    verifyStep: false,
                    thirdStep: false,
                });
            }
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

            // check if user already exists in db
            try {
                var userExists = await API.graphql({
                    query: queries.getUser,
                    variables: {userEmail: username}
                });
            }
            catch (error) {
                console.log(error);
            }
            if (userExists?.data?.getUser) {
                return 'An account with this email already exists.';
            }
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

    registerBusiness = async() => {
        const {
            businessName,
            businessDescription,
            typeSustainableSelected,
            typeEthicalSelected,
            typeDiversitySelected,
            typeShoppingSelected,
            typeFoodSelected,
            typeServicesSelected,
            policyList,
            phone,
            url,
            deliveryURL,
            reservationURL,
            street,
            city,
            state,
            zip,
            validBusinessName,
            validBusinessDescription,
            validPhone,
            validStreet,
            validCity,
            validState,
            validZip,
            userEmail,
            price1Selected,
            price2Selected,
            price3Selected,
            price4Selected,
            validPrice,
            schedule,
            validSchedule,
            file,
        } = this.state;

        const noneValid = !(businessName
            || businessDescription
            || phone
            || street
            || city
            || state
            || zip
            || price1Selected
            || price2Selected
            || price3Selected
            || price4Selected
            || Object.keys(schedule).length > 0
        );

        console.log(noneValid);

        const inputsValid = validBusinessName
            && validBusinessDescription
            && validPhone
            && validStreet
            && validCity
            && validState
            && validZip
            && validPrice
            && validSchedule;

        const selectedInitiativeBooleans = [
            typeSustainableSelected,
            typeEthicalSelected,
            typeDiversitySelected,
            typeShoppingSelected,
            typeFoodSelected,
            typeServicesSelected
        ];

        const possibleBusinessInitiatives = [
            'Sustainability',
            'Ethical Supply Chain',
            'Diversity Initiatives',
            'Shopping',
            'Food',
            'Services'
        ];

        const selectedInitiatives = selectedInitiativeBooleans
            .map((bool, index) => bool ? index : null)
            .filter(index => index !== null);

        const businessInitiatives = selectedInitiatives.map(
            i => possibleBusinessInitiatives[i]
        );

        const selectedPriceBooleans = [
            price1Selected,
            price2Selected,
            price3Selected,
            price4Selected
        ];

        const possiblePrices = [1, 2, 3, 4];

        const selectedPrices = selectedPriceBooleans
            .map((bool, index) => bool ? index : null)
            .filter(index => index !== null);

        const priceRange = selectedPrices.map(i => possiblePrices[i])[0];

        const scheduleArr = [];
        // schedule in db will be of form [
            // [open, close], [open, close], ... [open, close]
        // ]
        for (var key in schedule) {
            var day = [schedule[key]?.open, schedule[key]?.close]
            scheduleArr.push(day)
        }

        // upload photo to s3 and get url
        try {
            await Storage.put(file.name, file, {
                contentType: 'image/jpg'
            });

            var photoURL = await Storage.get(file.name, { level: 'public' });
            console.log(photoURL);
        }
        catch (err) {
            console.log(err);
        }

        var address = street + 
            ', ' +
            city +
            ', ' +
            state +
            ' ' + 
            zip;

        if (inputsValid && !noneValid) {
            const businessInfo = {
                businessName: businessName,
                businessDescription: businessDescription,
                initiatives: businessInitiatives,
                policyList: policyList,
                businessPhone: phone,
                businessURL: url,
                deliveryURL: deliveryURL,
                reservationURL: reservationURL,
                address: address,
                userEmail: userEmail,
                priceRange: priceRange,
                schedule: scheduleArr,
                businessPhoto: photoURL,
                approved: false,
            };
            try {
                const newBusiness = await API.graphql({
                    query: mutations.createBusiness,
                    variables: {input: businessInfo}
                });
                console.log(newBusiness);
            }
            catch(error) {
                console.log(error);
            }
            // send email notification to business email regarding new business awaiting approval
            try {
                var notification = await API.graphql({
                    query: mutations.sendEmail,
                    variables: {
                        recipientEmail: 'thebiziteam@gmail.com', 
                        subject: 'New Business Registration',
                        body: `The following business is ready to be approved:\n
                            Business Name: ${businessName}\n
                            User: ${userEmail}\n\n
                            You can view the business at https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#table?name=Business-s5bh2iwoz5f4zg7qgdfpfqgzi4-dev&initialTableGroup=%23all`
                }});
                console.log(notification);
            }
            catch (error) {
                console.log(error);
            }
            this.props.history.push('/account');
        }

        else if (noneValid) {
            this.setState({
                validBusinessName: false,
                validBusinessDescription: false,
                validPhone: false,
                validStreet: false,
                validCity: false,
                validState: false,
                validZip: false,
                validPrice: false,
                validSchedule: false
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

        const selectedPreferencesBooleans = [
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

        const selectedPreferences = selectedPreferencesBooleans
            .map((bool, index) => bool ? index : null)
            .filter(index => index !== null);

        const userPreferences = selectedPreferences.map(
            i => possibleUserPreferences[i]
        );

        const userType = typeBusinessSelected ? "Business" : "Customer";

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

    setPrice1 = () => {
        this.setState({
            price1Selected: true,
            price2Selected: false,
            price3Selected: false,
            price4Selected: false
        });
    }

    setPrice2 = () => {
        this.setState({
            price1Selected: false,
            price2Selected: true,
            price3Selected: false,
            price4Selected: false
        });
    }

    setPrice3 = () => {
        this.setState({
            price1Selected: false,
            price2Selected: false,
            price3Selected: true,
            price4Selected: false
        });
    }

    setPrice4 = () => {
        this.setState({
            price1Selected: false,
            price2Selected: false,
            price3Selected: false,
            price4Selected: true
        });
    }

    setSchedule = (day, open, close) => {
        const { schedule } = this.state;
        if (open) {
            var openPM = open.split(' ')[1] == 'PM' ? 1 : 0;
            var hourOpen = Number(open.split(':')[0]);
            var minuteOpen = Number(open.split(':')[1].split(' ')[0]);
            var timeOpen = hourOpen + (minuteOpen / 60) + (12 * openPM);
        }
        if (close) {
            var closePM = close.split(' ')[1] == 'PM' ? 1 : 0;
            var hourClose = Number(close.split(':')[0]);
            var minuteClose = Number(close.split(':')[1].split(' ')[0]);
            var timeClose = hourClose + (minuteClose / 60) + (12 * closePM);
        }
        var updatedSchedule = {};
        for (var key in schedule) {
            updatedSchedule[key] = schedule[key];
        }
        updatedSchedule[day] = {
            open: open ? timeOpen : schedule[day]?.open,
            close: close ? timeClose : schedule[day]?.close
        };
        this.setState({
            schedule: updatedSchedule,
            previousSchedule: schedule
        });
    }

    disableDay = (day) => {
        const { disableSchedule, schedule, previousSchedule } = this.state;
        var updatedDisableSchedule = {};
        for (var key in disableSchedule) {
            updatedDisableSchedule[key] = disableSchedule[key];
        }
        var currState = disableSchedule[day];
        updatedDisableSchedule[day] = !currState;

        // set hours of operation to -1
        var updatedSchedule = {};
        for (var key in schedule) {
            updatedSchedule[key] = schedule[key];
        }
        if (!currState) {
            updatedSchedule[day] = {
                open: -1,
                close: -1
            };
        }
        else {
            var prevOpen = previousSchedule[day]?.open;
            var prevClose = previousSchedule[day]?.close;
            updatedSchedule[day] = {
                open: prevOpen,
                close: prevClose
            };
        }
        this.setState({
            disableSchedule: updatedDisableSchedule,
            schedule: updatedSchedule,
            previousSchedule: schedule
        });
    }

    setBusinessName = (e) => {
        this.setState({
            businessName: e.target.value
        });
    }

    setBusinessDescription = (e) => {
        this.setState({
            businessDescription: e.target.value
        });
    }

    setInitiatives = (e) => {
        var initiatives = [];
        e.target.value.length > 0 ?
            initiatives = e.target.value.split(/,\s*/) :
            initiatives = [];
        this.setState({
            initiatives: initiatives
        });
    }

    setPolicies = (e) => {
        var policies = [];
        e.target.value.length > 0 ? 
            policies = e.target.value.split(/,\s*/) :
            policies = [];
        this.setState({
            policyList: policies
        });
    }

    setPhone = (e) => {
        this.setState({
            phone: e.target.value
        });
    }

    setUrl = (e) => {
        this.setState({
            url: e.target.value
        });
    }

    setDelivery = (e) => {
        this.setState({
            deliveryURL: e.target.value
        });
    }

    setReservation = (e) => {
        this.setState({
            reservationURL: e.target.value
        });
    }

    handleUpload = (e) => {
        this.setState({
            file: e.target.files[0]
        });
    }

    setStreet = (e) => {
        this.setState({
            street: e.target.value
        });
    }

    setCity = (e) => {
        this.setState({
            city: e.target.value
        });
    }

    setLocState = (e) => {
        this.setState({
            state: e.target.value
        });
    }

    setZip = (e) => {
        this.setState({
            zip: e.target.value
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

    validateStep2Inputs = () => {
        const { 
            userPassword, 
            confirmPassword, 
            userEmail, 
            userName,
        } = this.state;
        
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
            passwordNumbers: number,
        });
    }

    validateStep3Inputs = () => {
        const {
            businessName,
            businessDescription,
            phone,
            street,
            city,
            state,
            zip,
            price1Selected,
            price2Selected,
            price3Selected,
            price4Selected,
            schedule
        } = this.state;

        let re = new RegExp(/^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/);
        var validPhoneFormat = re.test(phone);
        var scheduleDefined = true;
        for (var key in schedule) {
            if (!schedule[key]?.open || !schedule[key]?.close) {
                scheduleDefined = false;
                break;
            }
        }
        var completeSchedule = Object.keys(schedule).length == 7;

        this.setState({ 
            validBusinessName: businessName,
            validBusinessDescription: businessDescription,
            validPhone: phone && validPhoneFormat,
            validStreet: street,
            validCity: city,
            validState: state,
            validZip: zip,
            validPrice: price1Selected || price2Selected || price3Selected || price4Selected,
            validSchedule: scheduleDefined && completeSchedule
        });
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

    componentDidUpdate(prevProps, prevState) {
        const { 
            userPassword, 
            confirmPassword, 
            userEmail, 
            userName,
            businessName,
            businessDescription,
            initiatives,
            policyList,
            phone,
            url,
            deliveryURL,
            reservationURL,
            street,
            city,
            state,
            zip,
            price1Selected,
            price2Selected,
            price3Selected,
            price4Selected,
            schedule,
            file
        } = this.state;
        
        let step2UpdateCondition = (
            userPassword !== prevState.userPassword 
            || confirmPassword !== prevState.confirmPassword
            || userEmail !== prevState.userEmail
            || userName !== prevState.userName
            );

        let step3UpdateCondition = (
            businessName !== prevState.businessName
            || businessDescription !== prevState.businessDescription
            || initiatives !== prevState.initiatives
            || policyList !== prevState.policyList
            || phone !== prevState.phone
            || url !== prevState.url
            || deliveryURL !== prevState.deliveryURL
            || reservationURL !== prevState.reservationURL
            || street !== prevState.street
            || city !== prevState.city
            || state !== prevState.state
            || zip !== prevState.zip
            || price1Selected !== prevState.price1Selected
            || price2Selected !== prevState.price2Selected
            || price3Selected !== prevState.price3Selected
            || price4Selected !== prevState.price4Selected
            || schedule !== prevState.schedule
            || file !== prevState.file
        )

        if (step2UpdateCondition) {
            this.validateStep2Inputs();
        }
        else if (step3UpdateCondition) {
            this.validateStep3Inputs();
        }
    }

    userRegistered = async(user) => {
        var email = user?.attributes?.email;

        try {
            var registered = await API.graphql({
                query: queries.getUser,
                variables: {userEmail: email}
            });
            return registered?.data?.getUser;
        }
        catch (error) {
            console.log(error);
        }

    }

    async componentDidMount() {
        const currentUser = await this.getCurrentUser();
        var userRegistered = await this.userRegistered(currentUser);
        this.setState({
            smRedirecting: false
        });
        if (currentUser) {
            if (userRegistered) {
                this.props.history.push('/account');
            }
            else {
                this.setState({
                    smLogin: true,
                    userEmail: currentUser?.attributes?.email
                });
            }
        }
    }

    render() {
        const { 
            firstStep, 
            secondStep,
            verifyStep,
            thirdStep,
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
            duplicateEmailMessage,
            validBusinessName,
            validBusinessDescription,
            validInitiatives,
            validPhone,
            validStreet,
            validCity,
            validState,
            validZip,
            price1Selected,
            price2Selected,
            price3Selected,
            price4Selected,
            validPrice,
            validSchedule,
            disableSchedule,
            smRedirecting,
            file
        } = this.state;

        return (
            <>
                {smRedirecting ? <Loader type='TailSpin' color='#385FDC' height={40}/> : 
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
                        typeCustomer = {typeCustomerSelected}
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
                            this.props.history.push('/account');
                        }}
                        register = {() => {
                            this.registerBusiness();
                        }}
                        validBusinessName = {validBusinessName}
                        validBusinessDescription = {validBusinessDescription}
                        validInitiatives = {validInitiatives}
                        validPhone = {validPhone}
                        validStreet = {validStreet}
                        validCity = {validCity}
                        validState = {validState}
                        validZip = {validZip}
                        onNameChange = {this.setBusinessName}
                        onDescriptionChange = {this.setBusinessDescription}
                        onInitiativesChange = {this.setInitiatives}
                        onPolicyChange = {this.setPolicies}
                        onPhoneChange = {this.setPhone}
                        onURLChange = {this.setUrl}
                        onDeliveryChange = {this.setDelivery}
                        onReservationChange = {this.setReservation}
                        onStreetChange = {this.setStreet}
                        onCityChange = {this.setCity}
                        onStateChange = {this.setLocState}
                        onZipChange = {this.setZip}
                        typeCustomer = {typeCustomerSelected}
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
                        selectPrice1 = {this.setPrice1}
                        selectPrice2 = {this.setPrice2}
                        selectPrice3 = {this.setPrice3}
                        selectPrice4 = {this.setPrice4}
                        price1Selected = {price1Selected}
                        price2Selected = {price2Selected}
                        price3Selected = {price3Selected}
                        price4Selected = {price4Selected}
                        validPrice = {validPrice}
                        setSchedule = {this.setSchedule}
                        disableDay = {this.disableDay}
                        disabled = {disableSchedule}
                        validSchedule = {validSchedule}
                        handleUpload = {this.handleUpload}
                        imgFile = {file}
                    />}
                
                </div>
                }
            </>
        )
    }
}

export default withRouter(CreateAccount);