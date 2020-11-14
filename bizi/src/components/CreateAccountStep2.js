import React, { Component } from 'react'

class Step2 extends Component {
    

    render() {
        const { next } = this.props;
        return (
            <div>
                <button onClick={next}>Go to step3</button>
            </div>
        )
    }
}

export default Step2;