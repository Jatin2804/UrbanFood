// Language feature types

import { Translations } from '../../types/translations';

export interface LanguageState {
  currentLanguage: string;
  translations: Translations | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  pendingLanguage: string | null; // Language waiting for app restart
}
