import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import RadioButton from '@/components/RadioButton';
import Checkbox from '@/components/Checkbox';
import { File, Paths } from 'expo-file-system';
import { ALL_LANGUAGES, LANG_CONFIG_FILE_NAME, LangCode, LangConfig } from '@/hooks/useImportLangConfig';
import { useLangConfig } from '@/contexts/LangConfigContext';
import { ThemedView } from '@/components/ThemedView';

export default function ThirdScreen() {
  const {
    selectedSource,
    setSelectedSource,
    selectedDest,
    setSelectedDest,
  } = useLangConfig();

  const [activeTab, setActiveTab] = useState<'source' | 'target'>('source');

  const updateLangConfigFile = useCallback((sourceVal: LangCode, destVal: LangCode[]) => {
    const langConfigFile = new File(Paths.document, LANG_CONFIG_FILE_NAME);
    if (!langConfigFile.exists) {
      return;
    }
    const newLangConfig: LangConfig = {
      sourceLang: sourceVal,
      destLang: destVal,
    };
    langConfigFile.write(JSON.stringify(newLangConfig));
  }, []);

  return (
    <ThemedView>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'source' && styles.activeTab]}
          onPress={() => setActiveTab('source')}
        >
          <Text style={[styles.tabText, activeTab === 'source' && styles.activeTabText]}>Source Language</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'target' && styles.activeTab]}
          onPress={() => setActiveTab('target')}
        >
          <Text style={[styles.tabText, activeTab === 'target' && styles.activeTabText]}>Target Languages</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {activeTab === 'source' && (
          <View style={{ gap: 10 }}>
            <View style={{ gap: 5 }}>
              {ALL_LANGUAGES.map(option => (
                <RadioButton
                  key={`source-${option.value}`}
                  label={option.label}
                  selected={selectedSource === option.value}
                  onPress={() => {
                    const newSourceVal = option.value;

                    let newDestVal = selectedDest;
                    if (selectedDest.includes(option.value)) {
                      newDestVal = selectedDest.filter(destLang => destLang !== option.value);
                    }

                    setSelectedSource(newSourceVal);
                    setSelectedDest(newDestVal);
                    updateLangConfigFile(newSourceVal, newDestVal);
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {activeTab === 'target' && (
          <View style={{ gap: 10 }}>
            <View style={{ gap: 5 }}>
              {ALL_LANGUAGES.map(option => (
                <Checkbox
                  key={`dest-${option.value}`}
                  label={option.label}
                  checked={selectedDest.includes(option.value)}
                  onPress={() => {
                    let newDestList: LangCode[];
                    if (selectedDest.includes(option.value)) {
                      newDestList = selectedDest.filter(val => val !== option.value);
                    } else {
                      newDestList = [...selectedDest, option.value];
                    }
                    setSelectedDest(newDestList);
                    updateLangConfigFile(selectedSource, newDestList);
                  }}
                  disabled={selectedSource === option.value}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 20,
    height: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    height: 55,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  tabButton: {
    height: '100%',
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: 'white',
  },
  activeTabText: {
    color: 'white',
  },
});
