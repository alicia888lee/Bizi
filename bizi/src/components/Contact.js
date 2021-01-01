import React from 'react'
import Nav from './Nav'
import question from '../images/questions.png';
import { AiOutlineFacebook, AiOutlineInstagram } from "react-icons/ai";
import { FiTwitter } from "react-icons/fi";
import { API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'

class Contact extends React.Component {
    constructor(props) {
        super(props)
    }

    sendEmail = async(e) => {
        e.preventDefault();
        // try {
        //     var send = await API.graphql({
        //         query: mutations.sendEmail,
        //         variables: {recipientEmail: 'thebiziteam@gmail.com', subject: 'Test Subject', body: 'Test Body'}
        //     });
        //     console.log(send);
        // }
        // catch (error) {
        //     console.log(error);
        // }
    }

    render() {

        return (
            <div>
                <Nav light={false} />
                <h1 className="contactHeader">Contact Us</h1>
                <div className="contact">
                    <span>
                        <img id="contactImg" src={question} />
                    </span>
                    <div>
                        <p>Say hi!</p>
                        <form>
                            <div className="contactInputs">
                                <input className="contactName" type="text" name="username" placeholder="Your Name"/>
                                <input className="contactEmail" type="text" name="email" placeholder="Your E-mail"/>
                            </div>

                            <textarea rows="4" className="contactMsg" placeholder="Your Message"></textarea>
                            <button className="contactBtn" onClick={this.sendEmail}>Send</button>
                        </form>

                        <div className="contactFooter">
                            <div className="contactIcons">
                                <AiOutlineFacebook className="contact-icon"/>
                                <AiOutlineInstagram className="contact-icon"/>
                                <FiTwitter className="contact-icon"/>
                            </div>
                            <h2>1111 Campus Dr., Evanston, IL 60201</h2>
                        </div>
                    </div>
                </div>

                <div className='termsAgreement'>
                    <a className="smallText" href="#">Terms of Agreement</a>   
                </div>              
            </div>
        )
    }
}

export default Contact