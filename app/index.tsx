import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import styles from "@/assets/Styles";
import InlineAd from "@/components/InlineAd";
import { Ionicons } from "@expo/vector-icons";
import showToast from "@/components/useToast";
import Dialog from "react-native-dialog";
import { Audio } from "expo-av";
import { textInstructions } from "@/components/texts";
import { iconSizeStandard } from "@/assets/dimens";

export interface ButtonGameArrayProps {
  idButton: number;
  disabled: boolean;
  style: any;
}
let lastClickedGameMode: string = "sortedMode";

type AppState = "playing" | "paused" | "selecting";
let appState: AppState = "paused";

export default function Index() {
  const [sortedNumber, setSortedNumber] = useState(0);
  const [gameButtons, setButtons] = useState<ButtonGameArrayProps[]>(
    Array.from({ length: 50 }, (_, index) => ({
      idButton: index + 1,
      disabled: true,
      style: styles.buttonGameDisable,
    }))
  );
  const [isDialogBoxNewGameVisible, setIsDialogBoxNewGameVisible] = useState(false);
  const [isDialogBoxFoundedNumberVisible, setIsDialogBoxFoundedNumberVisible] = useState(false);
  const [isDialogBoxConfigsVisible, setIsDialogBoxConfigsVisible] = useState(false);
  const [sound, setSound]: any = useState();

  async function playSound(soundUrl: any) {
    const { sound } = await Audio.Sound.createAsync(soundUrl);
    setSound(sound);
    await sound.playAsync();
  }

  function closeAllDialogs() {
    setIsDialogBoxNewGameVisible(false);
    setIsDialogBoxFoundedNumberVisible(false);
    setIsDialogBoxConfigsVisible(false);
  }

  function startSortedMode() {
    closeAllDialogs();
    lastClickedGameMode = "sortedMode";
    if (appState === "playing") {
      appState = "paused";
      setIsDialogBoxNewGameVisible(true);
      return;
    }
    startGame(Math.floor(Math.random() * 50) + 1);
    showToast("Numero sorteado, boa sorte a todos!");
  }

  function startSelectingMode() {
    closeAllDialogs();
    lastClickedGameMode = "selectingMode";
    if (appState === "playing") {
      appState = "paused";
      setIsDialogBoxNewGameVisible(true);
      return;
    }

    showToast("Selecione um número para começar!");
    appState = "selecting";
    enableAllButtons();
  }

  function startGame(sortedNumber: number) {
    playSound(require("../assets/raw/started.wav"));
    enableAllButtons();
    setSortedNumber(sortedNumber);
    console.log("Numero sorteado: ", sortedNumber);
    appState = "playing";
  }

  function gameButtonPressed(button: number) {
    playSound(require("../assets/raw/click.mp3"));
    console.log("Botão pressionado: ", button);
    if (appState == "paused") {
      //That should never be called / debug only
      showToast("Selecione um modo de jogo para começar!");
      console.log("BUG Detected: Gamebutton pressed while paused!");
      return;
    }

    if (appState == "selecting") {
      startGame(button);
      showToast("Numero escolhido, passe para o próximo!");
      return;
    }

    if (appState == "playing") {
      if (button == sortedNumber) {
        setIsDialogBoxFoundedNumberVisible(true);
        playSound(require("../assets/raw/founded.wav"));
        appState = "paused";
        disableAllButtons();
        return;
      }
    }

    deactivateImpossibles(button);
  }

  function deactivateImpossibles(buttonPressed: number) {
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

  return (
    <>
      <View style={styles.mainContainer}>
        {gameButtons.map((button) => (
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
          onPress={() => {
            console.log("Botão pressionado:  buttonSortedMode");
            startSortedMode();
          }}
          key={"buttonSort"}
          style={styles.buttonMenu}>
          <Ionicons size={iconSizeStandard} name="dice-sharp" color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log("Botão pressionado:  buttonSelectMode");
            startSelectingMode();
          }}
          key={"buttonSelect"}
          style={styles.buttonMenu}>
          <Ionicons size={iconSizeStandard} name="eye-sharp" color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsDialogBoxConfigsVisible(true)}
          key={"buttonSettings"}
          style={styles.buttonMenu}>
          <Ionicons size={iconSizeStandard} name="cog-sharp" color="black" />
        </TouchableOpacity>
      </View>

      <View>
        <Dialog.Container
          visible={isDialogBoxNewGameVisible}
          onBackdropPress={() => {
            appState = "playing";
            setIsDialogBoxNewGameVisible(false);
          }}
          onRequestClose={() => {
            appState = "playing";
            setIsDialogBoxNewGameVisible(false);
          }}>
          <Dialog.Title style={styles.text}>Novo Jogo</Dialog.Title>
          <Dialog.Description style={styles.textDialogBoxDescription}>
            Tem certeza que deseja começar um novo Jogo?
          </Dialog.Description>
          <Dialog.Button
            onPress={() => {
              console.log(lastClickedGameMode);
              lastClickedGameMode == "sortedMode" ? startSortedMode() : startSelectingMode();
            }}
            label="Novo Jogo"
          />
          <Dialog.Button
            onPress={() => {
              appState = "playing";
              setIsDialogBoxNewGameVisible(false);
            }}
            label="Cancelar"
          />
        </Dialog.Container>
      </View>

      <View>
        <Dialog.Container
          visible={isDialogBoxFoundedNumberVisible}
          onBackdropPress={() => {
            appState = "playing";
            setIsDialogBoxFoundedNumberVisible(false);
          }}
          onRequestClose={() => {
            appState = "playing";
            setIsDialogBoxFoundedNumberVisible(false);
          }}>
          <Dialog.Title style={styles.text}>Você encontrou!</Dialog.Title>
          <Dialog.Button
            onPress={() => {
              console.log(lastClickedGameMode);
              lastClickedGameMode == "sortedMode" ? startSortedMode() : startSelectingMode();
            }}
            label="Jogar Novamente"
          />
        </Dialog.Container>
      </View>

      <View>
        <Dialog.Container
          visible={isDialogBoxConfigsVisible}
          onBackdropPress={() => {
            setIsDialogBoxConfigsVisible(false);
          }}
          onRequestClose={() => {
            setIsDialogBoxConfigsVisible(false);
          }}>
          <Dialog.Title style={styles.text}>Como Jogar</Dialog.Title>
          <Dialog.Description style={styles.textDialogBoxDescription}>
            {textInstructions}
          </Dialog.Description>
          <Dialog.Button
            onPress={() => {
              closeAllDialogs();
            }}
            label="Fechar"
          />
      </View>
    </>
  );
}
