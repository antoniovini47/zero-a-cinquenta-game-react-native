import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState, useRef } from "react";
import styles from "@/assets/Styles";
import mobileAds from "react-native-google-mobile-ads";
import InlineAd from "@/components/InlineAd";
import { Ionicons } from "@expo/vector-icons";
import GameButton from "@/components/GameButton";

const iconSizeStandard = 48;

const disableTrue = "disabled: true, style: styles.buttonGameDisable";

export interface ButtonGameArrayProps {
  idButton: number;
  disabled: boolean;
  style: any;
}

export default function Index() {
  const [appState, setCurrentState] = useState<"playing" | "paused" | "selecting">("paused");
  const [sortedNumber, setSortedNumber] = useState(0);
  const [buttons, setButtons] = useState<ButtonGameArrayProps[]>(
    Array.from({ length: 50 }, (_, index) => ({
      idButton: index + 1,
      disabled: true,
      style: styles.buttonGameDisable,
    }))
  );

  function enableAllButtons() {
    setButtons((prevButtons) =>
      prevButtons.map((button) => ({ ...button, disabled: false, style: styles.buttonGameActive }))
    );
  }

  function disableAllButtons() {
    setButtons((prevButtons) =>
      prevButtons.map((button) => ({ ...button, disabled: true, style: styles.buttonGameDisable }))
    );
  }

  useEffect(() => {
    (async () => {
      // Google AdMob will show any messages here that you just set up on the AdMob Privacy & Messaging page
      // const { status: trackingStatus } = await requestTrackingPermissionsAsync();
      // if (trackingStatus !== "granted") {
      //   // Do something here such as turn off Sentry tracking, store in context/redux to allow for personalized ads, etc.
      // }

      await mobileAds().initialize();
    })();
  }, []);

  function startGameSortedMode() {
    if (appState === "playing") {
      // TODO: Dialog box for "Are you sure you want to start a new game?"
      return;
    }
    // TODO: Toast message "Numero sorteado, boa sorte a todos!" + Audio
    startGame(Math.floor(Math.random() * 50) + 1);
  }

  function startSelectingMode() {
    if (appState === "playing") {
      // TODO: Dialog box for "Are you sure you want to start a new game?"
      return;
    }
    setCurrentState("selecting");
    enableAllButtons();
  }

  function startGame(sortedNumber: number) {
    setSortedNumber(sortedNumber);
    console.log("Numero sorteado: ", sortedNumber);
    enableAllButtons();
    setCurrentState("playing");
  }

  function gameButtonPressed(button: number) {
    console.log("Botão pressionado: ", button);
    if (appState == "paused") {
      // TODO: Toast message "Selecione um modo de jogo abaixo" + Audio
    }

    if (appState == "selecting") {
      startGame(button);
      // TODO: Toast message "Numero escolhido, boa sorte a todos!" + Audio
      return;
    }

    if (appState == "playing") {
      if (button == sortedNumber) {
        disableAllButtons();
        setCurrentState("paused");
        // TODO: Modal message "Parabéns, você encontrou!" Botão "Jogar novamente" // resetar o estado do jogo
        //Chama o interstitial Ad com um toast
        return;
      }
    }

    deactivateImpossibles(button);
  }

  function deactivateImpossibles(buttonPressed: number) {
    // TODO: Create logic for deactivating impossible buttons
    if (buttonPressed < sortedNumber) {
      setButtons((prevButtons) =>
        prevButtons.map((button) => {
          if (button.idButton <= buttonPressed) {
            return { ...button, disabled: true, style: styles.buttonGameDisable };
          }
          return button;
        })
      );
    }

    if (buttonPressed > sortedNumber) {
      setButtons((prevButtons) =>
        prevButtons.map((button) => {
          if (button.idButton >= buttonPressed) {
            return { ...button, disabled: true, style: styles.buttonGameDisable };
          }
          return button;
        })
      );
    }
  }

  return (
    <>
      <InlineAd />
      <View style={styles.mainContainer}>
        {buttons.map((button) => (
          <TouchableOpacity
            onPress={() => gameButtonPressed(button.idButton)}
            disabled={button.disabled}
            key={button.idButton}
            style={button.style}>
            <Text style={styles.text}>{button.idButton}</Text>
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
        <TouchableOpacity
          onPress={startSelectingMode}
          key={"buttonSelect"}
          style={styles.buttonMenu}>
          <Ionicons size={iconSizeStandard} name="eye-sharp" color="black" />
        </TouchableOpacity>
        <TouchableOpacity key={"buttonSettings"} style={styles.buttonMenu}>
          <Ionicons size={iconSizeStandard} name="cog-sharp" color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
}
