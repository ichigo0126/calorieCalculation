import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { HomeScreen } from "./screens/HomeScreen";
import { CalendarScreen } from "./screens/CalendarScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MeasurementScreen } from "./screens/MeasurementScreen";
import { FontAwesome } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
type Route = {
  name: string;
};

type TabBarIconProps = {
  color: string;
  size: number;
};

type ScreenOptionsProps = {
  route: Route;
};

const screenOptions = ({ route }: ScreenOptionsProps) => ({
  tabBarIcon: ({ color, size }: TabBarIconProps) => {
    if (route.name === "HomeTab") {
      return <FontAwesome name="home" size={size} color={color} />;
    } else if (route.name === "MeasurementTab") {
      return <FontAwesome name="list" size={size} color={color} />;
    } else if (route.name === "CalendarTab") {
      return <FontAwesome name="calendar" size={size} color={color} />;
    }
    return null;
  },
});
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MeasurementStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Measurement"
        component={MeasurementScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
const CalendarStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={CalendarScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        {/* <Tab.Navigator> */}
        <Tab.Screen
          name="MeasurementTab"
          component={MeasurementStack}
          options={{ title: "CalorieCalculation" }}
        />
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{ title: "Home" }}
        />

        <Tab.Screen
          name="CalendarTab"
          component={CalendarStack}
          options={{ title: "Calendar" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
