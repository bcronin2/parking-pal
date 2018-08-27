import React from "react";
import { Navigator } from "react-native-deprecated-custom-components";

import Landing from './components/Landing.js';
import Map from "./components/Map.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
  }

  renderScene(route, navigator) {
    const { id } = route;
    if (id === "Map") {
      return <Map navigator={navigator} />;
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ id: "Map", name: "Map" }}
        renderScene={this.renderScene}
      />
    );
  }
}
