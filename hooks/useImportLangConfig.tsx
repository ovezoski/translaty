import { useCallback, useEffect, useState } from "react";
import { File, Paths } from 'expo-file-system'

export const ALL_LANGUAGES = [
  { label: 'Abkhaz', value: 'ab' },
  { label: 'Acehnese', value: 'ace' },
  { label: 'Acholi', value: 'ach' },
  { label: 'Afrikaans', value: 'af' },
  { label: 'Albanian', value: 'sq' },
  { label: 'Alur', value: 'alz' },
  { label: 'Amharic', value: 'am' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Armenian', value: 'hy' },
  { label: 'Assamese', value: 'as' },
  { label: 'Awadhi', value: 'awa' },
  { label: 'Aymara', value: 'ay' },
  { label: 'Azerbaijani', value: 'az' },
  { label: 'Balinese', value: 'ban' },
  { label: 'Bambara', value: 'bm' },
  { label: 'Bashkir', value: 'ba' },
  { label: 'Basque', value: 'eu' },
  { label: 'Batak Karo', value: 'btx' },
  { label: 'Batak Simalungun', value: 'bts' },
  { label: 'Batak Toba', value: 'bbc' },
  { label: 'Belarusian', value: 'be' },
  { label: 'Bemba', value: 'bem' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Betawi', value: 'bew' },
  { label: 'Bhojpuri', value: 'bho' },
  { label: 'Bikol', value: 'bik' },
  { label: 'Bosnian', value: 'bs' },
  { label: 'Breton', value: 'br' },
  { label: 'Bulgarian', value: 'bg' },
  { label: 'Buryat', value: 'bua' },
  { label: 'Cantonese', value: 'yue' },
  { label: 'Catalan', value: 'ca' },
  { label: 'Cebuano', value: 'ceb' },
  { label: 'Chichewa (Nyanja)', value: 'ny' },
  { label: 'Chinese (Simplified)', value: 'zh-CN' },
  { label: 'Chinese (Traditional)', value: 'zh-TW' },
  { label: 'Chuvash', value: 'cv' },
  { label: 'Corsican', value: 'co' },
  { label: 'Crimean Tatar', value: 'crh' },
  { label: 'Croatian', value: 'hr' },
  { label: 'Czech', value: 'cs' },
  { label: 'Danish', value: 'da' },
  { label: 'Dinka', value: 'din' },
  { label: 'Divehi', value: 'dv' },
  { label: 'Dogri', value: 'doi' },
  { label: 'Dombe', value: 'dov' },
  { label: 'Dutch', value: 'nl' },
  { label: 'Dzongkha', value: 'dz' },
  { label: 'English', value: 'en' },
  { label: 'Esperanto', value: 'eo' },
  { label: 'Estonian', value: 'et' },
  { label: 'Ewe', value: 'ee' },
  { label: 'Fijian', value: 'fj' },
  { label: 'Filipino (Tagalog)', value: 'fil' },
  { label: 'Finnish', value: 'fi' },
  { label: 'French', value: 'fr' },
  { label: 'French (French)', value: 'fr-FR' },
  { label: 'French (Canadian)', value: 'fr-CA' },
  { label: 'Frisian', value: 'fy' },
  { label: 'Fulfulde', value: 'ff' },
  { label: 'Ga', value: 'gaa' },
  { label: 'Galician', value: 'gl' },
  { label: 'Ganda (Luganda)', value: 'lg' },
  { label: 'Georgian', value: 'ka' },
  { label: 'German', value: 'de' },
  { label: 'Greek', value: 'el' },
  { label: 'Guarani', value: 'gn' },
  { label: 'Gujarati', value: 'gu' },
  { label: 'Haitian Creole', value: 'ht' },
  { label: 'Hakha Chin', value: 'cnh' },
  { label: 'Hausa', value: 'ha' },
  { label: 'Hawaiian', value: 'haw' },
  { label: 'Hebrew', value: 'he' },
  { label: 'Hiligaynon', value: 'hil' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Hmong', value: 'hmn' },
  { label: 'Hungarian', value: 'hu' },
  { label: 'Hunsrik', value: 'hrx' },
  { label: 'Icelandic', value: 'is' },
  { label: 'Igbo', value: 'ig' },
  { label: 'Iloko', value: 'ilo' },
  { label: 'Indonesian', value: 'id' },
  { label: 'Irish', value: 'ga' },
  { label: 'Italian', value: 'it' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Javanese', value: 'jv' },
  { label: 'Kannada', value: 'kn' },
  { label: 'Kapampangan', value: 'pam' },
  { label: 'Kazakh', value: 'kk' },
  { label: 'Khmer', value: 'km' },
  { label: 'Kiga', value: 'cgg' },
  { label: 'Kinyarwanda', value: 'rw' },
  { label: 'Kituba', value: 'ktu' },
  { label: 'Konkani', value: 'gom' },
  { label: 'Korean', value: 'ko' },
  { label: 'Krio', value: 'kri' },
  { label: 'Kurdish (Kurmanji)', value: 'ku' },
  { label: 'Kurdish (Sorani)', value: 'ckb' },
  { label: 'Kyrgyz', value: 'ky' },
  { label: 'Lao', value: 'lo' },
  { label: 'Latgalian', value: 'ltg' },
  { label: 'Latin', value: 'la' },
  { label: 'Latvian', value: 'lv' },
  { label: 'Ligurian', value: 'lij' },
  { label: 'Limburgan', value: 'li' },
  { label: 'Lingala', value: 'ln' },
  { label: 'Lithuanian', value: 'lt' },
  { label: 'Lombard', value: 'lmo' },
  { label: 'Luo', value: 'luo' },
  { label: 'Luxembourgish', value: 'lb' },
  { label: 'Macedonian', value: 'mk' },
  { label: 'Maithili', value: 'mai' },
  { label: 'Makassar', value: 'mak' },
  { label: 'Malagasy', value: 'mg' },
  { label: 'Malay', value: 'ms' },
  { label: 'Malay (Jawi)', value: 'ms-Arab' },
  { label: 'Malayalam', value: 'ml' },
  { label: 'Maltese', value: 'mt' },
  { label: 'Maori', value: 'mi' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Meadow Mari', value: 'chm' },
  { label: 'Meiteilon (Manipuri)', value: 'mni-Mtei' },
  { label: 'Minang', value: 'min' },
  { label: 'Mizo', value: 'lus' },
  { label: 'Mongolian', value: 'mn' },
  { label: 'Myanmar (Burmese)', value: 'my' },
  { label: 'Ndebele (South)', value: 'nr' },
  { label: 'Nepalbhasa (Newari)', value: 'new' },
  { label: 'Nepali', value: 'ne' },
  { label: 'Northern Sotho (Sepedi)', value: 'nso' },
  { label: 'Norwegian', value: 'no' },
  { label: 'Nuer', value: 'nus' },
  { label: 'Occitan', value: 'oc' },
  { label: 'Odia (Oriya)', value: 'or' },
  { label: 'Oromo', value: 'om' },
  { label: 'Pangasinan', value: 'pag' },
  { label: 'Papiamento', value: 'pap' },
  { label: 'Pashto', value: 'ps' },
  { label: 'Persian', value: 'fa' },
  { label: 'Polish', value: 'pl' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Portuguese (Portugal)', value: 'pt-PT' },
  { label: 'Portuguese (Brazil)', value: 'pt-BR' },
  { label: 'Punjabi', value: 'pa' },
  { label: 'Punjabi (Shahmukhi)', value: 'pa-Arab' },
  { label: 'Quechua', value: 'qu' },
  { label: 'Romani', value: 'rom' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Rundi', value: 'rn' },
  { label: 'Russian', value: 'ru' },
  { label: 'Samoan', value: 'sm' },
  { label: 'Sango', value: 'sg' },
  { label: 'Sanskrit', value: 'sa' },
  { label: 'Scots Gaelic', value: 'gd' },
  { label: 'Serbian', value: 'sr' },
  { label: 'Sesotho', value: 'st' },
  { label: 'Seychellois Creole', value: 'crs' },
  { label: 'Shan', value: 'shn' },
  { label: 'Shona', value: 'sn' },
  { label: 'Sicilian', value: 'scn' },
  { label: 'Silesian', value: 'szl' },
  { label: 'Sindhi', value: 'sd' },
  { label: 'Sinhala (Sinhalese)', value: 'si' },
  { label: 'Slovak', value: 'sk' },
  { label: 'Slovenian', value: 'sl' },
  { label: 'Somali', value: 'so' },
  { label: 'Spanish', value: 'es' },
  { label: 'Sundanese', value: 'su' },
  { label: 'Swahili', value: 'sw' },
  { label: 'Swati', value: 'ss' },
  { label: 'Swedish', value: 'sv' },
  { label: 'Tajik', value: 'tg' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Tatar', value: 'tt' },
  { label: 'Telugu', value: 'te' },
  { label: 'Tetum', value: 'tet' },
  { label: 'Thai', value: 'th' },
  { label: 'Tigrinya', value: 'ti' },
  { label: 'Tsonga', value: 'ts' },
  { label: 'Tswana', value: 'tn' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Turkmen', value: 'tk' },
  { label: 'Twi (Akan)', value: 'ak' },
  { label: 'Ukrainian', value: 'uk' },
  { label: 'Urdu', value: 'ur' },
  { label: 'Uyghur', value: 'ug' },
  { label: 'Uzbek', value: 'uz' },
  { label: 'Vietnamese', value: 'vi' },
  { label: 'Welsh', value: 'cy' },
  { label: 'Xhosa', value: 'xh' },
  { label: 'Yiddish', value: 'yi' },
  { label: 'Yoruba', value: 'yo' },
  { label: 'Yucatec Maya', value: 'yua' },
  { label: 'Zulu', value: 'zu' },
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
