import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationDE from './locales/de/translation.json';

// the translations
const resources = {
    en: {
        translation: translationEN.translation
    },
    es: {
        translation: translationES.translation
    },
    de: {
        translation: translationDE.translation
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en', // language to use, more will be added later
        fallbackLng: 'en', // use en if detected lng is not available

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
