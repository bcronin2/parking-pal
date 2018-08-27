import React from "react";
import { Navigator } from "react-native-deprecated-custom-components";

import Landing from "./components/Landing.js";
import Map from "./components/Map.js";

const routes = [{ title: "Landing", index: 0 }, { title: "Map", index: 1 }];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
  }

  renderScene(route, navigator) {
    const { title } = route;
    if (title === "Landing") {
      return <Landing navigator={navigator} />;
    } else if (title === "Map") {
      return <Map navigator={navigator} />;
    }
  }

  render() {
    return (
      <Navigator initialRoute={routes[0]} renderScene={this.renderScene} />
    );
  }
}
