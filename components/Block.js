import React from "react";
import { Polyline } from "react-native-maps";

import utils from "./utils.js";

module.exports = props => {
  const {
    block,
    selectedId,
    dayIndexInMonth,
    dayIndexInWeek,
    currentHour,
    pressHandler
  } = props;

  const sweepDay = block.days.indexOf(utils.days[dayIndexInWeek]) >= 0;
  const sweepWeek = block.weeks[dayIndexInMonth] === "Y";
  const sweepHour =
    block.start_hour <= currentHour && block.end_hour > currentHour;
  const sweeping = sweepDay && sweepWeek && sweepHour;
  return (
    <Polyline
      coordinates={block.coordinates}
      strokeColor={sweeping ? utils.colors.no : utils.colors.yes}
      strokeWidth={block.id === selectedId ? 8 : 1}
      onPress={() => pressHandler(block)}
    />
  );
};
