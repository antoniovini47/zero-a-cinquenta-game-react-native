import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import styles from "@/assets/Styles";
import mobileAds from "react-native-google-mobile-ads";
import InlineAd from "@/components/InlineAd";
import { Ionicons } from "@expo/vector-icons";
import showToast from "@/components/useToast";
import Dialog from "react-native-dialog";
import * as Device from "expo-device";
import { AdEventType, InterstitialAd, TestIds } from "react-native-google-mobile-ads";
import * as Linking from "expo-linking";

//Intersticial Initial configs
const iosAdmobInterstitial = process.env.EXPO_PUBLIC_ADMOB_INTERSTITAL_ID;
const androidAdmobInterstitial = process.env.EXPO_PUBLIC_ADMOB_INTERSTITAL_ID;
const productionID = Device.osName === "Android" ? androidAdmobInterstitial : iosAdmobInterstitial;
const adUnitId: string = __DEV__ ? TestIds.INTERSTITIAL : productionID;
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ["saúde", "alimentação", "calorias", "fitness"], // Update based on the most relevant keywords for your app/users, these are just random examples
  requestNonPersonalizedAdsOnly: true, // Update based on the initial tracking settings from initialization earlier
});

const iconSizeStandard = 48;
const textInstructions =
  "Um jogo de adivinhação ao contrário, ou seja, seu objetivo é não adivinhar. App idealizado com base no famoso jogo de roda de amigos chamado 'Zero a Cinquenta'.\n\nModo de jogo 1 (Escolher número): \nAo escolher um número, a pessoa da vez passa para seu amigo ao lado. Este, escolhe um dos 50 números, caso erre, passa para o próximo. Se alguém acertar, perde e paga o 'castigo', se não restarem números, exceto o número secreto, o que escondeu o jogador da vez é que perde. \nA pessoa que paga a prenda é aquela que perdeu, esta agora é o que escolhe. \n\nModo de jogo 2 (Sortear): \nO jogador da vez pode usar a opção 'sortear' disponível, o próprio jogo escolhe um número aleatório e ninguém mais saberá qual é, logo, o jogador da vez também participa desse modo de jogo, pois, também não sabe onde se encontra.";
const urlPremiumVersion =
  "https://play.google.com/store/apps/details?id=com.rotech.zeroacinquentapremium";

export interface ButtonGameArrayProps {
  idButton: number;
  disabled: boolean;
  style: any;
}
type AppState = "playing" | "paused" | "selecting";
let lastClickedGameMode: string = "sortedMode";
let appState: AppState = "paused";

export default function Index() {
  //Intersticial functions
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Event listener for when the ad is loaded
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    // Event listener for when the ad is closed
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);

      // Load a new ad when the current ad is closed
      interstitial.load();
    });

    // Start loading the interstitial ad straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  //Other functions
  const [sortedNumber, setSortedNumber] = useState(0);
  const [buttons, setButtons] = useState<ButtonGameArrayProps[]>(
    Array.from({ length: 50 }, (_, index) => ({
      idButton: index + 1,
      disabled: true,
      style: styles.buttonGameDisable,
    }))
  );
  const [isDialogBoxNewGameVisible, setIsDialogBoxNewGameVisible] = useState(false);
  const [isDialogBoxFoundedNumberVisible, setIsDialogBoxFoundedNumberVisible] = useState(false);
  const [isDialogBoxConfigsVisible, setIsDialogBoxConfigsVisible] = useState(false);

  function closeAllDialogs() {
    setIsDialogBoxNewGameVisible(false);
    setIsDialogBoxFoundedNumberVisible(false);
    setIsDialogBoxConfigsVisible(false);
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

  function startSortedMode() {
    closeAllDialogs();
    lastClickedGameMode = "sortedMode";
    if (appState === "playing") {
      appState = "paused";
      setIsDialogBoxNewGameVisible(true);
      return;
    }
    // TODO:  Audio
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
    enableAllButtons();
    setSortedNumber(sortedNumber);
    console.log("Numero sorteado: ", sortedNumber);
    appState = "playing";
  }

  function gameButtonPressed(button: number) {
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
      // TODO: Audio
      return;
    }

    if (appState == "playing") {
      if (button == sortedNumber) {
        setIsDialogBoxFoundedNumberVisible(true);
        appState = "paused";
        disableAllButtons();
        // TODO: Modal message "Parabéns, você encontrou!" Botão "Jogar novamente" // resetar o estado do jogo
        // Chama o interstitial Ad com um toast antes
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
          <Dialog.Title>Novo Jogo</Dialog.Title>
          <Dialog.Description>Tem certeza que deseja começar um novo Jogo?</Dialog.Description>
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
          <Dialog.Title>Você encontrou!</Dialog.Title>
          <Dialog.Button
            onPress={() => {
              console.log(lastClickedGameMode);
              if (loaded) {
                interstitial.show();
              }
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
          <Dialog.Title>Como Jogar</Dialog.Title>
          <Dialog.Description>{textInstructions}</Dialog.Description>
          <Dialog.Button
            onPress={() => {
              closeAllDialogs();
            }}
            label="Fechar"
          />
          <Dialog.Button
            onPress={() => Linking.openURL(urlPremiumVersion)}
            label="Remover Anúncios"></Dialog.Button>
        </Dialog.Container>
      </View>
    </>
  );
}
