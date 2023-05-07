import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const ResetButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.resetButton}>
    <Text style={styles.resetButtonText}>リセット</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  resetButton: {
    backgroundColor: "#ff6347",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  resetButtonText: {
    color: "white",
    fontSize: 20,
  },
});

export default ResetButton;
