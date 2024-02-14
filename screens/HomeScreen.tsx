import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Pedometer } from "expo-sensors";

export const HomeScreen = () => {
  const [isStart, setIsStart] = useState(true);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState(Object);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      return Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  useEffect(() => {
    const subscription: any = subscribe();
    return () => subscription && subscription.remove();
  }, []);

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
          {!isStart && (
            <Text>機能が使えるかどうか: {isPedometerAvailable}</Text>
          )}
          <View>{!isStart && <Text>歩数: {currentStepCount}</Text>}</View>
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
