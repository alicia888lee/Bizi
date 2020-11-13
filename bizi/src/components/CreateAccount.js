import React, { Component } from 'react'
import Step1 from './CreateAccountStep1'
import Step2 from './CreateAccountStep2'

class CreateAccount extends React.Component {
    constructor(props) {
        super(props)

        this.goToSecondStep = this.goToSecondStep.bind(this)
        this.goToThirdStep = this.goToThirdStep.bind(this)

        this.state = {
            firstStep: true,
            secondStep: false,
            thirdStep: false
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

    render() {
        const { firstStep, secondStep, thirdStep } = this.state;
        return (
            <div>
                {firstStep && <Step1 next = {this.goToSecondStep} />}
                {secondStep && <Step2 next = {this.goToThirdStep} />}
            </div>
        )
    }
}

export default CreateAccount