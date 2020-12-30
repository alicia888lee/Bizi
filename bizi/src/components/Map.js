import React, { Component } from 'react';
import { FiMapPin } from "react-icons/fi";
import GoogleMapReact from 'google-map-react';
import Geocode from 'react-geocode';
import { API } from 'aws-amplify';
import * as mutations from '../graphql/mutations';
import { geocodeAPIKey, mapAPIKey } from '../internal/keys';

const addressToCoordinate = async(business) => {
  const apiKey = geocodeAPIKey;
  try {
    const response = await Geocode.fromAddress(business?.address, apiKey);
    return response.results[0].geometry.location;
  } 
  catch (error) {
    console.log('error getting coordinates', error);
  }
}

const LocationPin = ({ text }) => (
    <div className="pin">
      <FiMapPin className="pin-icon" />      
      <p className="pin-text">{text}</p>
    </div>
  )
  
class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationPins: [],
      center: {}
    }
  }

  generateLocationPins = async() => {
    const { filteredBusinesses } = this.props;
    console.log(filteredBusinesses);
    var locationPins = await Promise.all(filteredBusinesses.map(async(business, index) => {
        if (filteredBusinesses.length == 0) {
          return null;
        }  

        var lat = null;
        var lng = null;
        var coords = null;

        if (business?.lat && business?.lng) {
          lat = business?.lat;
          lng = business?.lng;
        }
        else {
          coords = await addressToCoordinate(business);
          lat = coords?.lat;
          lng = coords?.lng;
          var updatedBusiness = {
            ...business,
            lat: coords?.lat,
            lng: coords?.lng
          };
          try {
              var update = await API.graphql({
              query: mutations.updateBusiness,
              variables: {input: updatedBusiness}
            });
            console.log(update)
          }
          catch(error) {
            console.log(error);
          }
        }
        var text = business?.businessName;
        return (
          <LocationPin
            key={index}
            lat={lat}
            lng={lng}
            text={text}
          />
        );
      })
    );
    this.setState({
      locationPins: locationPins
    });
  }

  generateCenter = () => {
    const { locationPins } = this.state;
    const { filteredBusinesses } = this.props;
    console.log(filteredBusinesses);
    if (filteredBusinesses.length == 0) {
      return null;
    }

    var lats = locationPins.map(loc => loc?.props?.lat);
    var lngs = locationPins.map(loc => loc?.props?.lng);
    var avgLat = lats.reduce(
      (sum, val) => sum + val, 0
    ) / lats.length;
    var avgLng = lngs.reduce(
      (sum, val) => sum + val, 0
    ) / lngs.length;

    this.setState({
      center: {
        lat: avgLat,
        lng: avgLng
      }
    });
    
  }

  async componentDidMount() {
    await this.generateLocationPins(); 
    this.generateCenter();
  }

  async componentDidUpdate(prevProps) {
    const { filteredBusinesses } = this.props;
    if (prevProps.filteredBusinesses !== filteredBusinesses) {
      await this.generateLocationPins();
      this.generateCenter();
    }
  }

  render() {
    const { height } = this.props;
    const { locationPins, center } = this.state;
    let heightNum = `${height}%`;
    
    return (      
      <div style={{ height: heightNum, width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: mapAPIKey }}
          center={center}
          defaultZoom={14}
        >
          {locationPins}
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default Map;
