// Minimal i18n loader; swap in i18next if preferred.
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

const i18n = new I18n({ en, es });
i18n.locale = Localization.locale.startsWith('es') ? 'es' : 'en';
i18n.enableFallback = true;

export default i18n;
