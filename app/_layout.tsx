import { Tabs } from "expo-router";
import { FavoritesProvider } from "../context/FavoritesContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FavoritesProvider>
        <Tabs screenOptions={{ headerShown: false }}>
          {/* Visible tabs */}
          <Tabs.Screen
            name="index"
            options={{
              title: "Feed",
            }}
          />
          <Tabs.Screen
            name="saved"
            options={{
              title: "Saved",
            }}
          />

          {/* Hidden routes – not shown in the tab bar */}
          <Tabs.Screen
            name="detail"
            options={{
              href: null, // hide "detail" from bottom tabs
            }}
          />
        </Tabs>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}
