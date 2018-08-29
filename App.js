import React from "react";
import { createStackNavigator } from "react-navigation";

import LandingScreen from "./src/components/Landing.js";
import MapScreen from "./src/components/Map.js";

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
