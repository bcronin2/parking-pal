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

import endpoints from "../services/endpoints.js";
import styles from "../styles/main.js";

const storageKey = "parkingPalId";
const backgroundImageUrl =
  "https://i0.wp.com/gifrific.com/wp-content/uploads/2015/03/Reverse-Spinning-Parralel-Park.gif?resize=425%2C219&ssl=1";

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
    AsyncStorage.getItem(storageKey).then(storedId => {
      if (storedId) {
        axios
          .get(`${endpoints.userStoredEndpoint}/${storedId}`)
          .then(results => {
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
          AsyncStorage.setItem(storageKey, JSON.stringify(results.data[0].id));
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
      endpoints.userLoginEndpoint,
      "Oops! There was something wrong with your username or password."
    );
  }

  createUser() {
    this.validateUser(
      endpoints.userCreateEndpoint,
      "Oops! It looks like that user already exists."
    );
  }

  render() {
    return (
      <ImageBackground
        style={styles.container}
        source={{ uri: backgroundImageUrl }}
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
