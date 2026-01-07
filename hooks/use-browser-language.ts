import { LanguageConfigType, SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/constants';
import { useState, useMemo, useEffect } from 'react';

const useLanguageConfig = () => {
    const browserLanguage = useMemo(() => navigator.language.split('-')[0].toLowerCase(), []);

    const [languageConfig, setLanguageConfig] = useState<LanguageConfigType>(SUPPORTED_LANGUAGES['en']);
    useEffect(() => {
        if (browserLanguage in SUPPORTED_LANGUAGES) {
            setLanguageConfig(SUPPORTED_LANGUAGES[browserLanguage as LanguageCode] as LanguageConfigType);
        }
    }, [browserLanguage]);

    return [languageConfig, setLanguageConfig] as const;
};

export default useLanguageConfig;