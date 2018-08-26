import axios from "axios";
import _ from "lodash";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Overlay, PROVIDER_GOOGLE } from "react-native-maps";

import Block from "./components/Block.js";

const parkingEndpoint = "http://localhost:3000/api/parking";

const viewDimension = 0.02;

const defaultRegion = {
  latitude: 37.7836839,
  longitude: -122.40898609999999,
  latitudeDelta: viewDimension,
  longitudeDelta: viewDimension
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: defaultRegion,
      center: {
        latitude: defaultRegion.latitude,
        longitude: defaultRegion.longitude
      }
    };
    this.onRegionChange = this.onRegionChange.bind(this);
    this.updateParkingInfo = _.debounce(this.getParkingInfo, 500, {
      leading: false
    });
  }

  componentDidMount() {
    this.getParkingInfo();
    navigator.geolocation.getCurrentPosition(
      location => this.setState(location),
      err => console.log(err)
    );
  }

  onRegionChange(region) {
    this.setState(
      {
        region,
        center: { latitude: region.latitude, longitude: region.longitude }
      },
      this.updateParkingInfo
    );
  }

  getParkingInfo() {
    const { region } = this.state;
    axios
      .get(parkingEndpoint, {
        params: {
          llLatitude: region.latitude - 0.5 * viewDimension,
          llLongitude: region.longitude - 0.5 * viewDimension,
          urLatitude: region.latitude + 0.5 * viewDimension,
          urLongitude: region.longitude + 0.5 * viewDimension
        }
      })
      .then(
        results => this.setState({ blocks: results.data }),
        err => console.log(err)
      );
  }

  render() {
    const { region, center, blocks } = this.state;
    const currentTime = new Date("August 22, 2018 9:00");
    const dayIndexInWeek = currentTime.getDay();
    const dayIndexInMonth = Math.floor(currentTime.getDate() / 7);
    const hour = currentTime.getHours();
    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.container}
        initialRegion={defaultRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        onRegionChange={this.onRegionChange}
      >
        {blocks &&
          blocks.map(block => (
            <Block
              key={block.id}
              center={center}
              block={block}
              currentTime={currentTime}
              dayIndexInWeek={dayIndexInWeek}
              dayIndexInMonth={dayIndexInMonth}
              hour={hour}
            />
          ))}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
