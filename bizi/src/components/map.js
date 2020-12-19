import React, { Component } from 'react';
import { FiMapPin } from "react-icons/fi";
import GoogleMapReact from 'google-map-react';
import Geocode from 'react-geocode';

const addressToCoordinate = async(address) => {
  const apiKey = 'AIzaSyCN1PXw74R2eqXAG8ounDYCIexsXXSpKK4';
  try {
    const response = await Geocode.fromAddress(address, apiKey);
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
    const { businesses } = this.props;
    var locationPins = await Promise.all(businesses.map(async(business) => {
        var coords = await addressToCoordinate(business?.address);
        var lat = coords?.lat;
        var lng = coords?.lng;
        var text = business?.businessName;
        return (
          <LocationPin
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

  render() {
    const { height } = this.props;
    const { locationPins, center } = this.state;
    let heightNum = `${height}%`

    return (      
      <div style={{ height: heightNum, width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCMZlXIU9MJpfovWRwU6LvyFGtH1X3ljpY' }}
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
