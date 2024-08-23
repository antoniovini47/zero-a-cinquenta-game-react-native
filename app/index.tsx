import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import styles from "@/assets/Styles";
import mobileAds from "react-native-google-mobile-ads";
import InlineAd from "@/components/InlineAd";
import { Ionicons } from "@expo/vector-icons";

const buttons = Array.from({ length: 50 }, (_, index) => index + 1);

const chunkArray = (array: any, chunkSize: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const buttonChunks = chunkArray(buttons, 5);

const iconSizeStandard = 48;

export default function Index() {
  const [appState, setCurrentState] = useState<"playing" | "waiting" | "selecting">("waiting");
  const [stortedNumber, setStoredNumber] = useState(0);

  useEffect(() => {
    (async () => {
      // Google AdMob will show any messages here that you just set up on the AdMob Privacy & Messaging page
      const { status: trackingStatus } = await requestTrackingPermissionsAsync();
      if (trackingStatus !== "granted") {
        // Do something here such as turn off Sentry tracking, store in context/redux to allow for personalized ads, etc.
      }

      // Initialize the ads
      await mobileAds().initialize();
    })();
  }, []);

  return (
    <>
      <InlineAd />
      <View style={styles.mainContainer}>
        {buttonChunks.map((chunk, rowIndex) => (
          <View key={"row" + rowIndex} style={styles.row}>
            {chunk.map((i: number) => (
              <TouchableOpacity key={"button" + i} style={styles.button}>
                <Text style={styles.text}>{i}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity key={"buttonSort"} style={styles.button}>
          <Ionicons size={iconSizeStandard} name="dice-sharp" color="black" />
        </TouchableOpacity>
        <TouchableOpacity key={"buttonChoose"} style={styles.button}>
          <Ionicons size={iconSizeStandard} name="eye-sharp" color="black" />
        </TouchableOpacity>
        <TouchableOpacity key={"buttonSettings"} style={styles.button}>
          <Ionicons size={iconSizeStandard} name="cog-sharp" color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
}
