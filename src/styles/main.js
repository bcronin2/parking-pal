import _ from "lodash";
import { StyleSheet } from "react-native";

const unit = 10;

const shadow = () => ({
  shadowColor: "black",
  shadowOpacity: 0.2,
  shadowRadius: 8,
  shadowOffset: { width: 2, height: 4 }
});

const panel = () =>
  _.extend(
    {
      position: "absolute",
      width: "80%",
      height: 8 * unit,
      margin: unit,
      padding: 0.5 * unit,
      display: "flex",
      backgroundColor: "lightgrey",
      borderRadius: unit
    },
    shadow()
  );

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  text: {
    fontSize: 1.32 * unit,
    fontWeight: "600",
    textAlign: "center"
  },
  title: {
    position: "absolute",
    top: unit,
    fontSize: 3 * unit,
    fontWeight: "800",
    textAlign: "center"
  },
  form: {
    position: "relative",
    top: "-20%"
  },
  input: _.extend(shadow(), {
    margin: unit,
    padding: 0.4 * unit,
    backgroundColor: "white",
    fontSize: 2 * unit,
    width: 16 * unit
  }),
  top: _.extend(panel(), { top: 0.5 * unit }),
  bottom: _.extend(panel(), { bottom: 1.5 * unit })
});
