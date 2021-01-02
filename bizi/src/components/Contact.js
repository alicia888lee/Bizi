import React from 'react'
import Nav from './Nav'
import question from '../images/questions.png';
import { AiOutlineFacebook, AiOutlineInstagram } from "react-icons/ai";
import { FiTwitter } from "react-icons/fi";
import { API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import Loader from 'react-loader-spinner'

class Contact extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            contactName: '',
            contactEmail: '',
            contactMessage: '',
            validEmail: true,
            validName: true,
            validMessage: true,
            messageSent: false,
            sending: false
        }
    }

    setName = (e) => {
        this.setState({
            contactName: e.target.value
        });
    }

    setEmail = (e) => {
        this.setState({
            contactEmail: e.target.value
        });
    }

    setMessage = (e) => {
        this.setState({
            contactMessage: e.target.value
        });
    }

    validateInputs = () => {
        const { contactEmail, contactMessage, contactName } = this.state;
        var re = new RegExp('\\S+@\\S+\\.\\S+');
        const validEmail = re.test(contactEmail);
        this.setState({
            validEmail: validEmail,
            validMessage: contactMessage,
            validName: contactName
        });
    }

    sendEmail = async(e) => {
        e.preventDefault();
        const { contactName, contactEmail, validEmail, contactMessage, validName, validMessage } = this.state;

        var noneValid = !(
            contactEmail
            || contactName
            || contactMessage
        );

        var inputsValid = (
            validName
            && validMessage
            && validEmail
        );

        if (inputsValid && !noneValid) {
            this.setState({
                sending: true
            });
            
            try {
                var send = await API.graphql({
                    query: mutations.sendEmail,
                    variables: {
                        recipientEmail: 'thebiziteam@gmail.com', 
                        subject: 'New Contact Message', 
                        body: `You have received a new message:\n
                            Name: ${contactName}\n
                            Email: ${contactEmail}\n
                            Message: ${contactMessage}
                        `}
                });
                console.log(send);
            }
            catch (error) {
                console.log(error);
            }
            this.setState({
                messageSent: true
            });
        }
        else if (noneValid) {
            this.setState({
                validEmail: false,
                validName: false,
                validMessage: false
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { contactEmail, contactMessage, contactName } = this.state;

        var updateCondition = (
            contactEmail !== prevState.contactEmail
            || contactMessage !== prevState.contactMessage
            || contactName !== prevState.contactName
        );

        if (updateCondition) {
            this.validateInputs();
        }
    }

    render() {
        const { validEmail, validMessage, validName, sending, messageSent } = this.state;

        return (
            <>
                {!messageSent ?
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
                                    <input className="contactName" id={!validName && 'invalidInput'} type="text" name="username" placeholder="Your Name" onChange={this.setName}/>
                                    <input className="contactEmail" id={!validEmail && 'invalidInput'} type="text" name="email" placeholder="Your E-mail" onChange={this.setEmail}/>
                                </div>

                                <textarea rows="4" className="contactMsg" id={!validMessage && 'invalidInput'} placeholder="Your Message" onChange={this.setMessage}></textarea>
                                <button className="contactBtn" onClick={this.sendEmail}>Send</button>
                                {sending && <Loader type='TailSpin' color='#385FDC' height={40} />}
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
                </div> :
                <div>
                    <Nav light={false} />
                    <div className='contactMsgSent'>
                        <h2>Your message has been received and will be reviewed
                            by a member of our team shortly.
                        </h2>
                    </div>
                    <div className='termsAgreement'>
                        <a className="smallText" href="#">Terms of Agreement</a>   
                    </div>
                </div>
                }
            </>
        )
    }
}

export default Contact