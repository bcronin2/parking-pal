import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const colors = {
  yes: "#0f0",
  no: "#f00"
};

const days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

module.exports = props => {
  const {
    block,
    selectedId,
    dayIndexInMonth,
    dayIndexInWeek,
    currentHour,
    pressHandler
  } = props;

  const sweepDay = block.days.indexOf(days[dayIndexInWeek]) >= 0;
  const sweepWeek = block.weeks[dayIndexInMonth] === "Y";
  const sweepHour =
    block.start_hour <= currentHour && block.end_hour > currentHour;
  const sweeping = sweepDay && sweepWeek && sweepHour;
  return (
    <Polyline
      coordinates={block.coordinates}
      strokeColor={sweeping ? colors.no : colors.yes}
      strokeWidth={block.id === selectedId ? 8 : 1}
      onPress={() => pressHandler(block)}
    />
  );
};
