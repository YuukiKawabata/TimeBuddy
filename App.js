import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppStateListener from "react-native-appstate-listener";

const App = () => {
  const [timeNotUsed, setTimeNotUsed] = useState(0);
  const [lastUsed, setLastUsed] = useState(Date.now());

  useEffect(() => {
    const loadState = async () => {
      try {
        const lastUsed = await AsyncStorage.getItem("lastUsed");
        const timeNotUsed = await AsyncStorage.getItem("timeNotUsed");

        if (lastUsed !== null && timeNotUsed !== null) {
          setLastUsed(parseInt(lastUsed, 10));
          setTimeNotUsed(parseInt(timeNotUsed, 10));
        }
      } catch (error) {
        console.error("Error loading data", error);
      }
    };

    loadState();
  }, []);

  const saveState = async () => {
    try {
      await AsyncStorage.setItem("lastUsed", lastUsed.toString());
      await AsyncStorage.setItem("timeNotUsed", timeNotUsed.toString());
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  function handleActive() {
    console.log("The application is now active!");
    const currentTime = Date.now();
    const timeElapsed = Math.floor((currentTime - lastUsed) / 1000);
    setTimeNotUsed((prevTimeNotUsed) => {
      const newValue = prevTimeNotUsed + timeElapsed;
      AsyncStorage.setItem("timeNotUsed", newValue.toString());
      return newValue;
    });
    setLastUsed(currentTime);
    AsyncStorage.setItem("lastUsed", currentTime.toString());
  }

  function handleBackground() {
    console.log("The application is now in the background!");
    setLastUsed(Date.now());
    saveState();
  }

  function handleInactive() {
    console.log("The application is now inactive!");
  }

  function secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return {
      hours,
      minutes,
      remainingSeconds,
    };
  }

  const { hours, minutes, remainingSeconds } = secondsToHMS(timeNotUsed);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>スマホを使っていない時間:</Text>
      <Text style={styles.time}>
        {hours} 時間 {minutes} 分 {remainingSeconds} 秒
      </Text>
      <AppStateListener
        onActive={handleActive}
        onBackground={handleBackground}
        onInactive={handleInactive}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  time: {
    fontSize: 48,
  },
});

export default App;
