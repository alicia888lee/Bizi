import React, { Component } from 'react';
import { FiMapPin } from "react-icons/fi";
import GoogleMapReact from 'google-map-react';
import Geocode from 'react-geocode';
import { API } from 'aws-amplify';
import * as mutations from '../graphql/mutations';
import { credentialsPromise } from '../index';
import Loader from 'react-loader-spinner';

const addressToCoordinate = async(business) => {
  var promise = await credentialsPromise;
  var apiKey = promise?.data?.getCredentials?.geocodeAPIKey;
  console.log(apiKey);
  console.log(business);
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
      center: {},
      mapAPIKey: null
    }
  }

  generateLocationPins = async() => {
    const { filteredBusinesses } = this.props;
    console.log(filteredBusinesses);
    var locationPins = await Promise.all(filteredBusinesses.map(async(business, index) => {
        // if (filteredBusinesses.length == 0) {
        //   return null;
        // }

        console.log(business);

        var lat = null;
        var lng = null;
        var coords = null;

        if (business?.lat && business?.lng) {
          lat = business?.lat;
          lng = business?.lng;
        }
        else if (business) {
          console.log('invoking address to coordinate');
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
      },
    });
    
  }

  async componentDidMount() {
    await this.getMapKey();
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

  getMapKey = async() => {
    var promise = await credentialsPromise;
    var mapAPIKey = promise?.data?.getCredentials?.mapAPIKey;
    console.log(mapAPIKey);
    this.setState({
      mapAPIKey: mapAPIKey
    });
  }

  render() {
    const { height, modal } = this.props;
    const { locationPins, center, mapAPIKey } = this.state;
    let heightNum = modal ? `${height}vw`: `${height}%`;
    if (mapAPIKey) {
      console.log(locationPins);
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
    );}
    return <Loader type='TailSpin' color='#385FDC' height={40} />
  }
}
 
export default Map;
