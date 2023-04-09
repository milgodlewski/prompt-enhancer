import { GPT3API } from './gpt3API.js';
import { LanguageToolAPI } from './languageToolAPI.js';
import { DeepLAPI } from './deepLAPI.js';
import { TextUtils } from './textUtils.js';

export class TextRefiner {
    private gpt3API: GPT3API;
    private languageToolAPI: LanguageToolAPI;
    private deepLAPI: DeepLAPI;
    private textUtils: TextUtils;
    
    constructor() {
        this.gpt3API = new GPT3API();
        this.languageToolAPI = new LanguageToolAPI();
        this.deepLAPI = new DeepLAPI();
        this.textUtils = new TextUtils();
    }
    
    public async populateModelSelection(): Promise<void> {
        try {
            const models = await this.gpt3API.getAvailableModels();
            console.log('Available models:', models);
            TextUtils.populateModelSelection(models);
        } catch (error) {
            console.error('Error fetching available models:', error);
        }
    }
    
    public async refineText(): Promise<void> {
        const inputText = TextUtils.getInputText();
        const cleanedInputText = TextUtils.cleanInputText(inputText);
        
        const translatedText = await this.deepLAPI.translateToEnglish(cleanedInputText);
        const gpt3Prompt = TextUtils.createGPT3Prompt(translatedText);
        console.log('Translated Text:', translatedText);
        
        try {
            console.log('Sending API request');
            const refinedText = await this.refineTextIteratively(gpt3Prompt, translatedText, 3);
            console.log('API response received:', refinedText);
            this.textUtils.setRefinedText(refinedText);
        } catch (error) {
            console.error('Error refining text:', error);
            alert('An error occurred while refining the text. Please try again.');
        }
    }
    
    private async refineTextIteratively(
        gpt3Prompt: string,
        inputText: string,
        maxIterations: number,
        ): Promise<string> {
            let currentIteration = 0;
            let refinedText = '';
            
            do {
                currentIteration++;
                refinedText = await this.gpt3API.refineTextWithGPT3(gpt3Prompt);
                
                if (await this.isResultSatisfactory(refinedText, inputText)) {
                    break;
                }
            } while (currentIteration < maxIterations);
            
            return refinedText;
        }
        
        private async isResultSatisfactory(refinedText: string, inputText: string): Promise<boolean> {
            const similarityThreshold = 0.8;
            const similarity = TextUtils.calculateTextSimilarity(refinedText, inputText);
            const grammarCheckResult = await this.languageToolAPI.checkGrammar(refinedText);
            
            return similarity < similarityThreshold && grammarCheckResult.matches.length === 0;
        }
    }
    
    