import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
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

const buttons = Array.from({ length: 50 }, (_, index) => index + 1);

const chunkArray = (array: any, chunkSize: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const buttonChunks = chunkArray(buttons, 5);

export default function Index() {
  return (
    <>
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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Iniciar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Configurações</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
