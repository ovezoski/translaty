import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function Browser() {
  const [text, setText] = useState<string>("");
  const [urlToLoad, setUrlToLoad] = useState<string>("");
  const colorScheme = useColorScheme();

  const handlePress = () => {
    if (text) {
      setUrlToLoad(text);
    }
  };

  const handleGoBack = () => {
    setUrlToLoad("");
  };

  if (urlToLoad) {
    return (
      <View style={styles.flexContainer}>
        <WebView source={{ uri: urlToLoad }} style={styles.flexContainer} />
        <Button title="Go Back" onPress={handleGoBack} />
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Browser</ThemedText>
      <ThemedView style={styles.separator} />
      <TextInput
        style={[
          styles.input,
          {
            color: colorScheme === "dark" ? "#fff" : "#000",
            borderColor: colorScheme === "dark" ? "#fff" : "#000",
          },
        ]}
        placeholder="Enter URL"
        onChangeText={setText}
        value={text}
        placeholderTextColor={colorScheme === "dark" ? "#888" : "#888"}
      />
      <Button title="Load URL" onPress={handlePress} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  flexContainer: {
    flex: 1,
  },
  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
