import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//タイマー関連の処理をまとめたカスタムフック
export default function useTimer() {
  const [timeNotUsed, setTimeNotUsed] = useState(0);
  const [lastUsed, setLastUsed] = useState(Date.now());

  //アプリが起動した時に、AsyncStorageからデータを読み込む
  useEffect(() => {
    //AsyncStorageからデータを読み込む関数
    const loadState = async () => {
      try {
        const lastUsed = await AsyncStorage.getItem("lastUsed");
        const timeNotUsed = await AsyncStorage.getItem("timeNotUsed");
        //AsyncStorageから読み込んだデータをstateに反映する
        if (lastUsed !== null && timeNotUsed !== null) {
          //parseInt()で文字列を数値に変換する
          setLastUsed(parseInt(lastUsed, 10));
          setTimeNotUsed(parseInt(timeNotUsed, 10));
        }
        //AsyncStorageから読み込んだデータがnullだった場合は、0をセットする
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    //アプリが起動した時に、AsyncStorageからデータを読み込む
    loadState();
  }, []);
  //アプリがバックグラウンドになった時に、AsyncStorageにデータを保存する
  const handleActive = () => {
    //Date.now()で現在時刻を取得する
    const currentTime = Date.now();
    //現在時刻と前回アプリを閉じた時刻の差分を計算する
    const timeElapsed = Math.floor((currentTime - lastUsed) / 1000);
    //差分をstateに反映する
    setTimeNotUsed((prevTimeNotUsed) => {
        //AsyncStorageにデータを保存する
      const newValue = prevTimeNotUsed + timeElapsed;
      AsyncStorage.setItem("timeNotUsed", newValue.toString());
      return newValue;
    });
    //現在時刻をstateに反映する
    setLastUsed(currentTime);
    //現在時刻をAsyncStorageに保存する
    AsyncStorage.setItem("lastUsed", currentTime.toString());
  };
//タイマー関連の処理をまとめたカスタムフック
  return { timeNotUsed, handleActive };
}
