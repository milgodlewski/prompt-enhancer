export class LanguageToolAPI {
  private apiUrl = 'https://api.languagetoolplus.com/v2/check';

  public async checkGrammar(text: string): Promise<any> {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        text: text,
        language: 'en-US'
      }),
    };

    try {
      const response = await fetch(this.apiUrl, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking grammar with LanguageTool API:', error);
      throw error;
    }
  }
}
