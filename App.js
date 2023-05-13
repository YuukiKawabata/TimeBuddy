import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import TaskInput from "./components/TaskInput";
import TimeDisplay from "./components/TimeDisplay";
import ResetButton from "./components/ResetButton";
import useTimer from "./hooks/useTimer";
import useNotifications from "./hooks/useNotifications";
import AppStateListener from "react-native-appstate-listener";
import { activateKeepAwakeAsync, deactivateKeepAwakeAsync } from 'expo-keep-awake';

//テスト ここから

const App = () => {
  useEffect(() => {
    activateKeepAwakeAsync();

    return () => {
      deactivateKeepAwakeAsync();
    };
  }, []);

  const [taskName, setTaskName] = useState("");
  const { timeNotUsed, handleActive, setAppIsActive, resetTimeNotUsed } =
    useTimer();
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
      {/* <KeepAwake /> */}
      <Text style={styles.title}>
        ※このアプリは画面がオフにならないように設定されています
      </Text>
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
  title: {
    color: "white",
    fontSize: 10,
    marginTop: 10,
  },
});

export default App;
