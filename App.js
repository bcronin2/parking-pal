import axios from "axios";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const parkingEndpoint = "http://localhost:3000/api/parking";

const defaultRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02
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
  }

  componentDidMount() {
    this.getParkingInfo();
    // navigator.geolocation.getCurrentPosition(
    //   location => this.setState(location),
    //   err => console.log(err)
    // );
  }

  onRegionChange(region) {
    this.setState({
      region,
      center: { latitude: region.latitude, longitude: region.longitude }
    });
  }

  getParkingInfo() {
    const { region } = this.state;
    axios
      .get(parkingEndpoint, {
        params: {
          llLatitude: region.latitude - 0.5 * region.latitudeDelta,
          llLongitude: region.longitude - 0.5 * region.longitudeDelta,
          urLatitude: region.latitude + 0.5 * region.latitudeDelta,
          urLongitude: region.longitude + 0.5 * region.longitudeDelta
        }
      })
      .then(results => this.setState({ blocks: results.data }));
  }

  render() {
    const { region, center, blocks } = this.state;
    console.log(center);
    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.container}
        initialRegion={defaultRegion}
        onRegionChange={this.onRegionChange}
      >
        <Marker
          coordinate={center}
          title="Marker"
          description="Description"
          // image={require("./assets/car_icon.png")}
        />
        {blocks &&
          blocks.map(block => (
            <Polyline
              coordinates={block.coordinates}
              strokeColor="#000"
              strokeWidth={1}
            />
          ))}
      </MapView>
      // <View style={styles.container}>
      //   <Text>Open up App.js to start working on your app!</Text>
      //   <Text>Changes you make will automatically reload.</Text>
      //   <Text>Shake your phone to open the developer menu.</Text>
      // </View>
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
