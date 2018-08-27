import React from "react";
// import { Navigator } from "react-native-deprecated-custom-components";
import { createStackNavigator } from "react-navigation";

import LandingScreen from "./components/Landing.js";
import MapScreen from "./components/Map.js";

const Navigation = createStackNavigator({
  Landing: {
    screen: LandingScreen
  },
  Map: {
    screen: MapScreen
  }
});

export default class App extends React.Component {
  render() {
    return <Navigation />;
  }
}
