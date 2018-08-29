import React from "react";
import { Button, Text, View } from "react-native";

import timing from "../services/timing.js";
import styles from "../styles/main.js";

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
    this.setState({ updateProcess: setInterval(this.updateTime, 1000) });
  }

  componentWillUnmount() {
    const { updateProcess } = this.state;
    clearInterval(updateProcess);
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
    const { timeRemaining } = timing.convertMillis(
      parkedExpiration - currentTime
    );
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
