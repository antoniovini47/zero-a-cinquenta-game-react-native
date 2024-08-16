import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  adHeaderContainer: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "black",
  },
  row: {
    flexDirection: "row",
    flex: 1,
    marginBottom: 10,
    gap: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    padding: 20,
  },
  text: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default styles;
