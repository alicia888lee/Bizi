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

        this.state = {
            firstStep: true,
            secondStep: false,
            thirdStep: false,
            typeCustomerSelected: false,
            typeBusinessSelected: false
        }
    }

    makeAccount = async signUp => {
        let username = 'testUserName';
        let password = 'testPassword';
        let name = 'testName';
        try {
            const { user } = await Auth.signUp({
                username,
                password,
                attributes: {
                    name,
                }             
            });
        }
    
        catch (error) {
            console.log('error signing up', error);
        }
    }    

    goToSecondStep = () => {
        this.setState({
            firstStep: false,
            secondStep: true,
            thirdStep: false
        })
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

    render() {
        const { 
            firstStep, 
            secondStep, 
            thirdStep, 
            typeBusinessSelected, 
            typeCustomerSelected } = this.state;
        return (
            <div>
                {firstStep && 
                <Step1 
                next = {this.goToSecondStep} 
                selectCustomer = {this.setUserCustomer}
                selectBusiness = {this.setUserBusiness}
                customerSelected = {typeCustomerSelected}
                businessSelected = {typeBusinessSelected}
                />}
                
                {secondStep && <Step2 next = {() => {
                    this.goToThirdStep();
                    this.makeAccount();
                }} />
                }
            </div>
        )
    }
}

export default CreateAccount