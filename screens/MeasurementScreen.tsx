import { StyleSheet, View, Text, SafeAreaView } from "react-native";

export const MeasurementScreen = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text>Measurement</Text>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    backgroundColor: "rgb(238, 238, 238)",
    borderRadius: 20,
    borderWidth: 1,
    width: 250,
  },
  buttonText: {
    textAlign: "center",
    padding: 10,
  },
});
