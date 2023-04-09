import { configFile } from './config.js';

export class GPT3API {
    private config = configFile;
    
    constructor() {}
    
    public async refineTextWithGPT3(gpt3Prompt: string): Promise<string> {
        const selectedModel = document.getElementById('modelSelection') as HTMLSelectElement;
        const requestBody = {
            model: this.config.model,
            prompt: gpt3Prompt,
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature
        };

        const response = await fetch(this.config.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.choices[0].text.trim();
        } else {
            const errorData = await response.json();
            console.error('Error data:', errorData);
            throw new Error(`API request failed with status ${response.status}`);
        }
    }
    
    public async getAvailableModels(): Promise<string[]> {
        const response = await fetch(this.config.openaiEnginesEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.data.map((engine: any) => engine.id);
        } else {
            const errorData = await response.json();
            console.error('Error data:', errorData);
            throw new Error(`API request failed with status ${response.status}`);
        }
    }
    
}
