import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from "react-native";
import { Pedometer } from "expo-sensors";
import { Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const HomeScreen = () => {
  const [isStart, setIsStart] = useState(true);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState(Object);

  const saveStepCount = async (count: number) => {
    try {
      await AsyncStorage.setItem("stepCount", count.toString());
    } catch (error) {
      console.error("Error saving step count:", error);
    }
  };

  const saveDate = async (date: string) => {
    try {
      await AsyncStorage.setItem("lastDate", date);
    } catch (error) {
      console.error("Error saving date:", error);
    }
  };

  const loadStepCount = async () => {
    try {
      const count = await AsyncStorage.getItem("stepCount");
      if (count !== null) {
        setCurrentStepCount(parseInt(count, 10));
      }
    } catch (error) {
      console.error("Error loading step count:", error);
    }
  };

  const loadDate = async () => {
    try {
      const date = await AsyncStorage.getItem("lastDate");
      return date;
    } catch (error) {
      console.error("Error loading date:", error);
    }
  };

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const subscription = Pedometer.watchStepCount(async (result) => {
        const today = new Date().toISOString().split("T")[0];
        let lastDate = await loadDate();

        if (!lastDate) {
          lastDate = today;
          saveDate(today);
        }

        if (today !== lastDate) {
          setCurrentStepCount(result.steps);
          saveStepCount(result.steps);
          saveDate(today);
        } else {
          setCurrentStepCount(result.steps);
          saveStepCount(result.steps);
        }
      });

      setSubscription(subscription);
    }
  };

  useEffect(() => {
    const subscription: any = subscribe();
    loadStepCount();
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
            <Text style={styles.buttonText} variant="headlineLarge">
              {isStart ? "開始" : "終了"}
            </Text>
          </View>
          <View>
            {!isStart && (
              <View>
                <Text variant="headlineLarge" style={styles.numberOfStape}>
                  歩数:{currentStepCount}
                </Text>
              </View>
            )}
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
    marginBottom: 20,
  },
  buttonText: {
    textAlign: "center",
    padding: 10,
  },
  numberOfStape: {
    textAlign: "center",
  },
});
