import { useEffect, useState } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
//アプリがバックグラウンドになった時に、通知を送る
export default function useNotifications(handleInactive) {
  //アプリの状態をstateに保存する
  const [appState, setAppState] = useState(AppState.currentState);

  //アプリがバックグラウンドになった時に、通知を送る
  useEffect(() => {
    requestNotificationPermissions();
    //AppStateの状態が変化した時に、handleAppStateChange()を実行する
    AppState.addEventListener("change", handleAppStateChange);
    //コンポーネントがアンマウントされた時に、AppStateのイベントリスナーを削除する
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
    // アプリがバックグラウンドに移行したときに通知を発生させる
    if (appState === "active" && nextAppState === "background") {
      handleInactive();
      triggerNotification();
    }
    setAppState(nextAppState);
  };

  // 通知を発生させる関数
  const triggerNotification = async () => {
    // Webプラットフォームで通知を実行しない
    if (Platform.OS === "web") {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "頑張ってください！",
        body: "アプリを使っていない時間が10秒経過しました",
        data: { data: "goes here" },
      },
      trigger: { seconds: 10 }, // ここで指定した秒数後に通知が発生します
    });
  };

  return { triggerNotification };
}
