import React, { useState, useCallback, useRef, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, TextInput } from 'react-native';
import RadioButton from '@/components/RadioButton';
import Checkbox from '@/components/Checkbox';
import { ALL_LANGUAGES, LangCode, RECENT_LANGS_MAX_SIZE, updateLangConfigFile } from '@/hooks/useImportLangConfig';
import { useLangConfig } from '@/contexts/LangConfigContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

type TabDataItem = {
  type: 'header' | 'searchField',
  id: string,
  label: string,
} | {
  type: 'selectedItem' | 'recentItem' | 'allLanguageItem'
  id: string,
  langCode: LangCode
  label?: string
} | {
  type: 'empty'
  id: string
}

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

  const [sourceSearchQuery, setSourceSearchQuery] = useState<string>('');
  const [isSourceSearchFocused, setSourceSearchFocused] = useState<boolean>(false);
  const [destSearchQuery, setDestSearchQuery] = useState<string>('');
  const [isDestSearchFocused, setDestSearchFocused] = useState<boolean>(false);

  const sourceFlatListRef = useRef<FlatList<TabDataItem>>(null)
  const destFlatListRef = useRef<FlatList<TabDataItem>>(null)
  const recentUI = useRef<LangCode[]>(recentLanguages)
  const selectedSourceUI = useRef<LangCode>(selectedSource)
  const selectedDestUI = useRef<LangCode[]>(selectedDest)

const sourceTabData: TabDataItem[] = useMemo(() => [
  (selectedSourceUI.current.length > 0 
    ? { type: 'header' as const, id: 'selected', label: 'Last Selected' }
    : { type: 'empty', id: 'selected' }
  ),
  { 
    type: 'selectedItem' as const,
    id: selectedSourceUI.current,
    langCode: selectedSourceUI.current 
  },
  { type: 'header' as const, id: 'recent', label: 'Recent' },
  ...recentUI.current
    .filter(langCode => selectedSourceUI.current !== langCode)
    .map(langCode => ({
      type: 'recentItem' as const,
      id: langCode,
      langCode,
    })),
  { type: 'header' as const, id: 'allLanguages', label: 'All Languages' },
  { type: 'searchField' as const, id: 'searchField', label: 'Search...' },
  ...ALL_LANGUAGES.filter(
    option =>
      selectedSourceUI.current !== option.value &&
      !recentUI.current.includes(option.value) &&
      option.label.toLowerCase().startsWith(sourceSearchQuery.toLowerCase())
  ).map(option => ({
    type: 'allLanguageItem' as const,
    id: option.value,
    langCode: option.value,
    label: option.label,
  })),
], [sourceSearchQuery])

  const destTabData: TabDataItem[] = useMemo(() => [
    (selectedDestUI.current.length > 0
      ? { type: 'header' as const, id: 'selected', label: 'Last Selected' }
      : { type: 'empty', id: 'selected' }
    ),
    ...selectedDestUI.current.map(langCode => ({
      type: 'selectedItem' as const,
      id: langCode,
      langCode,
    })),
    { type: 'header' as const, id: 'recent', label: 'Recent' },
    ...recentUI.current
      .filter(langCode => !selectedDestUI.current.includes(langCode))
      .map(langCode => ({
        type: 'recentItem' as const,
        id: langCode,
        langCode,
    })),
    { type: 'header' as const, id: 'allLanguages', label: 'All Languages' },
    { type: 'searchField' as const, id: 'searchField', label: 'Search...' },
    ...ALL_LANGUAGES.filter(
      option =>
        !selectedDestUI.current.includes(option.value) &&
        !recentUI.current.includes(option.value) && 
        option.label.toLowerCase().startsWith(destSearchQuery.toLowerCase())
    ).map(option => ({
      type: 'allLanguageItem' as const,
      id: option.value,
      langCode: option.value,
      label: option.label,
    })),
  ], [destSearchQuery])


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

      <View style={styles.container}>
        {activeTab === 'source' && (
          <FlatList 
            ref={sourceFlatListRef}
            data={sourceTabData}
            keyExtractor={item => item.type + '-' + item.id}
            renderItem={({ item }) => {
              switch (item.type) {
                case 'header':
                  return (
                    <>
                      <View style={[
                        styles.titleFlex,
                        item.id === 'selected' && { marginTop: 0 },
                        item.id === 'recent' && selectedSourceUI.current.length === 0 && { marginTop: 0 },
                      ]}>
                        <ThemedText style={styles.titleText}>{item.label}</ThemedText>
                      </View>
                      <View style={styles.titleDivider} />
                    </>
                  );
                case 'searchField':
                  return (
                    <View style={styles.searchFieldContainer}>
                      <TextInput 
                        placeholder={item.label}
                        value={sourceSearchQuery}
                        onChangeText={setSourceSearchQuery}
                        onFocus={() => {
                          setSourceSearchFocused(true)
                          const indexOfSearchField = sourceTabData.findIndex((item) => item.type === 'searchField')
                          sourceFlatListRef.current?.scrollToIndex({ index: indexOfSearchField, viewPosition: 0 })
                        }}
                        onBlur={() => setSourceSearchFocused(false)}
                        style={[styles.searchField, isSourceSearchFocused && { borderColor: 'lightgrey' }]}
                      />
                    </View>
                  );
                case 'selectedItem':
                  return (
                    <RadioButton
                      label={ALL_LANGUAGES.find(l => l.value === item.langCode)?.label ?? ''}
                      selected={selectedSource === item.langCode}
                      onPress={() => onPressSourceLanguage(item.langCode)}
                    />
                  );
                case 'recentItem':
                  return (
                    <RadioButton
                      label={ALL_LANGUAGES.find(l => l.value === item.langCode)?.label ?? ''}
                      selected={selectedSource === item.langCode}
                      onPress={() => onPressSourceLanguage(item.langCode)}
                    />
                  );
                case 'allLanguageItem':
                  return (
                    <RadioButton
                      label={item.label ?? ''}
                      selected={selectedSource === item.langCode}
                      onPress={() => onPressSourceLanguage(item.langCode)}
                    />
                  );
                default:
                  return null;
              }
            }}
            contentContainerStyle={{ gap: 5, paddingBottom: 900 }}
          />
        )}

        {activeTab === 'target' && (
          <FlatList
            ref={destFlatListRef}
            data={destTabData}
            keyExtractor={item => item.type + '-' + item.id}
            renderItem={({ item }) => {
              switch (item.type) {
                case 'header':
                  return (
                    <>
                      <View style={[
                        styles.titleFlex,
                        item.id === 'selected' && { marginTop: 0 },
                        item.id === 'recent' && selectedDestUI.current.length === 0 && { marginTop: 0 },
                      ]}>
                        <ThemedText style={styles.titleText}>{item.label}</ThemedText>
                      </View>
                      <View style={styles.titleDivider} />
                    </>
                  );
                case 'searchField':
                  return (
                    <View style={styles.searchFieldContainer}>
                      <TextInput 
                        placeholder={item.label}
                        value={destSearchQuery}
                        onChangeText={setDestSearchQuery}
                        onFocus={() => {
                          setDestSearchFocused(true)
                          const indexOfSearchField = destTabData.findIndex((item) => item.type === 'searchField')
                          destFlatListRef.current?.scrollToIndex({ index: indexOfSearchField, viewPosition: 0 })
                        }}
                        onBlur={() => setDestSearchFocused(false)}
                        style={[styles.searchField, isDestSearchFocused && { borderColor: 'lightgrey' }]}
                      />
                    </View>
                  );
                case 'selectedItem':
                  return (
                    <Checkbox
                      label={ALL_LANGUAGES.find(l => l.value === item.langCode)?.label ?? ''}
                      checked={selectedDest.includes(item.langCode)}
                      onPress={() => onPressTargetLanguage(item.langCode)}
                      disabled={selectedSource === item.langCode}
                    />
                  );
                case 'recentItem':
                  return (
                    <Checkbox
                      label={ALL_LANGUAGES.find(l => l.value === item.langCode)?.label ?? ''}
                      checked={selectedDest.includes(item.langCode)}
                      onPress={() => onPressTargetLanguage(item.langCode)}
                      disabled={selectedSource === item.langCode}
                    />
                  );
                case 'allLanguageItem':
                  return (
                    <Checkbox
                      label={item.label ?? ''}
                      checked={selectedDest.includes(item.langCode)}
                      onPress={() => onPressTargetLanguage(item.langCode)}
                      disabled={selectedSource === item.langCode}
                    />
                  );
                default:
                  return null;
              }
            }}
            contentContainerStyle={{ gap: 5, paddingBottom: 900 }}
          />
        )}
      </View>
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
    marginTop: 20
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
  },
  searchFieldContainer: {
    marginTop: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchField: {
    color: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: 275,
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: '#333',
  }
});
