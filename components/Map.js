import axios from "axios";
// import _ from "lodash";
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

const maxParking = 72 * 60 * 60 * 1000;

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
    const currentTime = new Date("August 22, 2018 9:00");
    console.log(user.expiration);
    console.log(user.expiration - currentTime.getTime());
    this.state = {
      user,
      currentTime,
      dayIndexInWeek: currentTime.getDay(),
      dayIndexInMonth: Math.floor(currentTime.getDate() / 7),
      currentHour: currentTime.getHours(),
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
  }

  componentDidMount() {
    this.getParkingInfo();
  }

  onRegionChange(region) {
    this.setState({
      region
    });
  }

  onRegionChangeComplete() {
    this.getParkingInfo();
  }

  getParkingInfo() {
    const { region } = this.state;
    const viewDimension = Math.min(defaultDimension, region.latitudeDelta);
    axios
      .get(parkingInfoEndpoint, {
        params: {
          llLatitude: region.latitude - 0.5 * viewDimension,
          llLongitude: region.longitude - 0.5 * viewDimension,
          urLatitude: region.latitude + 0.5 * viewDimension,
          urLongitude: region.longitude + 0.5 * viewDimension
        }
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
    const { selectedBlock, selectedExpiration } = this.state;
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
        axios.patch(`${userParkingEndpoint}/${this.state.user.id}/park`, {
          coordinates: selectedCoordinates,
          expiration: Math.min(
            selectedExpiration.getTime(),
            currentTime.getTime() + maxParking
          )
        });
      }
    );
  }

  getExpiration(block) {
    const { currentTime } = this.state;
    let testDate = currentTime;
    testDate.setHours(0, 0, 0, 0);
    while (true) {
      const sweepDay = block.days.indexOf(days[testDate.getDay()]) >= 0;
      const sweepWeek = block.weeks[Math.floor(testDate.getDate() / 7)] === "Y";
      if (sweepDay && sweepWeek) {
        expiration = testDate;
        if (
          expiration > currentTime ||
          block.end_hour > currentTime.getHours()
        ) {
          testDate.setHours(block.start_hour);
          return testDate;
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
    const selectedBlockInfo = `Current selection: ${addressInfo}
      Next sweeping: ${selectedExpiration}`;
    return (
      <View style={styles.container}>
        <MapView
          provider={null}
          style={styles.map}
          initialRegion={defaultRegion}
          loadingEnabled={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsPointsOfInterest={false}
          showsBuildings={false}
          showsTraffic={false}
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
            <Marker title="Parked vehicle" coordinate={parkedCoordinates} />
          )}
        </MapView>
        <View style={styles.top}>
          <Text style={styles.text}>
            {selectedBlock
              ? selectedBlockInfo
              : "Press part of the map to view parking info"}
          </Text>
          {selectedBlock && <Button title={"Park here"} onPress={this.park} />}
        </View>
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
    // flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center"
    // justifyContent: "center"
  },
  top: {
    position: "absolute",
    width: "100%",
    height: "10%",
    margin: "10%",
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
    margin: "10%",
    display: "flex",
    backgroundColor: "lightgrey",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 4 }
  },
  text: {
    fontSize: 12,
    textAlign: "center"
  }
});
