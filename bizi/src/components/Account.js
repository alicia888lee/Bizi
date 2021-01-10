import React, { Component } from "react"
import Nav from './Nav'
import Footer from './Footer'
import { API, Auth } from 'aws-amplify'
import { withRouter } from 'react-router-dom'
import * as queries from '../graphql/queries';
import AccountCustomer from './AccountCustomer';
import AccountBusiness from './AccountBusiness'

class Account extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentUser: null,
            currAuthUser: null,
        }
    }

    getCurrentUser = async() => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            console.log(user);
            return user;
        }
        catch (error) {
            console.log('error checking auth', error);
        }
    }

    async componentDidMount() {
        const currentUser = await this.getCurrentUser();
        console.log(currentUser);
        if (currentUser) {
            try {
                var user = await API.graphql({
                    query: queries.getUser,
                    variables: {userEmail: currentUser?.attributes?.email}
                });
            }
            catch (error) {
                console.log(error);
            }
            this.setState({
                currAuthUser: currentUser,
                currentUser: user
            });
        }
        else {
          this.props.history.push('/login');
        }
    }

    render() {
        const { currentUser, currAuthUser } = this.state;
        console.log('ya yeet');
        console.log(this.state);
        return (
            <div className="account">
                <Nav />
                {currentUser?.data?.getUser?.userType === 'Customer' && <AccountCustomer user={currentUser} authUser={currAuthUser} />}
                {currentUser?.data?.getUser?.userType === 'Business' && <AccountBusiness user={currentUser} authUser={currAuthUser} />}
                <Footer />
            </div>
        )
    }
}

export default withRouter(Account);