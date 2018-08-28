import axios from "axios";
import React from "react";
import {
  AsyncStorage,
  Button,
  ImageBackground,
  Text,
  TextInput,
  View
} from "react-native";

import utils from "./utils.js";
import styles from "./styles.js";

export default class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
    this.loginUser = this.loginUser.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem("parkingPalId").then(storedId => {
      if (storedId) {
        axios.get(`${utils.userStoredEndpoint}/${storedId}`).then(results => {
          const { navigation } = this.props;
          navigation.navigate("Map", { user: results.data[0] });
        });
      }
    });
  }

  validateUser(endpoint, errorMessage) {
    let { username, password } = this.state;
    username = username.toLowerCase();
    password = password.hashCode();
    if (username && password) {
      axios.post(endpoint, { username, password }).then(
        results => {
          const { navigation } = this.props;
          AsyncStorage.setItem(
            "parkingPalId",
            JSON.stringify(results.data[0].id)
          );
          navigation.navigate("Map", { user: results.data[0] });
        },
        err => {
          alert(errorMessage);
        }
      );
    } else {
      alert("Please enter a username and password!");
    }
  }

  loginUser() {
    this.validateUser(
      utils.userLoginEndpoint,
      "Oops! There was something wrong with your username or password."
    );
  }

  createUser() {
    this.validateUser(
      utils.userCreateEndpoint,
      "Oops! It looks like that user already exists."
    );
  }

  render() {
    return (
      <ImageBackground
        style={styles.container}
        source={{ uri: utils.backgroundImageUrl }}
      >
        <Text style={styles.title}>Welcome to ParkingPal</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={username => this.setState({ username })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
          />
          <View style={styles.row}>
            <Button title="Login" onPress={this.loginUser} />
            <Button title="Sign up" onPress={this.createUser} />
          </View>
        </View>
      </ImageBackground>
    );
  }
}
