import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

export const CalendarScreen = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text>a</Text>
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
