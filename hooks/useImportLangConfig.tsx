import { useCallback, useEffect, useState } from "react";
import { File, Paths } from 'expo-file-system'

export const ALL_LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Français', value: 'fr' },
  { label: 'Македонски', value: 'mk' },
] as const

export type LangCode = typeof ALL_LANGUAGES[number]['value']

export type LangConfig = {
  sourceLang: LangCode
  destLang: LangCode
}

export const LANG_CONFIG_FILE_NAME: string = 'languages.txt'
const DEFAULT_LANG_CONFIG: LangConfig = { sourceLang: 'en', destLang: 'de' }

export const useImportLangConfig = () => {
  const [selectedSource, setSelectedSource] = useState<LangCode>('en');
  const [selectedDest, setSelectedDest] = useState<LangCode>('de');

  const isLangConfigValid = useCallback((obj: unknown): obj is LangConfig => {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'sourceLang' in obj &&
      'destLang' in obj &&
      ALL_LANGUAGES.some(lang => lang.value === obj.sourceLang) &&
      ALL_LANGUAGES.some(lang => lang.value === obj.destLang)
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
  }, [initReadLangConfig])

  return { selectedSource, selectedDest, setSelectedSource, setSelectedDest }

}
