import React, { createContext, useContext } from 'react';
import { useImportLangConfig, LangCode } from '@/hooks/useImportLangConfig'

type LangConfigContextType = {
  selectedSource: LangCode;
  selectedDest: LangCode;
  setSelectedSource: React.Dispatch<React.SetStateAction<LangCode>>;
  setSelectedDest: React.Dispatch<React.SetStateAction<LangCode>>;
};

type LangConfigProviderProps = {
  children: React.ReactNode
}

const LangConfigContext = createContext<LangConfigContextType | undefined>(undefined);

export const LangConfigProvider = ({ children }: LangConfigProviderProps) => {
  const langConfig = useImportLangConfig();

  return (
    <LangConfigContext.Provider value={langConfig}>
      {children}
    </LangConfigContext.Provider>
  )
};

export const useLangConfig = (): LangConfigContextType => {
  const context = useContext(LangConfigContext);
  if (!context) {
    throw new Error('useLangConfig must be used within a LangConfigProvider');
  }
  return context;
};
