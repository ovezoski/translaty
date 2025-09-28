import { ScrollView, StyleSheet, View } from 'react-native'
import { ThemedText } from "@/components/ThemedText";
import RadioButton from "@/components/RadioButton";
import { useCallback } from "react";
import { File, Paths } from 'expo-file-system'
import { ALL_LANGUAGES, LANG_CONFIG_FILE_NAME, LangCode, LangConfig } from "@/hooks/useImportLangConfig";
import { useLangConfig } from "@/contexts/LangConfigContext";
import Checkbox from "@/components/Checkbox";

export default function ThirdScreen() {
  const { 
    selectedSource,
    setSelectedSource,
    selectedDest,
    setSelectedDest 
  } = useLangConfig()

  const updateLangConfigFile = useCallback((sourceVal: LangCode, destVal: LangCode[]) => {
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
    <ScrollView style={styles.container}>
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
                if (selectedDest.includes(option.value)) {
                  newDestVal = selectedDest.filter((destLang) => destLang !== option.value)
                }

                setSelectedSource(newSourceVal)
                setSelectedDest(newDestVal)
                updateLangConfigFile(newSourceVal, newDestVal)
              }}
            />
          ))}
        </View>
      </View>

      <View style={{ gap: 10, marginTop: 20 }}>
        <View>
          <ThemedText type="title">Target language:</ThemedText>
        </View>
        <View>
          {ALL_LANGUAGES.map(option => (
            <Checkbox
              key={`dest-${option.value}`}
              label={option.label}
              checked={selectedDest.includes(option.value)}
              onPress={() => {
                let newDestList: LangCode[]
                if (selectedDest.includes(option.value)) {
                  newDestList = selectedDest.filter(val => val !== option.value)
                } else {
                  newDestList = [...selectedDest, option.value]
                }
                setSelectedDest(newDestList)
                updateLangConfigFile(selectedSource, newDestList)
              }}
              disabled={selectedSource === option.value}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 20,
  }
});
