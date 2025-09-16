import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";

export default function Browser() {
  const [text, setText] = useState<string>("https://www.finki.ukim.mk/mk/student-announcement");
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

  const handleClear = () => {
    setSelection("");
    setTranslation("");
  };

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: selection }),
      });
      const data = await response.json();
      setTranslation(data.translation);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [selection, setSelection] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [translation, setTranslation] = useState<string>("");
  if (urlToLoad) {
    return (
      <View style={styles.flexContainer}>
        <WebView
          source={{ uri: urlToLoad }}
          style={styles.flexContainer}
          onMessage={(event) => {
            setSelection(event.nativeEvent.data);
          }}
          injectedJavaScript={`
            document.addEventListener("selectionchange", function() {
              var selection = window.getSelection().toString();
              if (selection) {
                window.ReactNativeWebView.postMessage(selection);
              }
            });
          `}
        />
        {selection ? (
          <ThemedView style={styles.selectionContainer}>
            <ThemedText type="defaultSemiBold">Selected Text:</ThemedText>
            <ThemedText>{selection}</ThemedText>
            {translation ? (
              <>
                <ThemedText type="defaultSemiBold">Translation:</ThemedText>
                <ThemedText>{translation}</ThemedText>
              </>
            ) : null}
          </ThemedView>
        ) : null}
        <Button title="Go Back" onPress={handleGoBack} />
        <Button title="Translate" onPress={handleTranslate} />
        <Button title="Clear" onPress={handleClear} />
        {loading && <ActivityIndicator />}
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
  selectionContainer: {
    padding: 10,
  },
});
