import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import TaskInput from "./components/TaskInput";
import TimeDisplay from "./components/TimeDisplay";
import ResetButton from "./components/ResetButton";
import useTimer from "./hooks/useTimer";
import useNotifications from "./hooks/useNotifications";
import AppStateListener from "react-native-appstate-listener";

const App = () => {
  const [taskName, setTaskName] = useState("");
  const { timeNotUsed, handleActive, setAppIsActive, resetTimeNotUsed } = useTimer();
  useNotifications(handleActive);

  return (
    <View style={styles.container}>
      <TaskInput taskName={taskName} setTaskName={setTaskName} />
      <TimeDisplay timeNotUsed={timeNotUsed} />
      <ResetButton onPress={resetTimeNotUsed} />
      <AppStateListener
        onActive={() => {
          setAppIsActive(true);
          handleActive();
        }}
        onBackground={() => setAppIsActive(false)}
      />
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
