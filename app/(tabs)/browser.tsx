import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";

const injectedCSS = `
  * {
    -webkit-touch-callout: none; /* Disable iOS link preview */
  }
`;

export default function Browser() {
  const colorScheme = useColorScheme();

  const [text, setText] = useState<string>("https://www.finki.ukim.mk/mk/student-announcement");
  const [urlToLoad, setUrlToLoad] = useState<string>("");
  const prevUrl = useRef<string[]>([]);

  const [selection, setSelection] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [translation, setTranslation] = useState<string>("");
  const [selectionIsExpanded, setSelectionIsExpanded] = useState<boolean>(false);

  const handleLoadUrlPress = () => {
    if (text) {
      setUrlToLoad(text);
    }
  };

  const handleGoBack = () => {
    setUrlToLoad(prevUrl.current.pop() ?? "")
  };

  const handleClear = () => {
    setSelection("");
    setTranslation("");
    setSelectionIsExpanded(false)
  };

  const handleTranslate = async () => {
    setLoading(true);
    const CLOUD_TRANSLATION_API_KEY = process.env.EXPO_PUBLIC_CLOUD_TRANSLATION_API_KEY;

    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${CLOUD_TRANSLATION_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: selection, source: 'mk', target: 'de', format: 'text' }),
      });
      const res = await response.json();
      const translatedText = res.data.translations[0].translatedText;
      setTranslation(translatedText);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSelectionIsExpanded(true);
    }
  };

  if (urlToLoad) {
    return (
      <ThemedView style={styles.flexContainer}>
        <WebView
          source={{ uri: urlToLoad }}
          style={styles.webview}
          onMessage={(event) => {
            setSelection(event.nativeEvent.data);
            setTranslation("")
          }}
          onNavigationStateChange={(navState) => {
            if (navState.url !== urlToLoad) {
              prevUrl.current.push(urlToLoad);
              setUrlToLoad(navState.url);
            }
          }}
          injectedJavaScript={`
            document.addEventListener("selectionchange", function() {
              var selection = window.getSelection().toString();
              window.ReactNativeWebView.postMessage(selection ?? "");
            });

            var style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(\`${injectedCSS}\`));
            document.head.appendChild(style);
            document.addEventListener('contextmenu', e => e.preventDefault());
          `}
        />
        {selection && (
          <ThemedView
            style={{ ...styles.selectionContainer, ...(selectionIsExpanded && { height: '50%' }) }}
          >
            <TouchableOpacity
              onPress={() => setSelectionIsExpanded(true)}
              style={styles.selectionTouchableOpacity}
              disabled={selectionIsExpanded}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ width: "94%" }}>
                  <ThemedText type="defaultSemiBold">Selected Text:</ThemedText>
                  <ThemedText>{selection}</ThemedText>
                </View>
                <View style={{ width: "6%" }}>
                {selectionIsExpanded && (
                  <TouchableOpacity onPress={() => setSelectionIsExpanded(false)}>
                    <ThemedText type="link" style={{ fontSize: 25, fontWeight: 700 }}>X</ThemedText>
                  </TouchableOpacity>
                )}
                </View>
              </View>
              <View>
                {translation && (
                  <>
                    <ThemedText type="defaultSemiBold">Translation:</ThemedText>
                    <ThemedText>{translation}</ThemedText>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </ThemedView>
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={{ width: "33.3%", height: "100%", justifyContent: "center", alignItems: "center" }} onPress={handleGoBack}>
            <ThemedText type="link">Back</ThemedText>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator style={{ width: "33.3%" }} />
          ) : (
          <TouchableOpacity 
            style={{ width: "33.3%", height: "100%", justifyContent: "center", alignItems: "center" }} 
            onPress={handleTranslate} 
            disabled={selection === ""}
          >
            <ThemedText type={selection === "" ? 'default' : 'link'}>Translate</ThemedText>
          </TouchableOpacity>
          )}
          <TouchableOpacity style={{ width: "33.3%", height: "100%", justifyContent: "center", alignItems: "center" }} onPress={handleClear}>
            <ThemedText type="link">Clear</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
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
      <Button title="Load URL" onPress={handleLoadUrlPress} />
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
    display: "flex",
    flexDirection: "column",
    paddingTop: "11%",
    height: "90%",
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
    height: "10%",
    padding: 10,
  },
  selectionTouchableOpacity: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  webview: {
    height: "70%"
  },
  buttonsContainer: {
    height: "10%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  buttonsContainerButtons: {
    width: "33.3%",
  }
});
