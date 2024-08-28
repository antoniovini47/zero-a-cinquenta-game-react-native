import { StyleSheet } from "react-native";

const paddingStandard = 6;
const fontSizeStandard = 20;

const backgroundColor = "black";

const styles = StyleSheet.create({
  adHeaderContainer: {
    flexDirection: "row",
    paddingBottom: paddingStandard,
    flex: 0,
    height: "auto",
    backgroundColor: backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flexDirection: "row",
    paddingTop: paddingStandard,
    paddingHorizontal: paddingStandard,
    flex: 8,
    gap: paddingStandard,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: backgroundColor,
    flexWrap: "wrap",
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: paddingStandard,
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: backgroundColor,
    height: "100%",
  },

  buttonGame: {
    height: "9%",
    width: "18%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: paddingStandard,
  },
  buttonMenu: {
    flex: 1,
    height: "100%",
    width: "auto",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  text: {
    color: "black",
    fontWeight: "bold",
    fontSize: fontSizeStandard,
  },
});

export default styles;
