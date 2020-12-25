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
            servicesSelected,
            typeCustomer,
            validBusinessName,
            onNameChange,
            validBusinessDescription,
            onDescriptionChange,
            validInitiatives,
            onInitiativesChange,
            onPolicyChange,
            validPhone,
            onPhoneChange,
            onURLChange,
            onDeliveryChange,
            validAddress,
            onAddressChange,
            register
        } = this.props;
        return (
            <div>
                <Nav light={false} />
                <div className='createAccountHeader'>
                    <h1>{typeCustomer ? 'Adjust Your Preferences!' : 'Register Your Business'}</h1>
                    <p><b>{typeCustomer && 'What are you interested in?'}</b></p>
                </div>
                {typeCustomer ?
                <div className='userPreferencesGrid'>
                    <div onClick={selectSustainable} className='prefCol' id={sustainableSelected && 'userTypePreferenceHighlighted'}>
                        <img src={envImg} />
                        <span>
                            <p>Sustainability</p>
                        </span>
                    </div>
                    <div onClick={selectEthical} className='prefCol' id={ethicalSelected && 'userTypePreferenceHighlighted'}>
                        <img src={handImg} />
                        <span>
                            <p>Ethical Supply Chain</p>
                        </span>
                    </div>
                    <div onClick={selectDiversity} className='prefCol' id={diversitySelected && 'userTypePreferenceHighlighted'}>
                        <img src={communityImg} />
                        <span>
                            <p>Diversity Initiatives</p>
                        </span>
                    </div>
                    <div className='prefCol' id='invisibleColumn'>
                        <div className='userPrefSubGrid'>
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
                </div> :
                <div className='loginBody'>
                    <form>
                        <div className='inputGroup'>
                            <label for='name'>Business Name</label>
                            <input id={!validBusinessName && 'invalidInput'} type='text' name='name' onBlur={onNameChange}/>
                            {!validBusinessName && <p>Cannot be blank</p>}
                        </div>
                        <div className='inputGroup'>
                            <label for='description'>Business Description</label>
                            <input id={!validBusinessDescription && 'invalidInput'} type='text' name='description' onBlur={onDescriptionChange}/>
                            {!validBusinessDescription && <p>Cannot be blank</p>}
                        </div>
                        <div className='inputGroup'>
                            <label for='initiatives'>Initiatives<br/>(Choose from: Sustainability, Ethical Supply Chain, Diversity, Food, Shopping, Services<br />separated by a comma; if none, leave blank)</label>
                            <input id={!validInitiatives && 'invalidInput'} type='text' name='initiatives' onBlur={onInitiativesChange}/>
                            {!validInitiatives && <p>Must be from the options listed above</p>}
                        </div>
                        <div className='inputGroup'>
                            <label for='policies'>Business Policies<br/>(separated by a comma; if none, leave blank)</label>
                            <input type='text' name='policies' onBlur={onPolicyChange}/>
                        </div>
                        <div className='inputGroup'>
                            <label for='phone'>Business Phone</label>
                            <input className='phoneInput' id={!validPhone && 'invalidInput'} type='text' name='phone' onBlur={onPhoneChange} placeholder='(xxx) xxx-xxxx'/>
                            {!validPhone && <p>Cannot be blank and must be in (xxx) xxx-xxxx format</p>}
                        </div>
                        <div className='inputGroup'>
                            <label for='url'>Business URL<br/>(if none, leave blank)</label>
                            <input type='text' name='url' onBlur={onURLChange}/>
                        </div>
                        <div className='inputGroup'>
                            <label for='delivery'>URL of Grubhub, Doordash, etc<br/>(if none, leave blank)</label>
                            <input type='text' name='delivery' onBlur={onDeliveryChange}/>
                        </div>
                        <div className='inputGroup'>
                            <label for='address'>Business Address</label>
                            <input id={!validAddress && 'invalidInput'} type='text' name='address' onBlur={onAddressChange}/>
                            {!validAddress && <p>Cannot be blank</p>}
                        </div>
                    </form>
                </div>
                }
                {typeCustomer ? 
                <div className='step3NextButtons'>
                    <button id='skipStep3' onClick={finishSignUp}>Skip</button>
                    <button id='letsGoStep3' onClick={finishSignUp}>Let's Go</button>
                </div> :
                <div className='step3NextButtons'>
                    <button id='skipStep3' onClick={finishSignUp}>Skip</button>
                    <button id='register' onClick={register}>Register</button>
                </div>
                }
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