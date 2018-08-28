import React from "react";
import { Button, Text, View } from "react-native";

import utils from "./utils.js";
import styles from "./styles.js";

export default class ParkingStatus extends React.Component {
  constructor(props) {
    super(props);
    const { currentTime } = props;
    this.state = {
      currentTime
    };
    this.updateTime = this.updateTime.bind(this);
  }

  componentDidMount() {
    this.updateProcess = setInterval(this.updateTime, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateProcess);
  }

  updateTime() {
    const { currentTime } = this.state;
    this.setState({ currentTime: currentTime + 1000 });
  }

  render() {
    const {
      parkedExpiration,
      parkedNeighborhood,
      findCar,
      unpark
    } = this.props;
    const { currentTime } = this.state;
    return (
      <View style={styles.bottom}>
        <Text style={styles.text}>
          Your are parked in {parkedNeighborhood}.{"\n"} Time remaining:{" "}
          {utils.convertMillis(parkedExpiration - currentTime)}
        </Text>
        <View style={styles.row}>
          <Button style={styles.button} title={"Go to car"} onPress={findCar} />
          <Button style={styles.button} title={"Unpark"} onPress={unpark} />
        </View>
      </View>
    );
  }
}
