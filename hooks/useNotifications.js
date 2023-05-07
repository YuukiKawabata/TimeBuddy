import { useEffect, useState } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
//アプリがバックグラウンドになった時に、通知を送る
export default function useNotifications(handleInactive) {
  //アプリの状態をstateに保存する
  const [appState, setAppState] = useState(AppState.currentState);
  useEffect(() => {
    requestNotificationPermissions();
    //AppStateの状態が変化した時に、handleAppStateChange()を実行する
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);
  //アプリの状態が変化した時に、handleAppStateChange()を実行する
  async function requestNotificationPermissions() {
    //Androidの場合は、通知の許可を取得する
    if (Platform.OS !== "android") {
      //通知の許可を取得する
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      //通知の許可が得られなかった場合は、アラートを表示する
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
    }
  }
  //アプリの状態が変化した時に、handleAppStateChange()を実行する
  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      handleInactive();
    }
    setAppState(nextAppState);
  };
}
