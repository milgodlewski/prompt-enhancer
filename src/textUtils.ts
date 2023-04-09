export class TextUtils {
    static cleanInputText(inputText: string): string {
        const removeMultipleSpaces = inputText.replace(/\s\s+/g, ' ');
        const removeMultiplePunctuation = removeMultipleSpaces.replace(/([.,!?])\1+/g, '$1');
        const trimSpacesBeforePunctuation = removeMultiplePunctuation.replace(/\s+([.,!?])/g, '$1');
        return trimSpacesBeforePunctuation;
    }
    
    static preprocessInputText(inputText: string): string {
        const removeMultipleSpaces = inputText.replace(/\s\s+/g, ' ');
        const removeMultiplePunctuation = removeMultipleSpaces.replace(/([.,!?])\1+/g, '$1');
        const trimSpacesBeforePunctuation = removeMultiplePunctuation.replace(/\s+([.,!?])/g, '$1');
        return trimSpacesBeforePunctuation;
    }
    
    static calculateTextSimilarity(text1: string, text2: string): number {
        const words1 = new Set(text1.split(/\s+/));
        const words2 = new Set(text2.split(/\s+/));
        const intersection = new Set([...words1].filter(word => words2.has(word)));
        const union = new Set([...words1, ...words2]);
        return intersection.size / union.size;
    }
    
    static populateModelSelection(models: string[]): void {
        const modelSelection = document.getElementById('modelSelection') as HTMLSelectElement;
        
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            if (model === 'gpt-3.5-turbo') {
                option.selected = true;
            }
            modelSelection.appendChild(option);
        });
    }
    
    static getInputText(): string {
        const inputTextArea = document.getElementById('inputText') as HTMLTextAreaElement;
        return inputTextArea.value;
    }
    
    static createGPT3Prompt(translatedText: string): string {
        const preprocessedText = TextUtils.preprocessInputText(translatedText);
        const instructions = `
        Please refine the following input text by:
        1. Correcting grammatical and spelling errors.
        2. Adding missing context to improve clarity and coherence.
        3. Clearly identifying the specific task or objective associated with the input.
        4. Adopting a professional tone, using information or terminology appropriate for an expert in the relevant field.
        5. Encouraging user focus and reflection on the implications and results of the input.
        
        Input Text:
        "${preprocessedText}"
        
        Return only the enhanced prompt, nothing more.
        `;
        
        return instructions;
    }
    
    setRefinedText(refinedText: string): void {
        const refinedTextElement = document.getElementById('refinedText') as HTMLDivElement;
        refinedTextElement.textContent = refinedText;
    }
    
}

