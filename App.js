import axios from "axios";
// import _ from "lodash";
import React, { Component } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Navigator } from "react-native-deprecated-custom-components";

import Map from "./components/Map.js";

console.log(Map);
console.log(Navigator);

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
