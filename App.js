import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppStateListener from "react-native-appstate-listener";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native"; // Add this line to the top of the file

const App = () => {
  const [timeNotUsed, setTimeNotUsed] = useState(0);
  const [lastUsed, setLastUsed] = useState(Date.now());
  const [taskName, setTaskName] = useState("");
  const { hours, minutes, remainingSeconds } = secondsToHMS(timeNotUsed);
  const [appState, setAppState] = useState(AppState.currentState);
  const [inactiveTimer, setInactiveTimer] = useState(null);

  async function requestNotificationPermissions() {
    if (Platform.OS !== "android") {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
    }
  }

  useEffect(() => {
    requestNotificationPermissions();
    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      clearTimeout(inactiveTimer);
    } else if (
      appState === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      setInactiveTimer(setTimeout(sendNotification, 1800 * 1000)); // 30 minutes
    }
    setAppState(nextAppState);
  };

  const sendNotification = async () => {
    const notification = {
      title: "Reminder",
      body: "You've been inactive for 30 minutes!",
    };
    await Notifications.scheduleNotificationAsync({
      content: notification,
      trigger: null,
    });
  };

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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setTaskName(text)}
        value={taskName}
        placeholder="目標を入力してください"
      />
      <Text style={styles.title}>をしていない時間:</Text>
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
    backgroundColor: "black",
  },
  title: {
    color: "white",
    fontSize: 24,
    marginBottom: 10,
  },
  time: {
    color: "white",
    fontSize: 48,
  },
  input: {
    color: "white",
    fontSize: 30,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default App;
