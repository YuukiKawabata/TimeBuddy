import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useTimer() {
  const [timeNotUsed, setTimeNotUsed] = useState(0);
  const [lastUsed, setLastUsed] = useState(Date.now());
  const [appIsActive, setAppIsActive] = useState(true);

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

  const handleActive = () => {
    const currentTime = Date.now();
    // ここでアプリがアクティブでない間だけ経過時間を計算する
    if (!appIsActive) {
      const timeElapsed = Math.floor((currentTime - lastUsed) / 1000);
      setTimeNotUsed((prevTimeNotUsed) => {
        const newValue = prevTimeNotUsed + timeElapsed;
        AsyncStorage.setItem("timeNotUsed", newValue.toString());
        return newValue;
      });
    }
    setLastUsed(currentTime);
    AsyncStorage.setItem("lastUsed", currentTime.toString());
  };

  const resetTimeNotUsed = async () => {
    try {
      await AsyncStorage.removeItem("timeNotUsed");
      setTimeNotUsed(0);
    } catch (error) {
      console.error("Error resetting time not used", error);
    }
  };

  return { timeNotUsed, handleActive, setAppIsActive, resetTimeNotUsed };
}
