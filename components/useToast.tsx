import { ToastAndroid } from "react-native";

export default function showToast(msg: string) {
  ToastAndroid.show(msg, ToastAndroid.LONG);
}
