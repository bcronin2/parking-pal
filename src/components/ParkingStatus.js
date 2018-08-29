import React from "react";
import { Button, Text, View } from "react-native";

import timing from "../services/timing.js";
import styles from "../styles/main.js";

export default class ParkingStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { timeRemaining: this.getTimeRemaining() };
    this.updateTime = this.updateTime.bind(this);
  }

  componentDidMount() {
    this.updateTime();
    this.setState({ updateProcess: setInterval(this.updateTime, 1000) });
  }

  componentWillUnmount() {
    const { updateProcess } = this.state;
    clearInterval(updateProcess);
  }

  updateTime() {
    this.setState({
      timeRemaining: this.getTimeRemaining()
    });
  }

  getTimeRemaining() {
    const { parkedExpiration } = this.props;
    return timing.convertMillis(parkedExpiration - new Date().getTime());
  }

  render() {
    const { parkedNeighborhood, findCar, unpark } = this.props;
    const { timeRemaining } = this.state;
    return (
      <View style={styles.bottom}>
        <Text style={styles.text}>
          Your are parked in {parkedNeighborhood}.{"\n"} Time remaining:{" "}
          {timeRemaining}
        </Text>
        <View style={styles.row}>
          <Button style={styles.button} title={"Go to car"} onPress={findCar} />
          <Button style={styles.button} title={"Unpark"} onPress={unpark} />
        </View>
      </View>
    );
  }
}
