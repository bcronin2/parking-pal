import axios from "axios";
import React from "react";
import { Button, Text, View } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";

import Block from "./Block.js";
import ParkingStatus from "./ParkingStatus";
import timing from "../services/timing.js";
import coordinates from "../services/coordinates.js";
import endpoints from "../services/endpoints.js";
import styles from "../styles/main.js";

const carIcon = require("../assets/car-icon.png");

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    const user = props.navigation.state.params.user;
    this.state = {
      userId: user.id,
      region: coordinates.defaultRegion,
      selectedBlock: null,
      selectedExpiration: null,
      parkedCoordinates: coordinates.extractCoordinates(user),
      parkedExpiration: user.expiration,
      parkedNeighborhood: user.neighborhood
    };
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
      .get(endpoints.parkingInfoEndpoint, {
        params: coordinates.getBoundary(region)
      })
      .then(
        results => this.setState({ blocks: results.data }),
        err => console.log(err)
      );
  }

  selectBlock(selectedBlock) {
    const currentTime = new Date().getTime();
    const selectedExpiration = timing.getExpiration(selectedBlock, currentTime);
    this.setState({ selectedBlock, selectedExpiration });
  }

  clearSelection() {
    this.setState({ selectedBlock: null, selectedExpiration: null });
  }

  park() {
    const { selectedBlock, selectedExpiration, userId } = this.state;
    const currentTime = new Date().getTime();
    const expiration = Math.min(
      selectedExpiration.getTime(),
      currentTime + timing.maxParking
    );
    const selectedCoordinates = {
      latitude: selectedBlock.ll_lat,
      longitude: selectedBlock.ll_lon
    };
    this.setState(
      {
        parkedCoordinates: selectedCoordinates,
        parkedExpiration: expiration,
        parkedNeighborhood: selectedBlock.neighborhood
      },
      () => {
        axios
          .patch(`${endpoints.userParkingEndpoint}/${userId}/park`, {
            expiration,
            coordinates: selectedCoordinates,
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
        axios.patch(`${endpoints.userParkingEndpoint}/${userId}/unpark`);
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
      region,
      blocks,
      selectedBlock,
      selectedExpiration,
      parkedCoordinates,
      parkedExpiration,
      parkedNeighborhood
    } = this.state;
    const currentDate = new Date();
    const dayIndexInWeek = currentDate.getDay();
    const weekIndexInMonth = Math.floor(currentDate / 7);
    const currentHour = currentDate.getHours();
    const addressInfo = selectedBlock
      ? `${selectedBlock.fadd}-${selectedBlock.toadd} ${
          selectedBlock.street_name
        }`
      : null;
    const expirationInfo = selectedExpiration
      ? `Next cleaning: ${timing.parseDate(selectedExpiration)}`
      : "Parking prohibited";
    const selectedBlockInfo =
      addressInfo && `${addressInfo}\n${expirationInfo}`;
    return (
      <View style={styles.container}>
        <MapView
          ref={map => (this._map = map)}
          provider={null}
          style={styles.map}
          initialRegion={coordinates.defaultRegion}
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
                weekIndexInMonth={weekIndexInMonth}
                currentHour={currentHour}
                pressHandler={this.selectBlock}
              />
            ))}
          <Polygon
            coordinates={coordinates.getSquareForRegion(region)}
            strokeColor="#ccc"
          />
          {parkedCoordinates && (
            <Marker
              title="My car"
              coordinate={parkedCoordinates}
              image={carIcon}
            />
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
          <ParkingStatus
            parkedExpiration={parkedExpiration}
            parkedNeighborhood={parkedNeighborhood}
            findCar={this.findCar}
            unpark={this.unpark}
          />
        )}
      </View>
    );
  }
}
