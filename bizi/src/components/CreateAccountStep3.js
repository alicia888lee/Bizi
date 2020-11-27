import React, { Component } from 'react'
import Nav from './Nav'
import communityImg from '../images/community.png'
import envImg from '../images/environment.png'
import handImg from '../images/heart_hand.png'


class Step3 extends Component {
    render() {
        const { 
            finishSignUp,
            selectSustainable,
            selectEthical,
            selectDiversity,
            selectFood,
            selectShopping,
            selectServices,
            sustainableSelected,
            ethicalSelected,
            diversitySelected,
            shoppingSelected,
            foodSelected,
            servicesSelected
        } = this.props;
        return (
            <div>
                <Nav light={false} />
                <div className='createAccountHeader'>
                    <h1>Adjust Your Preferences!</h1>
                    <p><b>What are you interested in?</b></p>
                </div>
                <div className='userPreferencesGrid'>
                    <div onClick={selectSustainable} className='prefCol' id={sustainableSelected && 'userTypePreferenceHighlighted'}>
                        <img src={envImg} />
                        <p>Sustainability</p>
                    </div>
                    <div onClick={selectEthical} className='prefCol' id={ethicalSelected && 'userTypePreferenceHighlighted'}>
                        <img src={handImg} />
                        <p>Ethical Supply Chain</p>
                    </div>
                    <div onClick={selectDiversity} className='prefCol' id={diversitySelected && 'userTypePreferenceHighlighted'}>
                        <img src={communityImg} />
                        <p>Diversity Initiatives</p>
                    </div>
                    <div className='prefCol' id='invisibleColumn'>
                        <div className='userPrefRows'>
                            <div className='prefRow' onClick={selectShopping} id={shoppingSelected && 'userTypePreferenceHighlighted'}>
                                <p>Shopping</p>
                            </div>
                            <div className='prefRow' onClick={selectFood} id={foodSelected && 'userTypePreferenceHighlighted'}>
                                <p>Food</p>
                            </div>
                            <div className='prefRow' onClick={selectServices} id={servicesSelected && 'userTypePreferenceHighlighted'}>
                                <p>Services</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='step3NextButtons'>
                    <button id='skipStep3' onClick={finishSignUp}>Skip</button>
                    <button id='letsGoStep3' onClick={finishSignUp}>Let's Go</button>

                </div>
                <div className="circles">
                    <div className="circleCreateAcct"></div>
                    <div className="circleCreateAcct"></div>
                    <div className="circleCreateAcct blueCircle"></div>
                </div>
                <div className='termsAgreement'>
                    <a className="smallText" href="#">Terms of Agreement</a>   
                </div>
            </div>
        )
    }
}

export default Step3;