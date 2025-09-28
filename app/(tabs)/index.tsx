import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <>
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        <TouchableOpacity 
          onPress={() => router.push('/third')}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={32} color="white" />
        </TouchableOpacity>
        </>
      }
    >
      <ThemedView>
        <ThemedText>
          Мобилна апликација со користење на API за машински превод. Тоа е да се
          направи апликација (за Android и IOS) која ќе има вграден browser со
          кој ќе може да се сурфа на Интернет. И ако се притисне врз некој збор,
          ќе се повика Google Translate API за неколку јазици и како облачиња
          околу зборот ќе се дадат преводите на тој збор. Од кој на кои јазици
          ќе се преведува ќе има посебна страна за поставување (Settings).
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  settingsButton: {
    position: "absolute",
    top: 56,
    right: 19,
  },
});
