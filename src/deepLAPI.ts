import { configFile } from './config.js';

export class DeepLAPI {
  private apiUrl = configFile.deepLUrl;
  private apiKey = configFile.deeplKey;

  public async translateToEnglish(text: string): Promise<string> {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        text: text,
        target_lang: 'EN',
        auth_key: this.apiKey,
      }),
    };

    try {
      const response = await fetch(`${this.apiUrl}/v2/translate`, requestOptions);
      const data = await response.json();
      return data.translations[0].text;
    } catch (error) {
      console.error('Error translating text with DeepL API:', error);
      throw error;
    }
  }
}
