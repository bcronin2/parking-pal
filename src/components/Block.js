import React from "react";
import { Polyline } from "react-native-maps";

import timing from "../services/timing.js";

module.exports = props => {
  const {
    block,
    selectedId,
    dayIndexInWeek,
    weekIndexInMonth,
    hour,
    pressHandler
  } = props;
  const cleaning = timing.isCleaning(
    block,
    dayIndexInWeek,
    weekIndexInMonth,
    hour
  );
  return (
    <Polyline
      coordinates={block.coordinates}
      strokeColor={cleaning ? "red" : "green"}
      strokeWidth={block.id === selectedId ? 8 : 1}
      onPress={() => pressHandler(block)}
    />
  );
};
