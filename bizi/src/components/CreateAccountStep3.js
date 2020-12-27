import React, { Component } from 'react'
import Nav from './Nav'
import communityImg from '../images/community.png'
import envImg from '../images/environment.png'
import handImg from '../images/heart_hand.png'
import { PriceTag } from './SearchItemsList'


class Step3 extends Component {
    constructor(props) {
        super(props)
    }

    createSchedule = (setSchedule, disableDay, disabled) => {
        var days = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ];

        var schedule = days.map((day) => 
            <div className='dayHours'>
                <div><p>{day}</p></div>
                <div className='search-selects'>
                    <select onChange={(e) => setSchedule(day, e.target.value, null)} disabled={disabled[day]}>
                        <option selected disabled style={{display: 'none'}}>Open</option>
                        <option>12:00 AM</option>
                        <option>12:30 AM</option>
                        <option>1:00 AM</option>
                        <option>1:30 AM</option>
                        <option>2:00 AM</option>
                        <option>2:30 AM</option>
                        <option>3:00 AM</option>
                        <option>3:30 AM</option>
                        <option>4:00 AM</option>
                        <option>4:30 AM</option>
                        <option>5:00 AM</option>
                        <option>5:30 AM</option>
                        <option>6:00 AM</option>
                        <option>6:30 AM</option>
                        <option>7:00 AM</option>
                        <option>7:30 AM</option>
                        <option>8:00 AM</option>
                        <option>8:30 AM</option>
                        <option>9:00 AM</option>
                        <option>9:30 AM</option>
                        <option>10:00 AM</option>
                        <option>10:30 AM</option>
                        <option>11:00 AM</option>
                        <option>11:30 AM</option>
                        <option>12:00 PM</option>
                        <option>12:30 PM</option>
                        <option>1:00 PM</option>
                        <option>1:30 PM</option>
                        <option>2:00 PM</option>
                        <option>2:30 PM</option>
                        <option>3:00 PM</option>
                        <option>3:30 PM</option>
                        <option>4:00 PM</option>
                        <option>4:30 PM</option>
                        <option>5:00 PM</option>
                        <option>5:30 PM</option>
                        <option>6:00 PM</option>
                        <option>6:30 PM</option>
                        <option>7:00 PM</option>
                        <option>7:30 PM</option>
                        <option>8:00 PM</option>
                        <option>8:30 PM</option>
                        <option>9:00 PM</option>
                        <option>9:30 PM</option>
                        <option>10:00 PM</option>
                        <option>10:30 PM</option>
                        <option>11:00 PM</option>
                        <option>11:30 PM</option>
                    </select>
                </div>
                <div className='search-selects'>
                    <select onChange={(e) => setSchedule(day, null, e.target.value)} disabled={disabled[day]}>
                        <option selected disabled style={{display: 'none'}}>Close</option>
                        <option>12:00 AM</option>
                        <option>12:30 AM</option>
                        <option>1:00 AM</option>
                        <option>1:30 AM</option>
                        <option>2:00 AM</option>
                        <option>2:30 AM</option>
                        <option>3:00 AM</option>
                        <option>3:30 AM</option>
                        <option>4:00 AM</option>
                        <option>4:30 AM</option>
                        <option>5:00 AM</option>
                        <option>5:30 AM</option>
                        <option>6:00 AM</option>
                        <option>6:30 AM</option>
                        <option>7:00 AM</option>
                        <option>7:30 AM</option>
                        <option>8:00 AM</option>
                        <option>8:30 AM</option>
                        <option>9:00 AM</option>
                        <option>9:30 AM</option>
                        <option>10:00 AM</option>
                        <option>10:30 AM</option>
                        <option>11:00 AM</option>
                        <option>11:30 AM</option>
                        <option>12:00 PM</option>
                        <option>12:30 PM</option>
                        <option>1:00 PM</option>
                        <option>1:30 PM</option>
                        <option>2:00 PM</option>
                        <option>2:30 PM</option>
                        <option>3:00 PM</option>
                        <option>3:30 PM</option>
                        <option>4:00 PM</option>
                        <option>4:30 PM</option>
                        <option>5:00 PM</option>
                        <option>5:30 PM</option>
                        <option>6:00 PM</option>
                        <option>6:30 PM</option>
                        <option>7:00 PM</option>
                        <option>7:30 PM</option>
                        <option>8:00 PM</option>
                        <option>8:30 PM</option>
                        <option>9:00 PM</option>
                        <option>9:30 PM</option>
                        <option>10:00 PM</option>
                        <option>10:30 PM</option>
                        <option>11:00 PM</option>
                        <option>11:30 PM</option>
                    </select>
                </div>
                <div className='checkboxGroup'>
                    <label>Closed Today</label>
                    <input type='checkbox' onChange={() => disableDay(day)}/>
                </div>
            </div>
        );

        return schedule;
    }

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
            onPolicyChange,
            validPhone,
            onPhoneChange,
            onURLChange,
            onDeliveryChange,
            validAddress,
            onAddressChange,
            register,
            selectPrice1,
            selectPrice2,
            selectPrice3,
            selectPrice4,
            price1Selected,
            price2Selected,
            price3Selected,
            price4Selected,
            validPrice,
            setSchedule,
            disableDay,
            disabled,
            validSchedule
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
                <>
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
                    {<p>Initiatives</p>}
                    <div className='businessInitiativesGrid'>
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
                    </div>
                    <br />
                    {<p>Price Range</p>}
                    <div className='priceChoiceGrid'>
                        <PriceTag 
                            price={1} 
                            selectPrice={selectPrice1}
                            id={price1Selected && 'highlighted'} />
                        <PriceTag 
                            price={2} 
                            selectPrice={selectPrice2}
                            id={price2Selected && 'highlighted'} />
                        <PriceTag 
                            price={3} 
                            selectPrice={selectPrice3}
                            id={price3Selected && 'highlighted'} />
                        <PriceTag 
                            price={4} 
                            selectPrice={selectPrice4}
                            id={price4Selected && 'highlighted'} />
                    </div>
                    {!validPrice && <p id='priceInvalid'>Must choose one</p>}
                    <br />
                    {<p>Hours of Operation</p>}
                    <div className='scheduleGrid'>
                        {this.createSchedule(setSchedule, disableDay, disabled)}
                    </div>
                    {!validSchedule && <p id='scheduleInvalid'>Must complete entire schedule</p>}
                </>
                }
                {typeCustomer ? 
                <div className='step3NextButtons'>
                    <button id='skipStep3' onClick={finishSignUp}>Skip</button>
                    <button id='letsGoStep3' onClick={finishSignUp}>Let's Go</button>
                </div> :
                <>
                    <div className='step3NextButtons'>
                        <button id='skipStep3' onClick={finishSignUp}>Skip</button>
                        <button id='register' onClick={register}>Register</button>
                    </div>
                    {<p id='regDisclaimer'>Your registration will be reviewed within 24-48 hours. 
                        You will then receive an email notifying you whether your business
                        was approved.</p>}
                </>
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