import React from 'react'
import environmentImg from '../images/environment.png';
import businessImg from '../images/pexels-ksenia-chernaya-3965557.jpg'
import heartImg from '../images/heart_hand.png';
import communityImg from '../images/community.png';
import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations'
import { API, Auth } from 'aws-amplify'
import Loader from 'react-loader-spinner'
import { withRouter } from 'react-router-dom'

class Recommendation extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            recommendationIDs: [],
            businesses: [],
            recommendations: [],
            loading: false
        }
    }

    generateRecommendations = () => {
        const { recommendationIDs, businesses } = this.state;
        console.log(recommendationIDs);
        var recommendationBusinesses = recommendationIDs.map((id) => {
            return businesses.filter((item) => item?.id == id)[0];
        });

        var iconDict = {
            'Sustainability': {
              id: 'searchEnvironment',
              img: environmentImg
            },
            'Ethical Supply Chain': {
              id: 'searchHeart',
              img: heartImg
            },
            'Diversity Initiatives': {
              id: 'searchCommunity',
              img: communityImg
            }
        };

        console.log(recommendationBusinesses);
        
        var recommendationList = recommendationBusinesses.map((item, index) => 
            <div 
                className='recItem' 
                style={{backgroundImage: `url(${businessImg})`}}
                onClick={() => this.props.history.push({pathname: `/search/${item?.id}`, state: {business: item}})}
                key={index}
                >
                <h1>{item?.businessName}</h1>
                <div className='recImgs'>
                    {item?.initiatives.map((init, index) => 
                        Object.keys(iconDict).includes(init) && <img src={iconDict[init]?.img} key={index} />
                    )}
                </div>
            </div>
        );
        this.setState({
            recommendations: recommendationList,
            loading: false
        });
    }

    invokeRecommendationLambda = async() => {
        this.setState({
            loading: true
        });
        var businesses = [];
        // get list of businesses
        try {
            var businessQuery = await API.graphql({
                query: queries.listBusinesss
            });
            businesses = businessQuery?.data?.listBusinesss?.items;
        }
        catch (error) {
            console.log(error);
        }
        businesses = businesses.filter((item) => item.approved);
        this.setState({
            businesses: businesses
        });
        console.log(businesses);

        // get current user, if any
        try {
            var currUser = await Auth.currentAuthenticatedUser();
        }
        catch (error) {
            console.log(error);
        }
        console.log(currUser);

        var userPreferences;
        if (!currUser) {
            userPreferences = []
        }
        // get user preferences if user exists
        else {
            var userEmail = currUser?.attributes?.email;
            try {
                var userQuery = await API.graphql({
                    query: queries.getUser,
                    variables: {userEmail: userEmail}
                });
            }
            catch (error) {
                console.log(error);
            }
            userPreferences = userQuery?.data?.getUser?.userPreferences;
        }
        // get business attributes
        var businessAttributes = [];
        for (var index in businesses) {
            var business = [businesses[index]?.id];
            business = business.concat(businesses[index]?.initiatives);
            businessAttributes.push(JSON.stringify(business));
        }
        
        // call lambda function
        try {
            var recommendationIDs = await API.graphql({
                query: mutations.recommend,
                variables: {preferences: userPreferences, attributes: businessAttributes}
            });
        }
        catch (error) {
            console.log(error);
        }
        console.log(recommendationIDs);
        this.setState({
            recommendationIDs: recommendationIDs?.data?.recommend
        });
    }

    async componentDidMount() {
        await this.invokeRecommendationLambda();
        this.generateRecommendations();
    }

    render() {
        const { loading, recommendations } = this.state;

        return(
            <div className="recs">
                <h1>Recommended for you</h1>
                {loading ? <Loader type='TailSpin' color='white' height={40} /> :
                <div className="recItems">
                    {recommendations}
                </div>
                }
            </div>
        )
    }
}

export default withRouter(Recommendation);