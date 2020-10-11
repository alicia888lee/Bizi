import React, { Component } from 'react';
import { FiMapPin } from "react-icons/fi";
import GoogleMapReact from 'google-map-react';

const location = {
    address: '11709 Benson Ave, Evanston, IL 60201',
    lat: 42.048946,       
    lng: -87.683032
}
const LocationPin = ({ text }) => (
    <div className="pin">
      <FiMapPin className="pin-icon" />      
      <p className="pin-text">{text}</p>
    </div>
  )
  
class Map extends Component {
   render() {
    return (      
      <div style={{ height: '100%', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCMZlXIU9MJpfovWRwU6LvyFGtH1X3ljpY' }}
          defaultCenter={location}
          defaultZoom={18}
        >
          <LocationPin
            lat={location.lat}
            lng={location.lng}
            text="Bat 17"
          />
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default Map;
