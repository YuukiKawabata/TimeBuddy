import React from "react";
import { Text, StyleSheet } from "react-native";

const TimeDisplay = ({ hours, minutes, remainingSeconds }) => {
  return (
    <>
      <Text style={styles.title}>をしていない時間:</Text>
      <Text style={styles.time}>
        {hours} 時間 {minutes} 分 {remainingSeconds} 秒
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 24,
    marginBottom: 10,
  },
  time: {
    color: "white",
    fontSize: 48,
  },
});

export default TimeDisplay;
