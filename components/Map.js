import axios from "axios";
import React from "react";
import { Button, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import Block from "./Block.js";
import utils from "./utils.js";
import styles from "./styles.js";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    const user = props.navigation.state.params.user || utils.defaultRegion;
    const now = new Date("August 22, 2018 9:00");
    this.state = {
      userId: user.id,
      currentTime: now.getTime(),
      dayIndexInWeek: now.getDay(),
      dayIndexInMonth: Math.floor(now.getDate() / 7),
      currentHour: now.getHours(),
      region: utils.defaultRegion,
      selectedBlock: null,
      selectedExpiration: null,
      parkedCoordinates: utils.extractCoordinates(user),
      parkedExpiration: user.expiration,
      parkedNeighborhood: user.neighborhood
    };
    this.bindFunctions();
  }

  bindFunctions() {
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.selectBlock = this.selectBlock.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.park = this.park.bind(this);
    this.unpark = this.unpark.bind(this);
    this.findCar = this.findCar.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => this._map.animateToCoordinate(position.coords, 2),
      this.getParkingInfo
    );
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  onRegionChangeComplete() {
    this.getParkingInfo();
  }

  getParkingInfo() {
    const { region } = this.state;
    axios
      .get(utils.parkingInfoEndpoint, {
        params: utils.getBoundary(region)
      })
      .then(
        results => this.setState({ blocks: results.data }),
        err => console.log(err)
      );
  }

  selectBlock(selectedBlock) {
    const { currentTime } = this.state;
    const selectedExpiration = utils.getExpiration(selectedBlock, currentTime);
    this.setState({ selectedBlock, selectedExpiration });
  }

  clearSelection() {
    this.setState({ selectedBlock: null, selectedExpiration: null });
  }

  park() {
    const {
      selectedBlock,
      selectedExpiration,
      currentTime,
      userId
    } = this.state;
    const selectedCoordinates = {
      latitude: selectedBlock.ll_lat,
      longitude: selectedBlock.ll_lon
    };
    this.setState(
      {
        parkedCoordinates: selectedCoordinates,
        parkedExpiration: selectedExpiration,
        parkedNeighborhood: selectedBlock.neighborhood
      },
      () => {
        axios
          .patch(`${utils.userParkingEndpoint}/${userId}/park`, {
            coordinates: selectedCoordinates,
            expiration: Math.min(
              selectedExpiration.getTime(),
              currentTime + utils.maxParking
            ),
            neighborhood: selectedBlock.neighborhood
          })
          .then(this.clearSelection);
      }
    );
  }

  unpark() {
    const { userId } = this.state;
    this.setState(
      {
        parkedCoordinates: null,
        parkedExpiration: null,
        parkedNeighborhood: null
      },
      () => {
        axios.patch(`${utils.userParkingEndpoint}/${userId}/unpark`);
      }
    );
  }

  findCar() {
    const { parkedCoordinates } = this.state;
    this._map.animateToCoordinate(parkedCoordinates, 2);
    this.clearSelection();
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
      parkedExpiration,
      parkedNeighborhood
    } = this.state;
    const addressInfo = selectedBlock
      ? `${selectedBlock.fadd}-${selectedBlock.toadd} ${
          selectedBlock.street_name
        }`
      : null;
    const expirationInfo = selectedExpiration
      ? `Next clean: ${selectedExpiration.toString().split("GMT")[0]}`
      : "Parking prohibited";
    const selectedBlockInfo =
      addressInfo && `${addressInfo}\n${expirationInfo}`;

    return (
      <View style={styles.container}>
        <MapView
          ref={map => (this._map = map)}
          provider={null}
          style={styles.map}
          initialRegion={utils.defaultRegion}
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
              Your are parked in {parkedNeighborhood}.{"\n"} Time remaining:{" "}
              {utils.convertMillis(parkedExpiration - currentTime)}
            </Text>
            <View style={styles.row}>
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
