import axios from "axios";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import Block from "./Block.js";

const parkingInfoEndpoint = "http://localhost:3000/api/parking";
const userParkingEndpoint = "http://localhost:3000/api/users";

const defaultDimension = 0.02;

const defaultRegion = {
  latitude: 37.7836839,
  longitude: -122.40898609999999,
  latitudeDelta: defaultDimension,
  longitudeDelta: 0.5 * defaultDimension
};

const days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

const millisPerMinute = 60 * 1000;
const millisPerHour = 60 * millisPerMinute;
const maxParking = 72 * millisPerHour;

const convertMillis = millis => {
  let hours = Math.floor(millis / millisPerHour);
  millis %= millisPerHour;
  let minutes = Math.floor(millis / millisPerMinute);
  millis %= millisPerMinute;
  let seconds = Math.floor(millis / 1000);
  return `${hours}hr, ${minutes}min, ${seconds}s`;
};

// TODO: Clean up state--don't need to many values

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          params: { user }
        }
      }
    } = props;
    const now = new Date("August 22, 2018 9:00");
    this.state = {
      user,
      currentTime: now.getTime(),
      dayIndexInWeek: now.getDay(),
      dayIndexInMonth: Math.floor(now.getDate() / 7),
      currentHour: now.getHours(),
      region: defaultRegion,
      selectedBlock: null,
      selectedExpiration: null,
      parkedCoordinates:
        (user.latitude &&
          user.longitude && {
            latitude: user.latitude,
            longitude: user.longitude
          }) ||
        null,
      parkedExpiration: user.expiration
    };
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.selectBlock = this.selectBlock.bind(this);
    this.park = this.park.bind(this);
    this.unpark = this.unpark.bind(this);
    this.findCar = this.findCar.bind(this);
  }

  componentDidMount() {
    const { parkedCoordinates } = this.state;
    if (parkedCoordinates) {
    } else {
      this.getParkingInfo();
    }
  }

  onRegionChange(region) {
    this.setState({
      region
    });
  }

  onRegionChangeComplete() {
    this.getParkingInfo();
  }

  getCurrentBoundary() {
    const { region } = this.state;
    const viewDimension = Math.min(defaultDimension, region.latitudeDelta);
    return {
      llLatitude: region.latitude - 0.5 * viewDimension,
      llLongitude: region.longitude - 0.5 * viewDimension,
      urLatitude: region.latitude + 0.5 * viewDimension,
      urLongitude: region.longitude + 0.5 * viewDimension
    };
  }

  getParkingInfo() {
    axios
      .get(parkingInfoEndpoint, {
        params: this.getCurrentBoundary()
      })
      .then(
        results => this.setState({ blocks: results.data }),
        err => console.log(err)
      );
  }

  selectBlock(selectedBlock) {
    const selectedExpiration = this.getExpiration(selectedBlock);
    this.setState({ selectedBlock, selectedExpiration });
  }

  park() {
    const { selectedBlock, selectedExpiration, currentTime, user } = this.state;
    const selectedCoordinates = {
      latitude: selectedBlock.ll_lat,
      longitude: selectedBlock.ll_lon
    };
    this.setState(
      {
        parkedCoordinates: selectedCoordinates,
        parkedExpiration: selectedExpiration
      },
      () => {
        axios.patch(`${userParkingEndpoint}/${user.id}/park`, {
          coordinates: selectedCoordinates,
          expiration: Math.min(
            selectedExpiration.getTime(),
            currentTime + maxParking
          )
        });
      }
    );
  }

  unpark() {
    const {
      user: { id }
    } = this.state;
    this.setState(
      {
        parkedCoordinates: null,
        parkedExpiration: null
      },
      () => {
        axios.patch(`${userParkingEndpoint}/${id}/unpark`);
      }
    );
  }

  findCar() {
    const { parkedCoordinates } = this.state;
    this._map.animateToCoordinate(parkedCoordinates, 2);
  }

  getExpiration(block) {
    const { currentTime } = this.state;
    let testDate = new Date(currentTime);
    testDate.setHours(0, 0, 0, 0);
    while (true) {
      const sweepDay = block.days.indexOf(days[testDate.getDay()]) >= 0;
      const sweepWeek = block.weeks[Math.floor(testDate.getDate() / 7)] === "Y";
      if (sweepDay && sweepWeek) {
        expiration = testDate.getTime();
        if (expiration + block.start_hour * millisPerHour > currentTime) {
          testDate.setHours(block.start_hour);
          return testDate;
        } else if (expiration + block.end_hour * millisPerHour > currentTime) {
          return null;
        }
      }
      testDate.setDate(testDate.getDate() + 1);
    }
  }

  render() {
    const {
      currentTime,
      dayIndexInWeek,
      dayIndexInMonth,
      currentHour,
      blocks,
      selectedBlock,
      selectedExpiration,
      parkedCoordinates,
      parkedExpiration
    } = this.state;
    const addressInfo = selectedBlock
      ? `${selectedBlock.fadd}-${selectedBlock.toadd} ${
          selectedBlock.street_name
        }`
      : null;
    const expirationInfo = selectedExpiration
      ? `Free until ${selectedExpiration.toString().split("GMT")[0]}`
      : "Parking prohibited";
    const selectedBlockInfo =
      addressInfo && `${addressInfo}\n${expirationInfo}`;

    return (
      <View style={styles.container}>
        <MapView
          ref={map => (this._map = map)}
          provider={null}
          style={styles.map}
          initialRegion={defaultRegion}
          loadingEnabled={true}
          showsUserLocation={true}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          {blocks &&
            blocks.map(block => (
              <Block
                key={block.id}
                block={block}
                selectedId={selectedBlock && selectedBlock.id}
                dayIndexInWeek={dayIndexInWeek}
                dayIndexInMonth={dayIndexInMonth}
                currentHour={currentHour}
                pressHandler={this.selectBlock}
              />
            ))}
          {parkedCoordinates && (
            <Marker title="My car" coordinate={parkedCoordinates} />
          )}
        </MapView>
        {selectedBlock && (
          <View style={styles.top}>
            <Text style={styles.text}>{selectedBlockInfo}</Text>
            {selectedExpiration && (
              <Button title={"Park here"} onPress={this.park} />
            )}
          </View>
        )}
        {parkedCoordinates && (
          <View style={styles.bottom}>
            <Text style={styles.text}>
              Your car is currently parked.
              {"\n"} Time remaining:{" "}
              {convertMillis(parkedExpiration - currentTime)}
            </Text>
            <View style={styles.buttonGroup}>
              <Button
                style={styles.button}
                title={"Go to car"}
                onPress={this.findCar}
              />
              <Button
                style={styles.button}
                title={"Unpark"}
                onPress={this.unpark}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  },
  top: {
    position: "absolute",
    width: "100%",
    height: "10%",
    margin: 10,
    backgroundColor: "lightgrey",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 4 }
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "10%",
    margin: 10,
    display: "flex",
    backgroundColor: "lightgrey",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 4 }
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  button: {
    backgroundColor: "steelblue",
    color: "white"
  },
  text: {
    fontSize: 16,
    textAlign: "center"
  }
});
