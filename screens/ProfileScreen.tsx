import * as React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Text } from "react-native-paper";
import { TextInput, Button } from "react-native-paper";

export const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View>
          <Text variant="headlineSmall">体重</Text>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="体重を記入してください"
          />
        </View>
        <View>
          <Text variant="headlineSmall">身長</Text>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="身長を記入してください"
          />
        </View>
        <View>
          <Button mode="contained" onPress={() => console.log("")}>
            保存
          </Button>
        </View>
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
  input: {
    width: 200,
    marginBottom: 10,
  },
});
