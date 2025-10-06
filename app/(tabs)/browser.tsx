import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLangConfig } from "@/contexts/LangConfigContext";
import { LangCode } from "@/hooks/useImportLangConfig";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import * as Clipboard from 'expo-clipboard';

const injectedCSS = `
  * {
    -webkit-touch-callout: none !important;
  }
`;

type Translation = {
  lang: LangCode
  translatedText: string
}

export default function Browser() {
  const colorScheme = useColorScheme();
  const { selectedSource, selectedDest } = useLangConfig()
  const webViewRef = useRef<WebView>(null);

  // const [text, setText] = useState<string>("https://www.finki.ukim.mk/mk/student-announcement");
  const [text, setText] = useState<string>("https://www.google.com");
  const [urlToLoad, setUrlToLoad] = useState<string>("");
  const [canGoBack, setCanGoBack] = useState(false);

  const [selection, setSelection] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectionIsExpanded, setSelectionIsExpanded] = useState<boolean>(false);

  const handleLoadUrlPress = () => {
    if (text) {
      setUrlToLoad(text);
    }
  };

  const handleGoBack = () => {
    if (canGoBack && webViewRef?.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  const handleClear = () => {
    setSelection("");
    setTranslations([]);
    setUrlToLoad("")
    setSelectionIsExpanded(false)
  };

  const handleTranslate = async (sourceLangParam: LangCode, destLangParam: LangCode) => {
    setLoading(true);
    const CLOUD_TRANSLATION_API_KEY = process.env.EXPO_PUBLIC_CLOUD_TRANSLATION_API_KEY;

    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${CLOUD_TRANSLATION_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: selection, source: sourceLangParam, target: destLangParam, format: 'text' }),
      });
      const res = await response.json();
      const translatedText: string = res.data.translations[0].translatedText;
      setTranslations((prev) => [...prev, { lang: destLangParam, translatedText: translatedText }]);
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
          ref={webViewRef}
          menuItems={[{ key: 'copy', label: 'Copy' }]}
          onCustomMenuSelection={({ nativeEvent }) => {
            const selectedKey = nativeEvent.key;
            if (selectedKey.startsWith('copy')) {
              Clipboard.setStringAsync(selection);
            }
          }}
          source={{ uri: urlToLoad }}
          style={styles.webview}
          onMessage={(event) => {
            setSelection(event.nativeEvent.data);
            setTranslations([])
          }}
          onNavigationStateChange={(navState) => {
            setUrlToLoad(navState.url);
            setCanGoBack(navState.canGoBack)
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
            document.addEventListener('contextmenu', e => {
              e.preventDefault()
            });
          `}
        />
        {selection && (
          <ThemedView
            style={{ ...styles.selectionContainer, ...(selectionIsExpanded && { height: '50%' }) }}
          >
            <TouchableOpacity
              onPress={() => setSelectionIsExpanded(true)}
              disabled={selectionIsExpanded}
            >
              <ScrollView 
                contentContainerStyle={styles.selectionTouchableOpacity} 
                showsVerticalScrollIndicator={false}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingRight: 5, }}>
                  <View style={{ width: "94%" }}>
                    <ThemedText type="defaultSemiBold">Selected Text:</ThemedText>
                    <ThemedText>{selection}</ThemedText>
                  </View>
                  <View style={{ width: "6%" }}>
                    {selectionIsExpanded && (
                      <TouchableOpacity onPress={() => setSelectionIsExpanded(false)}>
                        <Ionicons name="close-sharp" size={27} color="#0a7ea4" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View>
                  {translations.map((tr, idx) => (
                    <View key={idx} style={{ paddingBottom: 10 }}>
                      <ThemedText type="defaultSemiBold">{`Translation (${tr.lang.toUpperCase()})`}:</ThemedText>
                      <ThemedText>{tr.translatedText}</ThemedText>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </TouchableOpacity>
          </ThemedView>
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            onPress={handleGoBack}
            disabled={!canGoBack}
            style={{ width: "33.3%", height: "100%", justifyContent: "center", alignItems: "center" }} 
          >
            <ThemedText type={canGoBack ? 'link' : 'default'}>Back</ThemedText>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator style={{ width: "33.3%" }} />
          ) : (
          <TouchableOpacity 
            style={{ width: "33.3%", height: "100%", justifyContent: "center", alignItems: "center" }} 
            onPress={() => {
              setTranslations([])
              selectedDest.forEach((dl) => handleTranslate(selectedSource, dl))
            }} 
            disabled={selection === ""}
          >
            <ThemedText type={selection === "" ? 'default' : 'link'}>Translate</ThemedText>
          </TouchableOpacity>
          )}
          <TouchableOpacity style={{ width: "33.3%", height: "100%", justifyContent: "center", alignItems: "center" }} onPress={handleClear}>
            <ThemedText type="link">Exit</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/third')}>
          <Ionicons name="settings-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>

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
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 0.13,
    width: '100%',
    paddingInline: "5%",
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  container: {
    flex: 0.87,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: "35%",
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
    height: "12.2%",
    padding: 10,
  },
  selectionTouchableOpacity: {
    display: 'flex',
    flexDirection: 'column',
    gap: 25,
  },
  webview: {
    height: "70%",
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
