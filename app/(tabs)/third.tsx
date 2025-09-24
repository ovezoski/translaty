import { Image } from "expo-image";
import { StyleSheet, View } from 'react-native'
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import RadioButton from "@/components/RadioButton";
import { useCallback } from "react";
import { File, Paths } from 'expo-file-system'
import { ALL_LANGUAGES, LANG_CONFIG_FILE_NAME, LangCode, LangConfig } from "@/hooks/useImportLangConfig";
import { useLangConfig } from "@/contexts/LangConfigContext";

export default function ThirdScreen() {
  const { 
    selectedSource,
    setSelectedSource,
    selectedDest,
    setSelectedDest 
  } = useLangConfig()

  const updateLangConfigFile = useCallback((sourceVal: LangCode, destVal: LangCode) => {
    const langConfigFile = new File(Paths.document, LANG_CONFIG_FILE_NAME)
    if (!langConfigFile.exists) {
      return
    }

    const newLangConfig: LangConfig = { 
      sourceLang: sourceVal,
      destLang: destVal 
    }
    langConfigFile.write(JSON.stringify(newLangConfig))
  }, [])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
    <View style={{ gap: 10 }}>
      <View>
        <ThemedText type="title">Source language:</ThemedText>
      </View>
      <View>
        {ALL_LANGUAGES.map(option => (
          <RadioButton
            key={`source-${option.value}`}
            label={option.label}
            selected={selectedSource === option.value}
            onPress={() => {
              const newSourceVal = option.value

              let newDestVal = selectedDest
              if (selectedDest === option.value) {
                const indexOfCurrValue = ALL_LANGUAGES.findIndex(opt => opt.value === option.value)
                const indexOfNextValue = (indexOfCurrValue + 1) % ALL_LANGUAGES.length
                newDestVal = ALL_LANGUAGES[indexOfNextValue].value
              }

              setSelectedSource(newSourceVal)
              setSelectedDest(newDestVal)
              updateLangConfigFile(newSourceVal, newDestVal)
            }}
          />
        ))}
      </View>
    </View>

    <View style={{ gap: 10, marginTop: 10 }}>
      <View>
        <ThemedText type="title">Destination language:</ThemedText>
      </View>
      <View>
        {ALL_LANGUAGES.map(option => (
          <RadioButton
            key={`dest-${option.value}`}
            label={option.label}
            selected={selectedDest === option.value}
            onPress={() => {
              const newDestVal = option.value

              setSelectedDest(newDestVal)
              updateLangConfigFile(selectedSource, newDestVal)
            }}
            disabled={selectedSource === option.value}
          />
        ))}
      </View>
    </View>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
