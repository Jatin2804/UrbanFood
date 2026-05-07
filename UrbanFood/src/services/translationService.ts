// Translation service for fetching from GitHub

import { API_CONFIG } from '../config/env';

export class TranslationService {
  /**
   * Fetch translations from GitHub for a specific language
   * @param languageCode - Language code (en, hi, te, kn)
   * @returns Translations object or null if fetch fails
   */
  static async fetchTranslations(languageCode: string): Promise<any> {
    try {
      // Use the same raw content base URL as other API calls
      const url = `${API_CONFIG.RAW_CONTENT_BASE_URL}/translations/${languageCode}.json`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const translations = await response.json();
      return translations;
    } catch (error) {
      console.error(`Failed to fetch translations for ${languageCode}:`, error);
      return null;
    }
  }
}
