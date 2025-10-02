import React, { useState, useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import RadioButton from '@/components/RadioButton';
import Checkbox from '@/components/Checkbox';
import { ALL_LANGUAGES, LangCode, RECENT_LANGS_MAX_SIZE, updateLangConfigFile } from '@/hooks/useImportLangConfig';
import { useLangConfig } from '@/contexts/LangConfigContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function ThirdScreen() {
  const {
    selectedSource,
    setSelectedSource,
    selectedDest,
    setSelectedDest,
    recentLanguages,
    setRecentLanguages,
  } = useLangConfig();

  const [activeTab, setActiveTab] = useState<'source' | 'target'>('source');
  const recentUI = useRef<LangCode[]>(recentLanguages)
  const selectedDestUI = useRef<LangCode[]>(selectedDest)

  const getNewRecentLanguages = useCallback(
    (sourceVal: LangCode, recentLangsParam: LangCode[]): LangCode[] => {
      const newRecentLanguages = [...recentLangsParam]
      if (!newRecentLanguages.includes(sourceVal)) {
        newRecentLanguages.unshift(sourceVal)
      }
      if (newRecentLanguages.length > RECENT_LANGS_MAX_SIZE) {
        newRecentLanguages.pop()
      }

      return newRecentLanguages
    }, [])

  const onPressSourceLanguage = useCallback((optionValue: LangCode) => {
    const newSourceVal = optionValue;

    let newDestVal = selectedDest;
    if (selectedDest.includes(optionValue)) {
      newDestVal = selectedDest.filter(destLang => destLang !== optionValue);
    }

    const recentLangsVal = getNewRecentLanguages(newSourceVal, recentLanguages)

    setSelectedSource(newSourceVal);
    setSelectedDest(newDestVal);
    setRecentLanguages(recentLangsVal);
    updateLangConfigFile(newSourceVal, newDestVal, recentLangsVal);
    selectedDestUI.current = selectedDestUI.current.filter((lang) => lang !== newSourceVal)

  }, [getNewRecentLanguages, recentLanguages, selectedDest, setRecentLanguages, setSelectedDest, setSelectedSource])

  const onPressTargetLanguage = useCallback((optionValue: LangCode) => {
    let newDestList: LangCode[];
    let recentLangsVal = recentLanguages

    if (selectedDest.includes(optionValue)) {
      newDestList = selectedDest.filter(val => val !== optionValue);
    } else {
      newDestList = [...selectedDest, optionValue];

      recentLangsVal = getNewRecentLanguages(optionValue, recentLanguages)
    }

    setSelectedDest(newDestList);
    setRecentLanguages(recentLangsVal)
    updateLangConfigFile(selectedSource, newDestList, recentLangsVal);

  }, [getNewRecentLanguages, recentLanguages, selectedDest, selectedSource, setRecentLanguages, setSelectedDest])

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
          <View style={{ gap: 20 }}>
            <View style={{ gap: 5 }}>
              <View style={styles.titleFlex}>
                <ThemedText style={styles.titleText}>Recent</ThemedText>
              </View>
              <View style={styles.titleDivider}></View>

              {recentUI.current.map((langCode) => (
                <RadioButton
                  key={`recent-${langCode}`}
                  label={ALL_LANGUAGES.find((lang) => lang.value === langCode)?.label ?? ''}
                  selected={selectedSource === langCode}
                  onPress={() => onPressSourceLanguage(langCode)}
                />
              ))}
            </View>

            <View style={{ gap: 5 }}>
              <View style={styles.titleFlex}>
                <ThemedText style={styles.titleText}>All Languages</ThemedText>
              </View>
              <View style={styles.titleDivider}></View>

              {ALL_LANGUAGES
                .filter(option => !recentUI.current.includes(option.value))
                .map(option => (
                  <RadioButton
                    key={`source-${option.value}`}
                    label={option.label}
                    selected={selectedSource === option.value}
                    onPress={() => onPressSourceLanguage(option.value)}
                  />
                ))}
            </View>
          </View>
        )}

        {activeTab === 'target' && (
          <View style={{ gap: 20 }}>
            {selectedDestUI.current.length > 0 && (
              <View style={{ gap: 5 }}>
                <View style={styles.titleFlex}>
                  <ThemedText style={styles.titleText}>Selected</ThemedText>
                </View>
                <View style={styles.titleDivider}></View>

                {selectedDestUI.current.map((langCode) => (
                  <Checkbox
                    key={`selected-${langCode}`}
                    label={ALL_LANGUAGES.find((lang) => lang.value === langCode)?.label ?? ''}
                    checked={selectedDest.includes(langCode)}
                    onPress={() => onPressTargetLanguage(langCode)}
                    disabled={selectedSource === langCode}
                  />
                ))}
              </View>
            )}

            {recentUI.current
              .filter((langCode) => !selectedDestUI.current.includes(langCode))
              .length > 0 && (
                <View style={{ gap: 5 }}>
                  <View style={styles.titleFlex}>
                    <ThemedText style={styles.titleText}>Recent</ThemedText>
                  </View>
                  <View style={styles.titleDivider}></View>

                  {recentUI.current
                    .filter((langCode) => !selectedDestUI.current.includes(langCode))
                    .map((langCode) => (
                      <Checkbox
                        key={`recent-${langCode}`}
                        label={ALL_LANGUAGES.find((lang) => lang.value === langCode)?.label ?? ''}
                        checked={selectedDest.includes(langCode)}
                        onPress={() => onPressTargetLanguage(langCode)}
                        disabled={selectedSource === langCode}
                      />
                    ))}
                </View>
              )}

            <View style={{ gap: 5 }}>
              <View style={styles.titleFlex}>
                <ThemedText style={styles.titleText}>All Languages</ThemedText>
              </View>
              <View style={styles.titleDivider}></View>

              {ALL_LANGUAGES
                .filter(option =>
                  !selectedDestUI.current.includes(option.value) &&
                  !recentUI.current.includes(option.value)
                )
                .map(option => (
                  <Checkbox
                    key={`dest-${option.value}`}
                    label={option.label}
                    checked={selectedDest.includes(option.value)}
                    onPress={() => onPressTargetLanguage(option.value)}
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
  titleFlex: {
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleText: {
    paddingLeft: 5,
    color: "#575757",
  },
  titleDivider: {
    width: "86%",
    marginLeft: '7%',
    height: 2,
    backgroundColor: '#333',
    opacity: 0.5,
  }
});
