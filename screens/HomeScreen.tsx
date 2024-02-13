import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

export const HomeScreen = () => {
  const [isStart, setIsStart] = useState(true);

  const toggleButton = () => {
    setIsStart(!isStart);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity onPress={toggleButton}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{isStart ? "開始" : "終了"}</Text>
          </View>
        </TouchableOpacity>
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
