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

  loginUser() {
    let { username, password } = this.state;
    username = username.toLowerCase();
    password = password.hashCode();
    if (username && password) {
      axios.post(userLoginEndpoint, { username, password }).then(
        results => {
          const { navigator } = this.props;
          navigator.push({ title: "Map" });
        },
        err => {
          alert("Oops! There was an error with your username or password.");
        }
      );
    } else {
      alert("Please enter a username and password!");
    }
  }

  createUser() {
    let { username, password } = this.state;
    username = username.toLowerCase();
    password = password.hashCode();
    if (username && password) {
      axios.post(userCreateEndpoint, { username, password }).then(
        results => {
          const { navigator } = this.props;
          navigator.push({ title: "Map" });
        },
        err => {
          alert("Oops! It looks like that user already exists.");
        }
      );
    } else {
      alert("Please enter a username and password!");
    }
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
