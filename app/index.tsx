import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState, useRef } from "react";
import styles from "@/assets/Styles";
import mobileAds from "react-native-google-mobile-ads";
import InlineAd from "@/components/InlineAd";
import { Ionicons } from "@expo/vector-icons";

const iconSizeStandard = 48;

export default function Index() {
  const [appState, setCurrentState] = useState<"playing" | "paused" | "selecting">("paused");
  const [sortedNumber, setSortedNumber] = useState(0);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [buttons, setButtons] = useState(Array.from({ length: 50 }, (_, index) => index + 1));

  useEffect(() => {
    (async () => {
      // Google AdMob will show any messages here that you just set up on the AdMob Privacy & Messaging page
      // const { status: trackingStatus } = await requestTrackingPermissionsAsync();
      // if (trackingStatus !== "granted") {
      //   // Do something here such as turn off Sentry tracking, store in context/redux to allow for personalized ads, etc.
      // }

      // Initialize the ads
      await mobileAds().initialize();
    })();
  }, []);

  useEffect(() => {
    setButtons((prevButtons) => prevButtons);
  }, [buttonsDisabled]);

  function startGameSortedMode() {
    setSortedNumber(Math.floor(Math.random() * 50) + 1);
    setButtonsDisabled(false);
    setCurrentState("playing");
  }

  return (
    <>
      <InlineAd />
      <View style={styles.mainContainer}>
        {buttons.map((button) => (
          <TouchableOpacity
            disabled={buttonsDisabled}
            key={"button" + button}
            style={styles.buttonGame}>
            <Text style={styles.text}>{button}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          onPress={startGameSortedMode}
          key={"buttonSort"}
          style={styles.buttonMenu}>
          <Ionicons size={iconSizeStandard} name="dice-sharp" color="black" />
        </TouchableOpacity>
        <TouchableOpacity key={"buttonChoose"} style={styles.buttonMenu}>
          <Ionicons size={iconSizeStandard} name="eye-sharp" color="black" />
        </TouchableOpacity>
        <TouchableOpacity key={"buttonSettings"} style={styles.buttonMenu}>
          <Ionicons size={iconSizeStandard} name="cog-sharp" color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
}
