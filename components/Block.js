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
    center,
    block,
    currentTime,
    dayIndexInMonth,
    dayIndexInWeek,
    hour
  } = props;
  let hoursLeft = 72;
  let day = 0;
  let testDate = currentTime;
  // while (day < 3) {
  //   testDate.setDate(currentTime.getDate() + day);
  //   const sweepDay =
  //     days[testDate.getDay()] === block.day || block.day === "Holiday";
  //   const sweepWeek = block.weeks[Math.floor(testDate.getDate() / 7)] === "Y";
  //   if (sweepDay && sweepWeek) {
  //     hoursLeft = 24 * day + testDate.getHours() - block.starthour;
  //     if (hoursLeft >= block.starthour - block.endhour && hoursLeft < 72) {
  //       break;
  //     }
  //   }
  //   day++;
  // }
  const sweepDay =
    days[currentTime.getDay()] === block.day || block.day === "Holiday";
  const sweepWeek = block.weeks[dayIndexInMonth] === "Y";
  const sweepHour = block.starthour <= hour && block.endhour > hour;
  const sweeping = sweepDay && sweepWeek && sweepHour;
  return (
    <Polyline
      coordinates={block.coordinates}
      strokeColor={sweeping ? colors.no : colors.yes}
      strokeWidth={sweeping ? 4 : 1}
      onPress={() => console.log(block)}
    />
  );
};
