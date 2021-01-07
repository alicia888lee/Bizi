import React from "react"
import Map from './Map'
import AddReview from './AddReview'
import BusinessInfo from './BusinessInfo'
import { withRouter } from "react-router-dom";
import testImg from '../images/pexels-maria-gloss-4197693.jpg';
import { Component } from "react";
import { API } from 'aws-amplify'
import * as queries from '../graphql/queries';

class BusinessItem extends Component {
    constructor(props) {
      super(props)

      this.state = {
        business: this.props.location?.state?.business
      }
    }
    
    async componentDidMount() {
      const { business } = this.state;
      // console.log(location?.state?.business);
      // if url accessed directly, check database for business based on id
      if (!business) {
        var urlID = window.location.pathname.split('/')[2];
        try {
          var businessQuery = await API.graphql({
            query: queries.listBusinesss
          });
          var listBusinesses = businessQuery?.data?.listBusinesss?.items?.filter(item => item.approved);
          var retrieved = listBusinesses.filter((item) => item.id == urlID)[0];
          if (retrieved) {
            this.setState({
              business: retrieved
            });
          }
          else {
            this.props.history.push('/search');
          }
        }
        catch (error) {
          console.log(error);
        }
      }
    }

    componentDidUpdate(prevProps) {
      const { location } = this.props;
      if (prevProps?.location?.state?.business !== location?.state?.business) {
        this.setState({
          business: location?.state?.business
        });
      }
    }

    render() {
      const { business } = this.state;
      console.log('rendering business item', business);
      return (
          <>            
              <div className="description">
                  <div className="map">
                  <Map height={50} filteredBusinesses={[business]}/>
                  <div className="business-gallery">
                      <div className="business-row">
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                      </div>           
                      <div className="business-row">
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                          <img src={testImg} className="business-photo"/>
                      </div>   
                  </div>
                  </div>
                  <BusinessInfo business={business}/>        
              </div>            
              <AddReview business={business}/>   
          </>
      )
  }
}

export default withRouter(BusinessItem);