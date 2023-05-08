import React from "react";
import { TextInput, StyleSheet } from "react-native";

const TaskInput = ({ taskName, setTaskName }) => {
  return (
    <TextInput
      style={styles.input}
      onChangeText={(text) => setTaskName(text)}
      value={taskName}
      placeholder="目標を入力してください"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    color: "white",
    fontSize: 30,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default TaskInput;
