import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const defaultPosition = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: defaultPosition,
      center: {
        latitude: defaultPosition.latitude,
        longitude: defaultPosition.longitude
      }
    };
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      location => this.setState(location),
      err => console.log(err)
    );
  }

  onRegionChange(region) {
    console.log(region);
    this.setState({
      center: { latitude: region.latitude, longitude: region.longitude }
    });
  }

  render() {
    const { region, center } = this.state;
    console.log(center);
    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.container}
        initialRegion={region}
        onRegionChange={this.onRegionChange}
      >
        <Marker
          coordinate={center}
          title="Marker"
          description="Description"
          // image={require("./assets/car_icon.png")}
        />
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
