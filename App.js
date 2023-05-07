import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import TaskInput from "./components/TaskInput";
import TimeDisplay from "./components/TimeDisplay";
import useTimer from "./hooks/useTimer";
import useNotifications from "./hooks/useNotifications";
import AppStateListener from "react-native-appstate-listener";

const App = () => {
  const [taskName, setTaskName] = useState("");
  const { timeNotUsed, handleActive } = useTimer();
  useNotifications(handleActive);

  return (
    <View style={styles.container}>
      <TaskInput taskName={taskName} setTaskName={setTaskName} />
      <TimeDisplay timeNotUsed={timeNotUsed} />
      <AppStateListener onActive={handleActive} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
});

export default App;
