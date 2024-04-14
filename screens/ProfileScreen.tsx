import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export const ProfileScreen = () => {
  const [height, setHeight] = useState<string | undefined>(undefined); // 身長の状態変数を追加
  const [weight, setWeight] = useState<string | undefined>(undefined); // 身長の状態変数を追加
  const navigation = useNavigation();

  const saveDataAndNavigate = () => {
    if (height !== undefined && weight !== undefined) {
        // navigation.navigate("HomeScreen", { height, weight });
      }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View>
          <Text variant="headlineSmall">体重</Text>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="体重を記入してください"
            value={weight} // 状態変数をテキスト入力フィールドにバインド
            onChangeText={(text) => setWeight(text)} // 入力された値を状態変数に保存
          />
        </View>
        <View>
          <Text variant="headlineSmall">身長</Text>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="身長を記入してください"
            value={height} // 状態変数をテキスト入力フィールドにバインド
            onChangeText={(text) => setHeight(text)} // 入力された値を状態変数に保存
          />
        </View>
        <View>
          <Button
            mode="contained"
            onPress={saveDataAndNavigate} // 身長をコンソールに出力
          >
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
  input: {
    width: 200,
    marginBottom: 10,
  },
});
