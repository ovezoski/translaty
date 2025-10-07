import { useCallback, useEffect, useState } from "react";
import { File, Paths } from 'expo-file-system'

export const ALL_LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Français', value: 'fr' },
  { label: 'Español', value: 'es' },
  { label: 'Македонски', value: 'mk' },
  { label: 'Српски', value: 'sr' },
] as const

export type LangCode = typeof ALL_LANGUAGES[number]['value']

export type LangConfig = {
  sourceLang: LangCode
  destLang: LangCode[]
  recentLangs: LangCode[]
}

export const LANG_CONFIG_FILE_NAME: string = 'languages.txt'
export const RECENT_LANGS_MAX_SIZE = 3
const DEFAULT_LANG_CONFIG: LangConfig = { sourceLang: 'en', destLang: ['de'], recentLangs: ['en', 'de', 'mk'] }

export const updateLangConfigFile = (sourceVal: LangCode, destVal: LangCode[], recentVal: LangCode[]) => {
  const langConfigFile = new File(Paths.document, LANG_CONFIG_FILE_NAME);
  if (!langConfigFile.exists) {
    return;
  }

  const newLangConfig: LangConfig = {
    sourceLang: sourceVal,
    destLang: destVal,
    recentLangs: recentVal,
  };
  langConfigFile.write(JSON.stringify(newLangConfig));
}


export const useImportLangConfig = () => {
  const [selectedSource, setSelectedSource] = useState<LangConfig['sourceLang']>(DEFAULT_LANG_CONFIG.sourceLang);
  const [selectedDest, setSelectedDest] = useState<LangConfig['destLang']>(DEFAULT_LANG_CONFIG.destLang);
  const [recentLanguages, setRecentLanguages] = useState<LangConfig['recentLangs']>(DEFAULT_LANG_CONFIG.recentLangs);

  const isLangConfigValid = useCallback((obj: unknown): obj is LangConfig => {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'sourceLang' in obj &&
      'destLang' in obj &&
      'recentLangs' in obj &&
      ALL_LANGUAGES.some(lang => lang.value === obj.sourceLang) &&
      Array.isArray(obj.destLang) &&
      obj.destLang.every((lang) => ALL_LANGUAGES.some((opt) => opt.value === lang)) &&
      Array.isArray(obj.recentLangs) &&
      obj.recentLangs.every((lang) => ALL_LANGUAGES.some((opt) => opt.value === lang))
    );
  }, [])


  const initReadLangConfig = useCallback((): LangConfig => {
    const langConfigFile = new File(Paths.document, LANG_CONFIG_FILE_NAME)
    if (!langConfigFile.exists) {
      langConfigFile.create()
    }

    let importedConfig = (() => {
      try {
        return JSON.parse(langConfigFile.textSync());
      } catch {
        return {};
      }
    })();

    if (!isLangConfigValid(importedConfig)) {
      langConfigFile.write(JSON.stringify(DEFAULT_LANG_CONFIG))
      importedConfig = DEFAULT_LANG_CONFIG
    }

    return importedConfig
  }, [isLangConfigValid])

  useEffect(() => {
    const importedConfig = initReadLangConfig()

    setSelectedSource(importedConfig.sourceLang)
    setSelectedDest(importedConfig.destLang)
    setRecentLanguages(importedConfig.recentLangs)
  }, [initReadLangConfig])

  return { 
    selectedSource,
    selectedDest,
    setSelectedSource,
    setSelectedDest,
    recentLanguages,
    setRecentLanguages,
  }

}
