import React from "react"
import Map from './Map'
import AddReview from './AddReview'
import BusinessInfo from './BusinessInfo'
import { withRouter } from "react-router-dom";
import { Component } from "react";
import { API } from 'aws-amplify'
import * as queries from '../graphql/queries';
import {AmplifyS3Image} from "@aws-amplify/ui-react";

class BusinessItem extends Component {
    constructor(props) {
      super(props)

      this.state = {
        business: this.props.location?.state?.business,
        reviewImgs: []
      }
    }

    generateReviewImgs = async() => {      
      if(this.state?.business?.reviews){
        const reviews = this.state?.business?.reviews;
        const reviewImgs = reviews.map((review) =>           
            <AmplifyS3Image imgKey={review.imgPath} className="business-photo" /> );
        
        let rows = []
        let cols = []
        for (let i = 0; i < 8; i++) {
          cols.push(reviewImgs[i]);
          if(i % 4 === 0){
            rows.push(<div className="business-row">
              {cols}
            </div>)
            cols = []
          }
        }
        this.setState({reviewImgs: rows})        
      }
    }    
    
    async componentDidMount() {
      this.generateReviewImgs();
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
      const { business, reviewImgs } = this.state;
      console.log('rendering business item', business);
      return (
          <>            
              <div className="description">
                  <div className="map">
                    <Map height={50} filteredBusinesses={[business]}/>
                    <div className="business-gallery">
                        {reviewImgs.length > 0 ? reviewImgs : <div>This business has no images.</div>}                      
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