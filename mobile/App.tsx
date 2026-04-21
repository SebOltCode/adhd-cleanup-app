import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./src/providers/AuthProvider";
import { SetupScreen } from "./src/screens/SetupScreen";
import { TaskScreen } from "./src/screens/TaskScreen";
import { StatsScreen } from "./src/screens/StatsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "#071333",
        borderTopColor: "rgba(255,255,255,0.1)",
        paddingBottom: 6,
        height: 64,
      },
      tabBarActiveTintColor: "#ff90e8",
      tabBarInactiveTintColor: "#9ca3af",
      tabBarIcon: ({ color, size }) => {
        const iconName = route.name === "Tasks" ? "sparkles-outline" : "stats-chart-outline";
        return <Ionicons name={iconName as never} size={size} color={color} />;
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
      },
    })}
  >
    <Tab.Screen name="Tasks" component={TaskScreen} options={{ title: "Fokus" }} />
    <Tab.Screen name="Stats" component={StatsScreen} options={{ title: "Stats" }} />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { token, isReady } = useAuth();

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-[#071333]">
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="App" component={MainTabs} />
      ) : (
        <Stack.Screen name="Setup" component={SetupScreen} />
      )}
    </Stack.Navigator>
  );
};

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default function App() {
  return (
    <AppProviders>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}
