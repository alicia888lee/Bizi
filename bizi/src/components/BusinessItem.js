import React from "react"
import Map from './Map'
import AddReview from './AddReview'
import BusinessInfo from './BusinessInfo'
import { withRouter } from "react-router-dom";
import { Component } from "react";
import { API, Storage } from 'aws-amplify'
import * as queries from '../graphql/queries';
import Loader from 'react-loader-spinner';

class BusinessItem extends Component {
    constructor(props) {
      super(props)

      this.state = {
        business: this.props.location?.state?.business,
        reviewImgs: [],
        infoLoading: false
      }
      this.handler = this.handler.bind(this)
    }

    generateReviewImgs = async() => {      
      if(this.state?.business?.reviews){
        console.log(this.state.business);
        const reviews = this.state?.business?.reviews;
        // const reviewImgs = reviews.map((review) =>           
        //     <AmplifyS3Image imgKey={review.imgPath} className="business-photo" /> );
        try {
          var imgURLs = await Promise.all(reviews.map(async(review) => {
            if (review?.imgPath ) {
              return await Storage.get(review?.imgPath,
                { level: 'public' }
              );
            }
            return null;
        }))}
        catch (error){
          console.log(error);
        }
        console.log(imgURLs);
        const reviewImgs = imgURLs.filter((img) => img).map((img) => 
          <img src={img} className='business-photo' />
        )
        console.log(reviewImgs);
        let rows = []
        let cols = []
        if (reviewImgs.length > 0) {
          for (let i = 0; i < 8; i++) {
            cols.push(reviewImgs[i]);
            if((i + 1) % 4 === 0){
              rows.push(<div className="business-row">
                {cols}
              </div>)
              cols = []
            }
          }
        }
        this.setState({reviewImgs: rows})        
      }
    }

    getUpdatedBusinessInformation = async(id) => {
      this.setState({
        infoLoading: true
      });
      try {
        var business = await API.graphql({
          query: queries.getBusiness,
          variables: {id: id}
        });
      }
      catch (error) {
        console.log(error);
      }
      this.setState({
        business: business?.data?.getBusiness,
        infoLoading: false
      });
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
      else {
        this.getUpdatedBusinessInformation(business.id);
      }
      this.generateReviewImgs();
    }    

    componentDidUpdate(prevProps, prevState) {
      const { location } = this.props;
      if (prevProps?.location?.state?.business !== location?.state?.business) {
        this.getUpdatedBusinessInformation(location?.state?.business?.id);
      }
      if (prevState.business !== this.state.business) {
        this.generateReviewImgs();
      }
    }

    handler(val){
      this.setState({
        business: val
      })
    }

    render() {
      const { business, reviewImgs, infoLoading } = this.state;
      console.log('rendering business item', business);
      console.log(reviewImgs);
      return (
        <>
        {infoLoading ? <Loader type="TailSpin" color="#385FDC" height={40} /> :
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
              <AddReview business={business} handler={this.handler} />   
          </>
          }
        </>
      )
  }
}

export default withRouter(BusinessItem);