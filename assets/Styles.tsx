import { StyleSheet } from "react-native";

const paddingStandard = 6;
const fontSizeStandard = 20;

const backgroundColor = "black";

const styles = StyleSheet.create({
  adHeaderContainer: {
    flexDirection: "row",
    flex: 0,
    height: "auto",
    backgroundColor: backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    padding: paddingStandard,
    flex: 8,
    alignItems: "center",
    backgroundColor: backgroundColor,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: paddingStandard,
    flex: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: backgroundColor,
  },

  row: {
    flexDirection: "row",
    flex: 1,
    marginBottom: paddingStandard,
    gap: paddingStandard,
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    padding: fontSizeStandard,
  },
  text: {
    color: "black",
    fontWeight: "bold",
    fontSize: fontSizeStandard,
  },
});

export default styles;
