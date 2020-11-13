import React, { Component } from 'react'
import Nav from './Nav'

class Step1 extends React.Component {
    render() {
        const { next } = this.props;
        return (
            <div className='createAccountStep1'>
                <Nav light={false} />
                <div className='createAccountHeader'>
                    <h1>Start Making Change!</h1>
                    <p><b>Are you a...</b></p>
                </div>
                <div className='userTypeGrid'>
                    <div className='userCol'>
                        <p>Customer</p>
                    </div>
                    <div className='userCol'>
                        <p>Business</p>
                    </div>
                </div>

            </div>
        )
    }
}

export default Step1;