import axios from "axios";
import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

require("./utils.js");

const userLoginEndpoint = "http://localhost:3000/api/users/login";
const userCreateEndpoint = "http://localhost:3000/api/users/create";

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

  validateUser(endpoint, errorMessage) {
    let { username, password } = this.state;
    username = username.toLowerCase();
    password = password.hashCode();
    if (username && password) {
      axios.post(endpoint, { username, password }).then(
        results => {
          const { navigation } = this.props;
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
      userLoginEndpoint,
      "Oops! There was something wrong with your username or password."
    );
  }

  createUser() {
    this.validateUser(
      userCreateEndpoint,
      "Oops! It looks like that user already exists."
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to ParkingPal</Text>
        <TextInput
          placeholder="Username"
          onChangeText={username => this.setState({ username })}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}
        />
        <Button title="Login" onPress={this.loginUser} />
        <Button title="Sign up" onPress={this.createUser} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center"
  }
});
